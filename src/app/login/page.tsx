"use client";

import { AuthView } from "@/components/AuthView";
import { SupportChatWidget } from "@/components/SupportChatWidget";

export default function LoginPage() {
  return (
    <>
      <AuthView mode="login" />
      <SupportChatWidget />
    </>
  );
}
