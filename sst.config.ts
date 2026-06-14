/// <reference path="./.sst/platform/config.d.ts" />

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export default $config({
  app(input) {
    return {
      name: "headshot-studio",
      home: "aws",
      providers: {
        aws: {
          region: process.env.AWS_REGION ?? "us-east-1",
        },
      },
      removal: input?.stage === "production" ? "retain" : "remove",
    };
  },
  async run() {
    const appDomain = process.env.APP_DOMAIN?.trim();
    const betterAuthUrl = process.env.BETTER_AUTH_URL?.trim();
    const corsOrigin = process.env.CORS_ORIGIN?.trim();
    const bootstrapUrl = "https://bootstrap.invalid";

    const resolvedAuthUrl =
      betterAuthUrl ?? (appDomain ? `https://${appDomain}` : bootstrapUrl);
    const resolvedCorsOrigin =
      corsOrigin ?? (appDomain ? `https://${appDomain}` : bootstrapUrl);

    const web = new sst.aws.Nextjs("Web", {
      path: "apps/web",
      domain: appDomain
        ? {
            name: appDomain,
            redirects: appDomain.startsWith("www.") ? [] : [`www.${appDomain}`],
          }
        : undefined,
      environment: {
        DATABASE_URL: readRequiredEnv("DATABASE_URL"),
        BETTER_AUTH_SECRET: readRequiredEnv("BETTER_AUTH_SECRET"),
        BETTER_AUTH_URL: resolvedAuthUrl,
        CORS_ORIGIN: resolvedCorsOrigin,
        NODE_ENV: "production",
      },
      server: {
        runtime: "nodejs22.x",
        memory: "1024 MB",
        timeout: "30 seconds",
      },
      imageOptimization: {
        memory: "1024 MB",
      },
      invalidation: {
        wait: $app.stage === "production",
      },
    });

    return {
      url: web.url,
    };
  },
});
