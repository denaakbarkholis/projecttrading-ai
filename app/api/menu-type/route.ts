import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-client"

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ success: false, error: "userId tidak ditemukan" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("chat_type")
    .select("id, name")
    .eq("name", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("❌ Gagal ambil history:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
