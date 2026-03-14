"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AccessRole } from "../lib/access-role";
import type { Locale } from "../lib/locale";

type AccessGateProps = {
  locale: Locale;
  copy: {
    eyebrow: string;
    title: string;
    roleLabel: string;
    roleOptions: Record<AccessRole, string>;
    passwordLabel: string;
    passwordPlaceholder: string;
    unlockIdle: string;
    unlockBusy: string;
    accessDenied: string;
  };
};

export function AccessGate({ locale, copy }: AccessGateProps) {
  const router = useRouter();
  const [role, setRole] = useState<AccessRole>("customer");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password, role })
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        redirectTo?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? copy.accessDenied);
      }

      router.push(payload.redirectTo ?? "/");
      router.refresh();
    } catch (accessError) {
      setError(
        accessError instanceof Error ? accessError.message : copy.accessDenied
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <div className="sectionhead">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          <span>{copy.roleLabel}</span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as AccessRole)}
          >
            <option value="customer">{copy.roleOptions.customer}</option>
            <option value="builder">{copy.roleOptions.builder}</option>
            <option value="ops">{copy.roleOptions.ops}</option>
          </select>
        </label>
        <label>
          <span>{copy.passwordLabel}</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={copy.passwordPlaceholder}
            autoFocus
          />
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? copy.unlockBusy : copy.unlockIdle}
        </button>
      </form>
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
