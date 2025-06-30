"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LoginPageProps {
    onGoToSignUp: () => void
}

export default function Login({ onGoToSignUp }: LoginPageProps) {
    // #region CONST
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Forgot password states
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState<string | null>(null);
    const router = useRouter();
    // #endregion

    useEffect(() => {
        // Clear error when user modifies inputs
        if (error) {
            setError(null);
        }
    }, [email, password]);

    // #region METHOD
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }

            // Only navigate if there's no error
            router.push("/dashboard");
            // Don't set loading to false here as we're navigating away
        } catch (err) {
            setError("An unexpected error occurred");
            setLoading(false);
        }
    };

    const handleSignInWithGoogle = async () => {
        setResetError(null);

        try {
            const supabase = createClient();

            const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/dashboard`, // ✅ gunakan window.location.origin untuk menjamin kesesuaian
            },
            });

            console.log("OAuth data:", data);
            if (error) {
            console.error("OAuth error:", error);
            setResetError(error.message);
            }
            // Tidak perlu router.push di sini karena OAuth login akan redirect otomatis
        } catch (err: any) {
            console.error("Unexpected error during Google login:", err);
            setResetError("An unexpected error occurred during Google login.");
        }
        };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetLoading(true);
        setResetError(null);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setResetEmailSent(true);
        } catch (error: any) {
            setResetError(error.message || "Failed to send reset email");
        } finally {
            setResetLoading(false);
        }
    };

    const handleCloseForgotPassword = () => {
        setForgotPasswordOpen(false);
        // Reset the state after closing
        setTimeout(() => {
            setResetEmail("");
            setResetEmailSent(false);
            setResetError(null);
        }, 300);
    };
    // #endregion

    return (
        <div>
            <Card className="overflow-hidden border-0">
                <CardContent>
                    <form onSubmit={handleSignIn}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center pt-6">
                                <h1 className="text-2xl font-bold mb-3">Welcome Back</h1>
                                <p className="text-center text-base">
                                    Don’t have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={onGoToSignUp}          // ⬅️ panggil callback
                                        className="underline underline-offset-4 hover:text-primary"
                                    >
                                        Sign Up
                                    </button>
                                </p>
                            </div>
                            {error && (
                                <div className="grid gap-2">
                                    <Alert variant="destructive">
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2 relative">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <button
                                        type="button"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setForgotPasswordOpen(true);
                                            setResetEmail(email); // Pre-fill with current email if available
                                        }}
                                    >
                                        Forgot your password?
                                    </button>
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    // type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-[38px] text-muted-foreground"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#5A3ACA] to-[#8438FF] text-white hover:opacity-90"
                                disabled={loading}
                            >
                                {loading ? "Signing..." : "Masuk"}
                            </Button>
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                                    Or Continue With
                                </span>
                            </div>
                            <div className="grid">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleSignInWithGoogle}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Login with Google
                                    <span className="sr-only">Login with Google</span>
                                </Button>
                            </div>
                            <div className="flex justify-center items-center"></div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our{" "}
                <a href="/term&condition">Terms of Service</a> and{" "}
                <a href="/privacypolicy">Privacy Policy</a>.
            </div>
            {/* Forgot Password Dialog */}
            <Dialog
                open={forgotPasswordOpen}
                onOpenChange={handleCloseForgotPassword}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {resetEmailSent ? "Email Sent" : "Reset Password"}
                        </DialogTitle>
                        <DialogDescription>
                            {resetEmailSent
                                ? "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder."
                                : "Enter your email address and we'll send you a link to reset your password."}
                        </DialogDescription>
                    </DialogHeader>

                    {!resetEmailSent ? (
                        <form onSubmit={handleForgotPassword}>
                            {resetError && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{resetError}</AlertDescription>
                                </Alert>
                            )}

                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="reset-email">Email</Label>
                                    <Input
                                        id="reset-email"
                                        type="email"
                                        placeholder="email@example.com"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseForgotPassword}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-[#5A3ACA] to-[#8438FF] text-white hover:opacity-90"
                                    disabled={resetLoading}
                                >
                                    {resetLoading ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </DialogFooter>
                        </form>
                    ) : (
                        <DialogFooter className="mt-4">
                            <Button
                                onClick={handleCloseForgotPassword}
                                className="bg-gradient-to-r from-[#5A3ACA] to-[#8438FF] text-white hover:opacity-90"
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}