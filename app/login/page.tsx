"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function LoginPage() {
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      router.replace("/");
      return;
    }

    const processLogin = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("OAuth error:", error.message);
          router.replace("/"); // Jika gagal, kembalikan ke /
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    };

    processLogin();
  }, [router]);

  return null;
}
