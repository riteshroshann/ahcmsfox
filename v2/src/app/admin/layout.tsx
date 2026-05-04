export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Sidebar from "@/components/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.app_metadata?.role !== "admin") redirect("/dashboard");

  const { data: profile } = await supabase
    .from("ADMIN_PROFILE")
    .select("name")
    .eq("admin_id", user.id)
    .single();

  return (
    <div className="app-layout">
      <Sidebar role="admin" userName={profile?.name || user.email || "Admin"} />
      <main className="main">{children}</main>
    </div>
  );
}
