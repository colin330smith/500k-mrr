import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user's practice and call data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: calls } = await supabase
    .from("calls")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: stats } = await supabase
    .from("call_stats")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <DashboardContent
      user={user}
      profile={profile}
      calls={calls || []}
      stats={stats}
    />
  );
}
