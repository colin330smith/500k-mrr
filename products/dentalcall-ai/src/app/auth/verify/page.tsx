import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent you a verification link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in your email to verify your account and start your
            free trial. The link expires in 24 hours.
          </p>
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="font-medium">Didn't receive the email?</p>
            <p className="text-muted-foreground">
              Check your spam folder or{" "}
              <Link href="/auth/signup" className="text-primary hover:underline">
                try signing up again
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
