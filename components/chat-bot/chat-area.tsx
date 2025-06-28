"use client"

import { useEffect, useRef, useState } from "react"
import type { Message } from "ai"
import { SparkleIcon, Bot, ImageIcon, BrainCircuit } from "lucide-react"

interface ChatAreaProps {
  messages: Message[]
  isLoading: boolean
  onChatType: string
}

export function ChatArea({ messages, isLoading, onChatType }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const showIntro = messages.length === 0
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkScreen()
    window.addEventListener("resize", checkScreen)
    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const getIntroMessage = (type: string) => {
    switch (type) {
      case "trader":
        return {
          title: "Mode Trader Aktif",
          description: "Dapatkan saran AI tentang sinyal, entry point, dan risk management yang optimal.",
        }
      case "spot":
        return {
          title: "Mode Spot Aktif",
          description: "Analisa spot market, grafik harga, dan trend jangka pendek secara instan.",
        }
      case "compounding":
        return {
          title: "Mode Compounding Aktif",
          description: "Optimalkan strategi compounding dan money management jangka panjang.",
        }
      case "future":
        return {
          title: "Mode Future Aktif",
          description: "Dapatkan panduan leverage, margin, dan sinyal pasar derivatif terkini.",
        }
      default:
        return {
          title: "Selamat Datang di AI Trading Chat",
          description: "Mulai percakapan untuk menganalisis grafik, strategi, atau kirim gambar langsung!",
        }
    }
  }

  // 🔧 Fungsi untuk menampilkan konten dengan aman
  const renderMessageContent = (content: any) => {
    if (typeof content === "string") return content
    if (typeof content === "object" && content !== null) {
      if (Array.isArray(content.output)) {
        return content.output.join("\n")
      }
      return JSON.stringify(content, null, 2)
    }
    return String(content)
  }

  const { title, description } = getIntroMessage(onChatType)

  const introCards = [
    {
      icon: <Bot className="h-5 w-5 text-green-400" />,
      title: "Chat Pintar",
      description: "Balas teks secara instan dengan AI yang terlatih.",
    },
    {
      icon: <ImageIcon className="h-5 w-5 text-blue-400" />,
      title: "Analisa Gambar",
      description: "Kirim grafik atau chart untuk dianalisis otomatis.",
    },
    {
      icon: <BrainCircuit className="h-5 w-5 text-purple-400" />,
      title: "Mode Profesional",
      description: "Pilih mode spot, future, atau compounding untuk analisa spesifik.",
    },
    {
      icon: <SparkleIcon className="h-5 w-5 text-yellow-400" />,
      title: "Fitur Khusus",
      description: "Akses fitur lanjutan dari sidebar seperti Auto Setup & Scanner.",
    },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-2 mt-2 overflow-y-auto">
      {showIntro && (
        <div className="flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h1>
          <p className="text-sm text-gray-400 mb-6 max-w-md">{description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
            {(isMobile ? introCards.slice(0, 2) : introCards).map((card, idx) => (
              <IntroCard
                key={idx}
                icon={card.icon}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      )}

      {!showIntro &&
        messages.map((message) => (
          <div key={message.id} className="mb-6 sm:mb-2 sm:mt-6 px-2 sm:px-8">
            {message.role === "user" ? (
              <div className="w-full flex justify-end">
                <div className="bg-[#2b2c2e] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl max-w-[85%] sm:max-w-[80%]">
                  {typeof message.content === "string" && message.content.startsWith("data:image") ? (
                    <img
                      src={message.content}
                      alt="Uploaded by user"
                      className="rounded-lg max-w-full h-auto object-contain"
                    />
                  ) : (
                    <div className="text-sm sm:text-base">{renderMessageContent(message.content)}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full flex">
                <div className="text-gray-100 max-w-[85%] sm:max-w-[80%]">
                  {typeof message.content === "string" && message.content.startsWith("data:image") ? (
                    <img
                      src={message.content}
                      alt="Generated image"
                      className="rounded-lg max-w-full h-auto object-contain"
                    />
                  ) : (
                    <div className="whitespace-pre-wrap text-sm sm:text-base">
                      {renderMessageContent(message.content)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

      {/* ⏳ Typing Indicator */}
      {isLoading && (
        <div className="mb-6 sm:mb-8 px-2 sm:px-8">
          <div className="w-full flex">
            <div className="bg-[#2b2c2e] px-4 py-3 rounded-2xl max-w-[85%] sm:max-w-[80%] text-white">
              <div className="flex space-x-1 items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <div
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

function IntroCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex flex-col items-start shadow-sm hover:shadow-lg transition">
      <div className="mb-2">{icon}</div>
      <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  )
}
