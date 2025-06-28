import { GoogleGenAI, Modality } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    console.log("sini")
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const { input, imageData } = await request.json();

    console.log("input", input)
    console.log(imageData)

    let contents: any = [];

    if (imageData) {
      const base64Data = imageData.split(",")[1];
      const mimeType = imageData.split(";")[0].split(":")[1];

      contents = [
        { role: "user", parts: [
            { text: input || "Tolong jelaskan isi gambar ini." },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ]
        }
      ];
    } else {
      contents = [{ role: "user", parts: [{ text: input }] }];
    }

    const response = await ai.models.generateContent({
      model: "gemini-pro-vision", // lebih cocok untuk input text + image
      contents,
      config: {
        responseMimeType: "application/json",
      },
    });

    let output = "❌ Tidak ada output dari Gemini";

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.text) {
        output = part.text;
        break;
      }
    }

    return NextResponse.json({ output }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Gemini API error:", error);
    return NextResponse.json(
      { error: "Gagal memproses permintaan ke Gemini" },
      { status: 500 }
    );
  }
}
