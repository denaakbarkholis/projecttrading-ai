"use client";

import type React from "react";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import { Eye, EyeOff, Mail } from "lucide-react";

interface SignUpPageProps {
    onGoToSignIn: () => void
}

export default function SignUp({ onGoToSignIn }: SignUpPageProps) {
    // #region CONST
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const router = useRouter();
    // #endregion

    // #region METHOD
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        // #region VALIDATING
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError("Format email tidak valid")
            setIsLoading(false)
            return
        }

        if (password !== confirmPassword) {
            setError("Kata sandi dan konfirmasi kata sandi tidak cocok")
            setIsLoading(false)
            return
        }

        if (password.length < 6) {
            setError("Kata sandi harus minimal 6 karakter")
            setIsLoading(false)
            return
        }
        // #endregion

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            const json = await res.json()

            if (!res.ok) {
                // server mengembalikan { error: "..." }
                throw new Error(json.error || "Registrasi gagal")
            }

            /* ---------------------------  SUCCESS  --------------------------- */
            setShowConfirmationDialog(true) // tampilkan dialog “cek email”
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan tak terduga")
        } finally {
            setIsLoading(false)
        }
    }


    const handleDialogClose = () => {
        setShowConfirmationDialog(false);
        onGoToSignIn()
    };
    // #endregion

    return (
        <div>
            <Card className="overflow-hidden border-0">
                <CardContent>
                    <form onSubmit={handleSignUp} className="p-6 md:py-20">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Welcome to Narapix</h1>
                                <p className="text-balance text-muted-foreground">
                                    Sign up in seconds. Start exploring right away!
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2 relative">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-8 text-muted-foreground"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <div className="grid gap-2 relative">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    // type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-8 text-muted-foreground"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#5A3ACA] to-[#8438FF] text-white hover:opacity-90"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating account..." : "Sign Up"}
                            </Button>
                            <p className="text-sm text-center">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={onGoToSignIn}          // ⬅️ panggil callback
                                    className="underline underline-offset-4 hover:text-primary"
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Email Confirmation Dialog */}
            <Dialog
                open={showConfirmationDialog}
                onOpenChange={setShowConfirmationDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-[#8438FF]" />
                            Verify Your Email
                        </DialogTitle>
                        <DialogDescription>
                            We've sent a verification email to{" "}
                            <span className="font-medium text-foreground">{email}</span>.
                            Please check your inbox and click the verification link to
                            complete your registration.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="rounded-lg bg-muted p-4 text-sm">
                            <p className="font-medium">Didn't receive the email?</p>
                            <ul className="mt-2 list-disc pl-4 text-muted-foreground">
                                <li>Check your spam or junk folder</li>
                                <li>Wait a few minutes and check again</li>
                                <li>Try signing up again with the same email</li>
                            </ul>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleDialogClose}
                            className="w-full bg-gradient-to-r from-[#5A3ACA] to-[#8438FF] text-white hover:opacity-90"
                        >
                            Go to Sign In
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}