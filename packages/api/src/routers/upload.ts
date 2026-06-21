import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "@headshot-studio/env/server";

import { protectedProcedure, router } from "../index";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB
const PRESIGN_EXPIRES_IN = 60 * 5; // 5 minutes

function getS3Config() {
  if (!env.AWS_S3_BUCKET) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "S3 storage is not configured",
    });
  }
  const credentialConfig =
    env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
      ? {
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
          },
        }
      : {};
  return {
    s3: new S3Client({ region: env.AWS_REGION, ...credentialConfig }),
    bucket: env.AWS_S3_BUCKET,
  };
}

export const uploadRouter = router({
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(1).max(255),
        fileType: z.string().refine((t) => ALLOWED_TYPES.includes(t), {
          message: "File type not allowed. Use JPEG, PNG, WebP, or HEIC.",
        }),
        fileSize: z.number().int().positive().max(MAX_SIZE_BYTES, {
          message: "File size exceeds 20MB limit.",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const ext = input.fileName.split(".").pop() ?? "jpg";
      const fileKey = `uploads/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { s3, bucket } = getS3Config();
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: fileKey,
        ContentType: input.fileType,
        ContentLength: input.fileSize,
        Metadata: {
          userId,
          originalName: input.fileName,
        },
      });

      const presignedUrl = await getSignedUrl(s3, command, {
        expiresIn: PRESIGN_EXPIRES_IN,
      });

      return { presignedUrl, fileKey };
    }),

  confirmUpload: protectedProcedure
    .input(
      z.object({
        fileKey: z.string().min(1),
        fileName: z.string().min(1),
        fileSize: z.number().int().positive(),
        fileType: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Verify the fileKey belongs to this user
      if (!input.fileKey.startsWith(`uploads/${userId}/`)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "File key does not belong to this user.",
        });
      }

      const uploadedFile = await ctx.db.uploadedFile.create({
        data: {
          userId,
          fileKey: input.fileKey,
          fileName: input.fileName,
          fileSize: input.fileSize,
          fileType: input.fileType,
          status: "UPLOADED",
        },
      });

      return { success: true, uploadedFile };
    }),

  listUploads: protectedProcedure
    .input(
      z.object({
        status: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const uploads = await ctx.db.uploadedFile.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          userId,
          ...(input.status ? { status: input.status } : {}),
        },
        orderBy: { uploadedAt: "desc" },
      });

      let nextCursor: string | undefined = undefined;
      if (uploads.length > input.limit) {
        const nextItem = uploads.pop();
        nextCursor = nextItem?.id;
      }

      return { uploads, nextCursor };
    }),
});
