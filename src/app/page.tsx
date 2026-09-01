"use client";

import { useRouter } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";
import { SupportChatWidget } from "@/components/SupportChatWidget";
import { UserProfile } from "@/types";
import { useState, useEffect } from "react";
import { getActiveUser } from "@/lib/auth-utils";

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    getActiveUser().then((user) => {
      if (user) setCurrentUser(user);
    });
  }, []);

  const navigate = (route: string) => router.push(route);

  const handleQuickDemo = () => {
    // Navigate to register for demo — actual demo mode handled on dashboard
    router.push("/register");
  };

  return (
    <>
      <LandingPage
        onNavigate={navigate}
        isLoggedIn={Boolean(currentUser)}
        onQuickDemo={handleQuickDemo}
      />
      <SupportChatWidget />
    </>
  );
}
