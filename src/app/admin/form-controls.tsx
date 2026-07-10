"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import type { AdminActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

type AdminAction = (
  prevState: AdminActionState,
  formData: FormData,
) => Promise<AdminActionState>;

const idleAdminActionState: AdminActionState = {
  ok: false,
  message: "",
  nonce: 0,
};

export function AdminActionForm({
  action,
  children,
  className,
  resetOnSuccess,
}: {
  action: AdminAction;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(action, idleAdminActionState);
  const [dismissedNonce, setDismissedNonce] = useState(0);
  const showToast = Boolean(state.nonce && state.nonce !== dismissedNonce);

  useEffect(() => {
    if (!state.nonce) {
      return;
    }

    if (state.ok && resetOnSuccess) {
      formRef.current?.reset();
    }

    const timeout = window.setTimeout(() => setDismissedNonce(state.nonce), 3600);
    return () => window.clearTimeout(timeout);
  }, [resetOnSuccess, state.nonce, state.ok]);

  return (
    <>
      <form ref={formRef} action={formAction} className={className} encType="multipart/form-data">
        {children}
      </form>
      {showToast && <AdminToast state={state} />}
    </>
  );
}

export function AdminOtpLogin({
  requestAction,
  verifyAction,
  disabled,
}: {
  requestAction: AdminAction;
  verifyAction: AdminAction;
  disabled?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [requestState, requestFormAction] = useActionState(requestAction, idleAdminActionState);
  const [verifyState, verifyFormAction] = useActionState(verifyAction, idleAdminActionState);
  const canVerify = Boolean(requestState.ok && email.trim());

  return (
    <div className="mt-8 grid gap-5">
      <form action={requestFormAction} className="grid gap-4">
        <label className="grid gap-2 text-sm font-semibold">
          Email
          <input
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="admin-input"
          />
        </label>
        <PendingButton disabled={disabled} pendingLabel="Sending code...">
          Send email code
        </PendingButton>
      </form>

      {requestState.nonce ? (
        <p
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
            requestState.ok
              ? "border-emerald-400/45 bg-emerald-400/10 text-emerald-100"
              : "border-red-400/45 bg-red-400/10 text-red-100"
          }`}
          role="status"
        >
          {requestState.message}
        </p>
      ) : null}

      {canVerify ? (
        <form action={verifyFormAction} className="grid gap-4 rounded-2xl border border-[rgb(var(--line))] p-4">
          <input type="hidden" name="email" value={email} />
          <label className="grid gap-2 text-sm font-semibold">
            One-time code
            <input
              name="token"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              required
              className="admin-input text-center text-lg font-black tracking-[0.3em]"
            />
          </label>
          <PendingButton disabled={disabled} pendingLabel="Verifying code...">
            Verify and open admin
          </PendingButton>
          {verifyState.nonce ? (
            <p className="text-sm font-semibold text-red-100" role="alert">
              {verifyState.message}
            </p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}

export function PendingButton({
  children,
  pendingLabel = "Saving...",
  className,
  variant,
  disabled,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  variant?: "default" | "secondary" | "ghost";
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button className={className} disabled={pending || disabled} variant={variant}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? pendingLabel : children}
    </Button>
  );
}

function AdminToast({ state }: { state: AdminActionState }) {
  return (
    <div
      className={`fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border px-4 py-3 text-sm font-semibold shadow-soft backdrop-blur-xl ${
        state.ok
          ? "border-emerald-400/45 bg-slate-950/95 text-emerald-100"
          : "border-red-400/45 bg-slate-950/95 text-red-100"
      }`}
      role="status"
    >
      {state.message}
    </div>
  );
}
