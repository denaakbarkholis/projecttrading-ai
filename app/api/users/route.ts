import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        // Validate input
        if (!email || !password) {
            return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 })
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json({ error: "Kata sandi harus memiliki minimal 6 karakter" }, { status: 400 })
        }

        // Check if email already exists
        const { data: existingUser, error: checkError } = await supabase
            .from("users")
            .select("email")
            .eq("email", email)
            .single()

        if (checkError && checkError.code !== "PGRST116") {
            console.error("Error checking existing user:", checkError)
            return NextResponse.json({ error: "Terjadi kesalahan saat memeriksa data user" }, { status: 500 })
        }

        if (existingUser) {
            return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 })
        }

        // Sign up user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (authError) {
            console.error("Auth signup error:", authError)
            if (authError.message.includes("already registered")) {
                return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 })
            }
            return NextResponse.json({ error: authError.message }, { status: 400 })
        }

        if (authData.user) {
            // Insert user data into the users table
            const { error: insertError } = await supabase.from("users").insert([
                {
                    id: authData.user.id, // Store auth user ID in separate field
                    email: authData.user.email,
                    name: authData.user.email?.split("@")[0],
                    created_at: new Date().toISOString(),
                },
            ])

            if (insertError) {
                console.error("Error inserting user data:", insertError)
                // Don't return error to user as auth was successful
            }

            return NextResponse.json({
                success: true,
                user: authData.user,
            })
        }

        return NextResponse.json({ error: "Gagal membuat user" }, { status: 500 })
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
    }
}