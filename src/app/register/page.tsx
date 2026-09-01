"use client";

import { AuthView } from "@/components/AuthView";
import { SupportChatWidget } from "@/components/SupportChatWidget";

export default function RegisterPage() {
  return (
    <>
      <AuthView mode="register" />
      <SupportChatWidget />
    </>
  );
}
