import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-client"

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()

    const body = await req.json()
    const { chatId, userId, messages, chatType } = body

    if (!chatId || !userId || !messages) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    const { data: chatTypeData, error: chatTypeError } = await supabase
      .from("chat_type")
      .select("id")
      .eq("name", chatType)
      .single()

    if (chatTypeError || !chatTypeData) {
      return NextResponse.json({
        error: "chat_type tidak ditemukan",
        detail: chatTypeError?.message,
      }, { status: 400 })
    }

    const chatTypeId = chatTypeData.id

    const firstTextUserMessage = messages.find((m: any) =>
      m.role === "user" &&
      typeof m.content === "string" &&
      !m.content.startsWith("data:image")
    )
    const baseContext = firstTextUserMessage
      ? firstTextUserMessage.content
      : "[Gambar Dikirim]"

    const context =
      chatType && chatType !== "ordinary"
        ? `${chatType} : ${baseContext}`
        : baseContext

    const stringifiedMessages = JSON.stringify(messages)

    const { error } = await supabase
      .from("chats")
      .upsert(
        [{
          id: chatId,
          user_id: userId,
          chat_type_id: chatTypeId,
          context,
          content: stringifiedMessages,
          created_at: new Date().toISOString(),
        }],
        { onConflict: "id" }
      )

    if (error) {
      console.error("❌ Gagal upsert ke Supabase:", error)
      return NextResponse.json({ error: "Upsert gagal", detail: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Data berhasil disimpan / diperbarui" })

  } catch (error) {
    console.error("❌ Error umum:", error)
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 })
  }
}
