"use client";

import { useActionState } from "react";
import { signInAction } from "@/features/admin/auth/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function AdminLoginPageRoot() {
  const [errorMessage, formAction, isPending] = useActionState(
    signInAction,
    undefined
  );

  return (
    <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Admin Login
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Enter your email and password to access the dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" required />
            </div>
            {errorMessage && (
              <div className="text-red-500 text-sm font-medium">
                {errorMessage}
              </div>
            )}
            <Button
              className="w-full"
              type="submit"
              aria-disabled={isPending}
              disabled={isPending}
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground">
            Restricted access only
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
