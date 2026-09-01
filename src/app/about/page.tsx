"use client";

import { useRouter } from "next/navigation";
import { AboutPage } from "@/components/AboutPage";
import { SupportChatWidget } from "@/components/SupportChatWidget";

export default function AboutRoute() {
  const router = useRouter();
  const navigate = (route: string) => router.push(route);

  return (
    <>
      <AboutPage onNavigate={navigate} isLoggedIn={false} />
      <SupportChatWidget />
    </>
  );
}
