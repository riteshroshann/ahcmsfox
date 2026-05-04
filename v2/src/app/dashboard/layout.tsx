export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("STUDENT_PROFILE")
    .select("name")
    .eq("student_id", user.id)
    .single();

  return (
    <div className="app-layout">
      <Sidebar role="student" userName={profile?.name || user.email || "Student"} />
      <main className="main">{children}</main>
    </div>
  );
}
