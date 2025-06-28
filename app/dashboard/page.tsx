"use client"

import { useRef, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { ChatArea } from "@/components/chat-bot/chat-area"
import { ChatInput } from "@/components/chat-bot/chat-input"
import { createClient } from "@/lib/supabase-client"
import { toast } from "sonner";
import useAuth from "@/lib/auth"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  created_at?: string
}

export default function DashboardMain() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCollapse, setIsCollapse] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState<{ id: string; context: string }[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [chatType, setChatType] = useState<string>("ordinary")
  const [isTypingHistory, setIsTypingHistory] = useState(false)

  const { session } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      history.replaceState(null, "", window.location.pathname)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.custom(() => (
          <div className="flex flex-col bg-zinc-900 shadow-lg px-6 py-4 rounded-xl">
            <p className="text-lg font-semibold text-red-600">Perhatian!</p>
            <p className="text-sm pb-1">Silahkan Masuk terlebih dahulu.</p>
          </div>
        ),
          {
            position: "top-center",
          }
        );

        setTimeout(() => {
          router.replace("/")
        }, 5000)
      }
    })
  }, [router, supabase, toast])

  const chatIdRef = useRef<string>(crypto.randomUUID())
  const userId = session?.user.id!

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(`/api/chat/history?userId=${userId}`)
        const result = await res.json()

        if (result.success && Array.isArray(result.data)) {
          const chats = result.data
            .filter((chat: any) => chat.id && typeof chat.context === "string")
            .map((chat: any) => ({
              id: chat.id,
              context: chat.context
            }))

          setChatHistory(chats)
        } else {
          console.error("❌ Gagal ambil chat history:", result.error)
        }
      } catch (err) {
        console.error("❌ Gagal ambil chat history:", err)
      }
    }

    if (userId) fetchChatHistory()
  }, [userId])



  async function saveChatToDB(chatId: string, userId: string, messages: Message[], chatType: string) {
    const payload = {
      chatId,
      userId,
      chatType,
      messages: messages.map((m) => ({
        ...m,
        created_at: m.created_at || new Date().toISOString(),
      })),
    }

    try {
      await fetch("/api/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

    } catch (err) {
      console.error("❌ Gagal menyimpan chat:", err)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, imageFile: File | null) {
    e.preventDefault()
    if (!input.trim() && !imageFile) return

    setIsLoading(true)

    const newMessages: Message[] = []
    let imageBase64: string | null = null

    if (imageFile) {
      imageBase64 = await fileToBase64(imageFile)
      newMessages.push({
        id: crypto.randomUUID(),
        role: "user",
        content: imageBase64,
        created_at: new Date().toISOString(),
      })
    }

    if (input.trim()) {
      newMessages.push({
        id: crypto.randomUUID(),
        role: "user",
        content: input.trim(),
        created_at: new Date().toISOString(),
      })
    }

    const updatedMessages = [...messages, ...newMessages]
    setMessages(updatedMessages)
    setInput("")
    setUploadedImage(null)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input.trim() || "",
          imageData: imageBase64 || null,
          chatType: chatType,
        }),
      })

      const data = await res.json()
      const outputs: string[] = Array.isArray(data.output) ? data.output : [data.output]

      const assistantMessages: Message[] = outputs.map((content) => ({
        id: crypto.randomUUID(),
        role: "assistant",
        content: content,
        created_at: new Date().toISOString(),
      }))

      setIsLoading(false)
      const finalMessages = [...updatedMessages, ...assistantMessages]
      setMessages(finalMessages)

      await saveChatToDB(chatIdRef.current, userId, finalMessages, chatType)

      // Cek apakah ini chat baru
      const isNewChat = !chatHistory.some((chat) => chat.id === chatIdRef.current)
      if (isNewChat) {
        setIsTypingHistory(true)

        const baseContext =
          newMessages.find(
            (m) =>
              m.role === "user" &&
              typeof m.content === "string" &&
              !m.content.startsWith("data:image")
          )?.content || "[Gambar Dikirim]"

        const contextValue =
          chatType && chatType !== "ordinary" ? `${chatType} : ${baseContext}` : baseContext

        setTimeout(() => {
          setChatHistory((prev) => [
            { id: chatIdRef.current, context: contextValue },
            ...prev,
          ])
          setIsTypingHistory(false)
        }, 700)
      }

    } catch (error) {
      console.error("❌ Gagal:", error)
      setMessages([
        ...updatedMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "❌ Terjadi kesalahan saat memanggil AI.",
          created_at: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleChatSelect = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/detail?chatId=${chatId}`)
      const result = await res.json()

      if (result.success && result.data?.content) {
        const parsed = JSON.parse(result.data.content)
        if (Array.isArray(parsed)) {
          setMessages(parsed)
          chatIdRef.current = chatId
          setActiveChatId(chatId)
        }
      } else {
        console.error("❌ Chat tidak ditemukan:", result.error)
      }
    } catch (err) {
      console.error("❌ Gagal fetch detail chat:", err)
    }
  }

  const handleNewChat = (newType?: string) => {
    const newId = crypto.randomUUID()
    chatIdRef.current = newId
    setMessages([])
    setActiveChatId(newId)

    setChatType(newType || "ordinary")
  }

  const handleToggleSidebar = () => {
    setIsCollapse(!isCollapse)
  }

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="flex h-screen bg-[#212121] text-white">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={handleToggleMobileMenu}
        />
      )}

      <div
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-50 md:z-auto transition-transform duration-300 ease-in-out`}
      >
        <AppSidebar
          chatHistory={chatHistory}
          isCollapsed={isCollapse}
          onToggleCollapse={handleToggleSidebar}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={handleToggleMobileMenu}
          onSelectChat={handleChatSelect} 
          onNewChat={handleNewChat}
          activeChatId={activeChatId} 
          isTypingHistory={isTypingHistory} 
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onToggleMobileMenu={handleToggleMobileMenu} />

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3b3d40] scrollbar-track-transparent">
          <ChatArea messages={messages} isLoading={isLoading} onChatType={chatType} />
        </div>

        <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={(e) => handleSubmit(e, imageFile)}
        isLoading={isLoading}
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
        fileInputRef={fileInputRef}
      />
      </div>
    </div>
  )
}
