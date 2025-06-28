import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-client"

export async function GET(req: NextRequest) {
  const supabase = createClient()

  try {
    const { searchParams } = new URL(req.url)
    const chatId = searchParams.get("chatId")

    if (!chatId) {
      return NextResponse.json({ success: false, error: "chatId wajib diisi" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("chats")
      .select("id, user_id, content")
      .eq("id", chatId)
      .single()

    if (error) {
      console.error("❌ Gagal ambil detail chat:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error("❌ Error umum:", err)
    return NextResponse.json({ success: false, error: "Terjadi kesalahan saat ambil data" }, { status: 500 })
  }
}
