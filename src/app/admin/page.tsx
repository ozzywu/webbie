"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#f3f0e9" }}
    >
      <div className="w-full max-w-sm p-8">
        <h1
          className="text-2xl mb-8"
          style={{
            color: "#670000",
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 500,
          }}
        >
          Admin
        </h1>

        <form action={formAction} className="flex flex-col gap-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-3 py-2 border rounded text-sm outline-none"
            style={{
              borderColor: "rgba(157, 124, 124, 0.3)",
              color: "#2a211c",
              fontFamily: "var(--font-geist-sans)",
              background: "transparent",
            }}
            autoFocus
          />

          {state?.error && (
            <p className="text-sm" style={{ color: "#b56b5d" }}>
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 rounded text-sm transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{
              background: "#670000",
              color: "#f3f0e9",
              fontFamily: "var(--font-geist-sans)",
            }}
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
