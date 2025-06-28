import { GoogleGenAI, Modality } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-client"

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

  try {
    const { prompt, imageData, chatType } = await request.json()

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

    let systemPrompt: string | null = null
    if (chatType !== "ordinary") {
      const { data: promptData, error: promptError } = await supabase
        .from("prompts")
        .select("prompt")
        .eq("chat_type_id", chatTypeId)
        .single()

      if (promptError || !promptData) {
        return NextResponse.json({
          error: "Prompt tidak ditemukan untuk chat type non-ordinary",
          detail: promptError?.message,
        }, { status: 400 })
      }

      systemPrompt = promptData.prompt
    }

    const contents: any[] = []

    if (systemPrompt) {
      contents.push({ text: systemPrompt }) 
    }

    if (prompt) {
      contents.push({ text: prompt }) 
    }

    if (imageData) {
      const [meta, base64] = imageData.split(",")
      const mimeType = meta.split(":")[1].split(";")[0]

      contents.push({
        inlineData: {
          mimeType,
          data: base64,
        },
      })
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents,
      config: {
        responseModalities: [Modality.TEXT],
      },
    })

    const outputParts: string[] = []

    const parts = response.candidates?.[0]?.content?.parts
    if (parts && parts.length > 0) {
      for (const part of parts) {
        if (typeof part.text === "string") {
          outputParts.push(part.text.trim())
        } else if (part.inlineData) {
          const { mimeType, data } = part.inlineData
          outputParts.push(`data:${mimeType};base64,${data}`)
        }
      }
    }

    return NextResponse.json({ output: outputParts }, { status: 200 })

  } catch (error) {
    console.error("AI Error:", error)
    return NextResponse.json({ error: "Gagal menghasilkan konten dari AI." }, { status: 500 })
  }
}
