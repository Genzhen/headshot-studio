"use client";

import { CheckCircle, Loader2, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc, queryClient } from "@/utils/trpc";

export default function ProfileEditor() {
  const [name, setName] = useState("");

  const profile = useQuery(trpc.user.getProfile.queryOptions());

  useEffect(() => {
    if (profile.data) setName(profile.data.name);
  }, [profile.data]);

  const updateProfile = useMutation({
    ...trpc.user.updateProfile.mutationOptions(),
    onSuccess: (data) => {
      toast.success("Profile updated");
      setName(data.name);
      void queryClient.invalidateQueries(trpc.user.getProfile.queryOptions());
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ name: name.trim() });
  };

  if (profile.isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  const user = profile.data;
  if (!user) return null;

  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-white p-8 shadow-sm">
      {/* Avatar placeholder */}
      <div className="mb-8 flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary-fixed/30 text-on-secondary-container">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <User className="h-10 w-10" />
          )}
        </div>
        <div>
          <p className="text-headline-md text-primary">{user.name}</p>
          <p className="text-body-md text-on-surface-variant">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name field */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-label-sm text-on-surface"
          >
            Display Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            maxLength={100}
            className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-body-md text-on-surface outline-none transition-all focus:border-secondary-container focus:ring-2 focus:ring-secondary-container/20"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="mb-2 block text-label-sm text-on-surface">
            Email Address
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low px-4 py-3">
            <span className="text-body-md text-on-surface-variant flex-1">
              {user.email}
            </span>
            {user.emailVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container/30 px-2 py-0.5 text-label-xs text-on-secondary-container">
                <CheckCircle className="h-3 w-3" />
                Verified
              </span>
            ) : (
              <span className="rounded-full bg-surface-container px-2 py-0.5 text-label-xs text-on-surface-variant">
                Unverified
              </span>
            )}
          </div>
          <p className="mt-1 text-label-xs text-on-surface-variant">
            Email cannot be changed.
          </p>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={
              updateProfile.isPending ||
              !name.trim() ||
              name.trim() === user.name
            }
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-label-sm text-white shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {updateProfile.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
