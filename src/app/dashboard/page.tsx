import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import DashboardClient from "@/components/DashboardClient";

/**
 * Server component: checks authentication before rendering the dashboard.
 * Redirects to /login if the user is not authenticated.
 */
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userProfile = {
    id: user.id,
    email: user.email || "",
    fullName: user.user_metadata?.full_name || "Dr. Medical Practitioner",
    avatarUrl: user.user_metadata?.avatar_url,
    clinicName: user.user_metadata?.clinic_name || "CarePen Clinic",
  };

  return <DashboardClient initialUser={userProfile} />;
}
