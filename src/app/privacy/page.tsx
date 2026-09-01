import { LegalPage } from "@/components/LegalPages";
import { SupportChatWidget } from "@/components/SupportChatWidget";

export default function PrivacyPage() {
  return (
    <>
      <LegalPage route="/privacy" />
      <SupportChatWidget />
    </>
  );
}
