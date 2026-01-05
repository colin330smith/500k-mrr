"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { analytics } from "@/components/providers/posthog-provider";
import { toast } from "sonner";
import { User, CreditCard, Trash2 } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface SettingsContentProps {
  user: SupabaseUser;
  profile: any;
  subscription: any;
}

export function SettingsContent({
  user,
  profile,
  subscription,
}: SettingsContentProps) {
  const router = useRouter();
  const [practiceName, setPracticeName] = useState(profile?.practice_name || "");
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("profiles")
        .update({
          practice_name: practiceName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      toast.error("Failed to open billing portal");
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You'll lose access at the end of your billing period.")) {
      return;
    }

    setCancelLoading(true);

    try {
      const response = await fetch("/api/stripe/cancel", {
        method: "POST",
      });

      if (response.ok) {
        analytics.subscriptionCancelled(subscription?.plan || "unknown");
        toast.success("Subscription cancelled. You'll have access until the end of your billing period.");
        router.refresh();
      } else {
        throw new Error("Failed to cancel");
      }
    } catch (error) {
      toast.error("Failed to cancel subscription");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    if (!confirm("This will permanently delete all your data. Type 'DELETE' to confirm.")) {
      return;
    }

    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
      });

      if (response.ok) {
        const supabase = createClient();
        await supabase.auth.signOut();
        analytics.reset();
        router.push("/");
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and subscription
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Update your practice details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email || ""} disabled />
              <p className="text-xs text-muted-foreground">
                Contact support to change your email address
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="practice">Practice Name</Label>
              <Input
                id="practice"
                value={practiceName}
                onChange={(e) => setPracticeName(e.target.value)}
                placeholder="Your Dental Practice"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </CardTitle>
          <CardDescription>
            Manage your billing and subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {subscription?.plan
                    ? `${subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan`
                    : "No active subscription"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {subscription?.status === "active"
                    ? "Your subscription is active"
                    : subscription?.status === "trialing"
                    ? `Trial ends ${new Date(subscription.trial_end).toLocaleDateString()}`
                    : "Start a subscription to use DentalCall AI"}
                </p>
              </div>
              <div className="text-right">
                {subscription?.status === "active" && (
                  <p className="text-2xl font-bold">
                    ${subscription.plan === "starter" ? 299 : subscription.plan === "professional" ? 599 : 999}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {subscription?.status ? (
              <>
                <Button onClick={handleManageSubscription}>
                  Manage Billing
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelSubscription}
                  disabled={cancelLoading || subscription?.cancel_at_period_end}
                >
                  {subscription?.cancel_at_period_end
                    ? "Cancellation Pending"
                    : cancelLoading
                    ? "Cancelling..."
                    : "Cancel Subscription"}
                </Button>
              </>
            ) : (
              <Button asChild>
                <a href="/#pricing">View Plans</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-destructive/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
