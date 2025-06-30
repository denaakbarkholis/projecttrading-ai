"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import Login from "@/components/login/page";

export default function LoginPage() {
  const router = useRouter();
  const [authHandled, setAuthHandled] = useState(false);

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const supabase = createClient();

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      const { data: { session } } = await supabase.auth.getSession();

      if (!session && code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("Error exchanging code:", error.message);
        } else {
          router.push("/dashboard");
        }
      } else if (session) {
        // Sudah login → langsung ke dashboard
        router.push("/dashboard");
      }

      setAuthHandled(true);
    };

    handleOAuthRedirect();
  }, [router]);

  if (!authHandled) return <div className="p-4 text-center">Logging in...</div>;

  return <Login onGoToSignUp={() => router.push("/register")} />;
}
