"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, Clock, TrendingUp, PhoneIncoming, PhoneMissed } from "lucide-react";
import { formatCurrency, formatDuration } from "@/lib/utils";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

interface DashboardContentProps {
  user: User;
  profile: any;
  calls: any[];
  stats: any;
}

export function DashboardContent({
  user,
  profile,
  calls,
  stats,
}: DashboardContentProps) {
  const defaultStats = {
    total_calls: 0,
    calls_answered: 0,
    appointments_booked: 0,
    minutes_used: 0,
    estimated_revenue: 0,
  };

  const currentStats = stats || defaultStats;

  const statsCards = [
    {
      title: "Total Calls",
      value: currentStats.total_calls,
      icon: PhoneIncoming,
      description: "This month",
    },
    {
      title: "Calls Answered",
      value: `${currentStats.calls_answered}%`,
      icon: Phone,
      description: "Answer rate",
    },
    {
      title: "Appointments Booked",
      value: currentStats.appointments_booked,
      icon: Calendar,
      description: "This month",
    },
    {
      title: "Estimated Revenue",
      value: formatCurrency(currentStats.estimated_revenue),
      icon: TrendingUp,
      description: "At $200/appointment",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome, {profile?.practice_name || "Your Practice"}
        </h1>
        <p className="text-muted-foreground">
          Here's how DentalCall AI is helping your practice today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Configure your AI receptionist
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/dashboard/configure">
              <Phone className="mr-2 h-4 w-4" />
              Configure Voice Agent
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/test-call">
              Make Test Call
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/settings/integrations">
              Connect Calendar
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Calls */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
          <CardDescription>
            Your latest AI-handled calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          {calls.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <PhoneMissed className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No calls yet. Configure your AI agent to start receiving calls.</p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/configure">Get Started</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {calls.slice(0, 5).map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-full p-2 ${
                        call.outcome === "booked"
                          ? "bg-green-100 text-green-600"
                          : call.outcome === "transferred"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{call.caller_name || "Unknown Caller"}</p>
                      <p className="text-sm text-muted-foreground">
                        {call.caller_phone}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium capitalize">{call.outcome}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDuration(call.duration_seconds)}
                    </p>
                  </div>
                </div>
              ))}
              {calls.length > 5 && (
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/dashboard/calls">View All Calls</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Minutes Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Minutes Usage</CardTitle>
          <CardDescription>
            Track your monthly usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Used this month</span>
              <span className="font-medium">
                {currentStats.minutes_used} / 2,000 minutes
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{
                  width: `${Math.min((currentStats.minutes_used / 2000) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Resets on the 1st of each month. Overage: $0.15/minute.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
