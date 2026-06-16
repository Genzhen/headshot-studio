"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import SiteFooter from "@/components/site-footer";

type AuthMode = "signin" | "signup";

const socialButtonClasses =
  "mb-6 flex w-full items-center justify-center gap-3 rounded-lg border border-outline-variant px-4 py-3 text-primary transition-colors duration-150 hover:bg-surface-container active:scale-[0.98]";

function GoogleBadge() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AuthDivider() {
  return (
    <div className="relative mb-6 flex items-center">
      <div className="flex-grow border-t border-outline-variant" />
      <span className="mx-4 text-label-xs uppercase tracking-wider text-on-surface-variant">
        Or email
      </span>
      <div className="flex-grow border-t border-outline-variant" />
    </div>
  );
}

function BrandPanel() {
  const trustAvatars = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDNC__Mvv5CvC-ACS8rgim1WhENTqCggb6grYiuCGpwI3xFvTvuqIci6duGczfZerJuGMyCcBodG3HzoDkYgeX9ukuhG6BHvOzuTxtNnSPk_XF4GvQ6Z8KEtckhg3M7DGAY82qU7_F35XDnDBmbaVpqyQGSA2nfHWCsdgDcOlXAOzSQAJtiFay6owWRIKJ3b4dJxiazynUb9-rPiuRiMAL9EDa7ivhkmeBBjfJKINC7fVCl06q3DfgEkENYt_8KZuYjbz8fvTdZ9Q",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBObWND-yZWWSm-1A5kqN8e2TX1WH7XV4kzYlLseJY_1I9NdBq4lIb7_4SBtED9p_y95YNpZ4X9OjkTXVgVx5M_Wh7gai4pHdirMYhKocYjUUE8q8PKVNesltC0-wiz5_cB6phxFUS8kVteLax5mxPyXxtP0KQOWiqasETha9MjAlWpapmwiMR3XuqIshMDQ3qJ4pcXauwgQWwQ_rDW50IbWsmzDrh7z7-5m_cjr2hZFBabxQQTTYtKAXkWcufIdH_Ef1hoYMo9ww",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC00Wt_0vMHvvjbxcxGDSt6v3EC9ie1nzigSrE8oZv7QzncqEWW_g2Dg5-WmwRfalJEpmnRfNykJhOAlxy9LCXKqCZC7qqcTovIXFFCeNFWZI9UxzsuKLx1SLiU46vBr824ii567t5MX3R23kdIKEO5mLRzMz56MvV9RPkbkArp4aer5f4qPCpRptoHJxA3J6L-RQm7kkbyx4M0t00Ucjdn-tSBtixL2EP7uSu09sxDsINZOch9sNvEPzbVKfsqZz9KCt_ri9-AEg",
  ];

  return (
    <div className="relative hidden overflow-hidden rounded-xl bg-primary-container p-12 text-white lg:flex lg:col-span-7 lg:flex-col lg:justify-center">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8Hi1YFdcYI95GehG7sSgFaS-R0KbXnc5t7Yhi6fhVRZMumYQNZMqW8xtDpjFOkgS3LBtR_7nmZNTdLK-7CiHwtWHrhmoWkfsmDUO6Ww5FKcuxQBkb-il02KJ80Gq3_V07C3Yj6IqmKfjvG8YWwpAaME_pj7osuA8mg_Bg8LLZ7_pldyysjR6YWdMYbXnZGHe4sXe0nrvFfPSPLyQM0ezJBSiTfIc99-ifOFqFcnrHjU_dBPuCmHrZUtWBqI7oYlr4gdtX1T6Hqw"
        alt="AIGEN Studio brand visual"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />

      <div className="relative z-10">
        <h1 className="mb-6 text-display-lg text-white">
          Redefining Professional
          <br />
          <span className="text-secondary-container">Identity with AI.</span>
        </h1>
        <p className="mb-[var(--spacing-stack-md)] max-w-lg text-body-lg text-on-primary-container">
          Join the world&apos;s leading executives and creatives who trust AIGEN Studio for their
          digital presence.
        </p>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {trustAvatars.map((avatar, index) => (
              <img
                key={avatar}
                src={avatar}
                alt={`Professional ${index + 1}`}
                className="h-10 w-10 rounded-full border-2 border-primary-container object-cover"
              />
            ))}
          </div>
          <p className="text-label-sm text-on-primary-container">Trusted by 10,000+ professionals</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const { isPending } = authClient.useSession();

  const signInForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            toast.success("Sign in successful");
            router.push("/dashboard");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
  });

  const signUpForm = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: z.object({
        firstName: z.string().min(2, "First name must be at least 2 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: `${value.firstName} ${value.lastName}`.trim(),
        },
        {
          onSuccess: () => {
            toast.success("Sign up successful");
            router.push("/dashboard");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-grow px-[var(--spacing-margin-mobile)] py-[var(--spacing-stack-lg)]">
        <div className="container-max mx-auto grid grid-cols-1 gap-[var(--spacing-gutter)] lg:grid-cols-12">
          <BrandPanel />

          <div className="flex flex-col justify-center lg:col-span-5">
            <div className="mx-auto w-full max-w-md rounded-xl bg-white p-8 shadow-[0px_4px_20px_rgba(10,37,64,0.06)] md:p-12">
              {mode === "signin" ? (
                <div>
                  <div className="mb-[var(--spacing-stack-md)]">
                    <h2 className="mb-2 text-headline-md text-primary">Welcome Back</h2>
                    <p className="text-body-md text-on-surface-variant">
                      Sign in to your AIGEN Studio account.
                    </p>
                  </div>

                  <button
                    type="button"
                    className={socialButtonClasses}
                    onClick={() => toast.info("Google sign-in is not configured yet.")}
                  >
                    <GoogleBadge />
                    Continue with Google
                  </button>

                  <AuthDivider />

                  <form
                    className="space-y-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      signInForm.handleSubmit();
                    }}
                  >
                    <signInForm.Field name="email">
                      {(field) => (
                        <div>
                          <label className="mb-1.5 block text-label-sm text-primary" htmlFor={field.name}>
                            Email Address
                          </label>
                          <input
                            id={field.name}
                            name={field.name}
                            type="email"
                            placeholder="name@company.com"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            className="w-full rounded-lg border border-outline-variant px-4 py-3 outline-none transition-all placeholder:text-outline focus:border-secondary-container focus:ring-2 focus:ring-secondary-container"
                          />
                          {field.state.meta.errors.map((error) => (
                            <p key={error?.message} className="mt-1 text-sm text-error">
                              {error?.message}
                            </p>
                          ))}
                        </div>
                      )}
                    </signInForm.Field>

                    <signInForm.Field name="password">
                      {(field) => (
                        <div>
                          <div className="mb-1.5 flex items-center justify-between">
                            <label className="block text-label-sm text-primary" htmlFor={field.name}>
                              Password
                            </label>
                            <button
                              type="button"
                              className="text-label-xs text-secondary hover:underline"
                              onClick={() => toast.info("Forgot password flow is not wired yet.")}
                            >
                              Forgot password?
                            </button>
                          </div>
                          <input
                            id={field.name}
                            name={field.name}
                            type="password"
                            placeholder="••••••••"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            className="w-full rounded-lg border border-outline-variant px-4 py-3 outline-none transition-all placeholder:text-outline focus:border-secondary-container focus:ring-2 focus:ring-secondary-container"
                          />
                          {field.state.meta.errors.map((error) => (
                            <p key={error?.message} className="mt-1 text-sm text-error">
                              {error?.message}
                            </p>
                          ))}
                        </div>
                      )}
                    </signInForm.Field>

                    <signInForm.Subscribe
                      selector={(state) => ({
                        canSubmit: state.canSubmit,
                        isSubmitting: state.isSubmitting,
                      })}
                    >
                      {({ canSubmit, isSubmitting }) => (
                        <button
                          type="submit"
                          disabled={!canSubmit || isSubmitting || isPending}
                          className="mt-4 w-full rounded-lg bg-secondary-container py-3 font-bold text-primary shadow-md transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSubmitting ? "Signing In..." : "Sign In"}
                        </button>
                      )}
                    </signInForm.Subscribe>
                  </form>

                  <p className="mt-8 text-center text-label-sm text-on-surface-variant">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      className="font-bold text-secondary hover:underline"
                      onClick={() => setMode("signup")}
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-[var(--spacing-stack-md)]">
                    <h2 className="mb-2 text-headline-md text-primary">Join AIGEN Studio</h2>
                    <p className="text-body-md text-on-surface-variant">
                      Start generating professional portraits.
                    </p>
                  </div>

                  <button
                    type="button"
                    className={socialButtonClasses}
                    onClick={() => toast.info("Google sign-up is not configured yet.")}
                  >
                    <GoogleBadge />
                    Sign up with Google
                  </button>

                  <AuthDivider />

                  <form
                    className="space-y-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      signUpForm.handleSubmit();
                    }}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <signUpForm.Field name="firstName">
                        {(field) => (
                          <div>
                            <label className="mb-1.5 block text-label-sm text-primary" htmlFor={field.name}>
                              First Name
                            </label>
                            <input
                              id={field.name}
                              name={field.name}
                              type="text"
                              placeholder="John"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(event) => field.handleChange(event.target.value)}
                              className="w-full rounded-lg border border-outline-variant px-4 py-3 outline-none transition-all placeholder:text-outline focus:border-secondary-container focus:ring-2 focus:ring-secondary-container"
                            />
                            {field.state.meta.errors.map((error) => (
                              <p key={error?.message} className="mt-1 text-sm text-error">
                                {error?.message}
                              </p>
                            ))}
                          </div>
                        )}
                      </signUpForm.Field>

                      <signUpForm.Field name="lastName">
                        {(field) => (
                          <div>
                            <label className="mb-1.5 block text-label-sm text-primary" htmlFor={field.name}>
                              Last Name
                            </label>
                            <input
                              id={field.name}
                              name={field.name}
                              type="text"
                              placeholder="Doe"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(event) => field.handleChange(event.target.value)}
                              className="w-full rounded-lg border border-outline-variant px-4 py-3 outline-none transition-all placeholder:text-outline focus:border-secondary-container focus:ring-2 focus:ring-secondary-container"
                            />
                            {field.state.meta.errors.map((error) => (
                              <p key={error?.message} className="mt-1 text-sm text-error">
                                {error?.message}
                              </p>
                            ))}
                          </div>
                        )}
                      </signUpForm.Field>
                    </div>

                    <signUpForm.Field name="email">
                      {(field) => (
                        <div>
                          <label className="mb-1.5 block text-label-sm text-primary" htmlFor={field.name}>
                            Email Address
                          </label>
                          <input
                            id={field.name}
                            name={field.name}
                            type="email"
                            placeholder="name@company.com"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            className="w-full rounded-lg border border-outline-variant px-4 py-3 outline-none transition-all placeholder:text-outline focus:border-secondary-container focus:ring-2 focus:ring-secondary-container"
                          />
                          {field.state.meta.errors.map((error) => (
                            <p key={error?.message} className="mt-1 text-sm text-error">
                              {error?.message}
                            </p>
                          ))}
                        </div>
                      )}
                    </signUpForm.Field>

                    <signUpForm.Field name="password">
                      {(field) => (
                        <div>
                          <label className="mb-1.5 block text-label-sm text-primary" htmlFor={field.name}>
                            Create Password
                          </label>
                          <input
                            id={field.name}
                            name={field.name}
                            type="password"
                            placeholder="Min. 8 characters"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            className="w-full rounded-lg border border-outline-variant px-4 py-3 outline-none transition-all placeholder:text-outline focus:border-secondary-container focus:ring-2 focus:ring-secondary-container"
                          />
                          {field.state.meta.errors.map((error) => (
                            <p key={error?.message} className="mt-1 text-sm text-error">
                              {error?.message}
                            </p>
                          ))}
                        </div>
                      )}
                    </signUpForm.Field>

                    <p className="mt-2 text-[10px] leading-tight text-on-surface-variant">
                      By signing up, you agree to our{" "}
                      <span className="text-secondary underline">Terms of Service</span> and{" "}
                      <span className="text-secondary underline">Privacy Policy</span>.
                    </p>

                    <signUpForm.Subscribe
                      selector={(state) => ({
                        canSubmit: state.canSubmit,
                        isSubmitting: state.isSubmitting,
                      })}
                    >
                      {({ canSubmit, isSubmitting }) => (
                        <button
                          type="submit"
                          disabled={!canSubmit || isSubmitting || isPending}
                          className="mt-4 w-full rounded-lg bg-secondary-container py-3 font-bold text-primary shadow-md transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSubmitting ? "Creating Account..." : "Create Account"}
                        </button>
                      )}
                    </signUpForm.Subscribe>
                  </form>

                  <p className="mt-8 text-center text-label-sm text-on-surface-variant">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="font-bold text-secondary hover:underline"
                      onClick={() => setMode("signin")}
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter variant="simple" />
    </div>
  );
}
