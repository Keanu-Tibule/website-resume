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
      <form ref={formRef} action={formAction} className={className}>
        {children}
      </form>
      {showToast && <AdminToast state={state} />}
    </>
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
          ? "border-emerald-300 bg-emerald-50/95 text-emerald-800"
          : "border-red-300 bg-red-50/95 text-red-800"
      }`}
      role="status"
    >
      {state.message}
    </div>
  );
}
