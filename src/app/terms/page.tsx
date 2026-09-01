import { LegalPage } from "@/components/LegalPages";
import { SupportChatWidget } from "@/components/SupportChatWidget";

export default function TermsPage() {
  return (
    <>
      <LegalPage route="/terms" />
      <SupportChatWidget />
    </>
  );
}
