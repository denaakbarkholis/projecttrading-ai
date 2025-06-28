// app/api/get-user-profile/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = createRouteHandlerClient({ cookies });

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error("Auth error:", userError);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

    if (profileError) {
        console.error("Profile fetch error:", profileError);
        return NextResponse.json(
            { error: "Gagal memuat profil" },
            { status: 500 }
        );
    }

    return NextResponse.json({ profile: userProfile });
}