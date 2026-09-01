"use client";

import { useRouter } from "next/navigation";
import { ContactPage } from "@/components/ContactPage";
import { SupportChatWidget } from "@/components/SupportChatWidget";

export default function ContactRoute() {
  const router = useRouter();
  const navigate = (route: string) => router.push(route);

  return (
    <>
      <ContactPage onNavigate={navigate} isLoggedIn={false} />
      <SupportChatWidget />
    </>
  );
}
