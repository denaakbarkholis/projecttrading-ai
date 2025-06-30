"use client"

import { useChat } from "@ai-sdk/react"
import { useState } from "react"
import {
  Plus,
  Search,
  Mic,
  ArrowUp,
  ChevronDown,
  Edit3,
  BookOpen,
  Sparkles,
  Grid3X3,
  Crown,
  TrendingUp,
  BarChart3,
  Bot,
  Upload,
  Zap,
  Shield,
  Users,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Login from "@/components/login/page"
import SignUp from "@/components/signup/page"
import useAuth from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function AITradingLanding() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const [showTools, setShowTools] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)
  const [viewLogin, setViewLogin] = useState<"signin" | "signup">("signin")
  const [showChat, setShowChat] = useState(false)
  const { session } = useAuth()
  const router = useRouter()

  const handleAuthClick = () => {
    if (session) {
      router.push("/dashboard")
    } else {
      setViewLogin("signin")
      setOpenLogin(true)
    }
  }

  const chatHistory = [
    "Kelola Keluhan Indonesia",
    "API approve restocking code",
    "Perbaikan Model Prisma",
    "Mobile Navbar Update",
  ]

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-500" />,
      title: "Mode Spot Trading",
      description:
        "Analisis grafik harian dan pergerakan harga real-time dengan AI yang canggih untuk membantu keputusan trading spot Anda.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-500" />,
      title: "Mode Future Trading",
      description:
        "Prediksi trend jangka menengah dan jangka panjang menggunakan machine learning untuk strategi futures yang lebih akurat.",
    },
    {
      icon: <Bot className="h-8 w-8 text-purple-500" />,
      title: "Auto Insight AI",
      description:
        "AI otomatis menganalisis percakapan dan grafik untuk memberikan insight trading yang actionable dan mudah dipahami.",
    },
    {
      icon: <Upload className="h-8 w-8 text-orange-500" />,
      title: "Chart Analysis",
      description:
        "Upload screenshot chart trading Anda dan biarkan AI menganalisis pola, support, resistance, dan memberikan rekomendasi.",
    },
  ]

  const benefits = [
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Analisis Cepat",
      description: "Dapatkan insight trading dalam hitungan detik",
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: "Data Aman",
      description: "Semua data dan strategi Anda tersimpan dengan aman",
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "24/7 Support",
      description: "AI assistant siap membantu kapan saja Anda butuhkan",
    },
  ]

  if (showChat) {
    return (
      <div className="flex flex-col h-screen bg-[#212121] text-white">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white mr-2">
              ← Back to Landing
            </Button>
            <span className="text-lg font-medium">AI Trading Chat</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>

          <div className="flex items-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              <Crown className="h-4 w-4 mr-2" />
              Get Plus
            </Button>
            <Button
              className="p-2 px-5 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-semibold hover:bg-blue-700"
              onClick={handleAuthClick}
            >
              {session ? "Dashboard" : "Login"}
            </Button>

            <Dialog open={openLogin} onOpenChange={setOpenLogin}>
              <DialogContent className="max-w-xl h-[90%]">
                <DialogTitle>{viewLogin === "signin" ? "Sign In" : "Sign Up"}</DialogTitle>
                {viewLogin === "signin" ? (
                  <Login onGoToSignUp={() => setViewLogin("signup")} />
                ) : (
                  <SignUp onGoToSignIn={() => setViewLogin("signin")} />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-[#171717] flex flex-col overflow-y-auto">
            <div className="p-3">
              <div className="flex items-center justify-between mb-4">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-black rounded-full relative">
                    <div className="absolute inset-0.5 border border-white rounded-full"></div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>

              <Button className="w-full justify-start bg-transparent hover:bg-gray-800 border border-gray-600 text-gray-300 mb-3">
                <Edit3 className="h-4 w-4 mr-2" />
                New chat
              </Button>
            </div>

            <div className="px-3 space-y-1 mb-4">
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-800">
                <Search className="h-4 w-4 mr-2" />
                Search chats
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-800">
                <BookOpen className="h-4 w-4 mr-2" />
                Library
              </Button>
            </div>

            <div className="px-3 space-y-1 mb-4">
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-800">
                <Sparkles className="h-4 w-4 mr-2" />
                Sora
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-800">
                <Grid3X3 className="h-4 w-4 mr-2" />
                GPTs
              </Button>
            </div>

            <div className="flex-1 px-3">
              <div className="text-xs text-gray-500 mb-2 px-2">Chats</div>
              <div className="space-y-1">
                {chatHistory.map((chat, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left text-gray-300 hover:bg-gray-800 h-auto py-2 px-2"
                  >
                    <span className="truncate text-sm">{chat}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 overflow-y-auto px-4 py-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <h1 className="text-4xl font-bold mb-4 text-white">AI Trading Chat Assistant</h1>
                  <p className="text-gray-400 max-w-lg mb-6">
                    Dapatkan insight cepat untuk strategi, analisis chart, hingga otomatisasi riset Anda. Mulai
                    percakapan atau login untuk menyimpan history.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg w-64 text-left">
                      <h3 className="font-semibold text-lg mb-1">🔍 Mode Spot</h3>
                      <p className="text-gray-400 text-sm">Analisis grafik harian dan pergerakan harga real-time.</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg w-64 text-left">
                      <h3 className="font-semibold text-lg mb-1">📈 Mode Future</h3>
                      <p className="text-gray-400 text-sm">Prediksi trend jangka menengah dan jangka panjang.</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg w-64 text-left">
                      <h3 className="font-semibold text-lg mb-1">🤖 Auto Insight</h3>
                      <p className="text-gray-400 text-sm">AI bantu simpulkan dari chat dan grafik.</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg w-64 text-left">
                      <h3 className="font-semibold text-lg mb-1">📊 Upload Gambar</h3>
                      <p className="text-gray-400 text-sm">Kirim chart dan AI bantu menganalisis otomatis.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto">
                  {messages.map((message) => (
                    <div key={message.id} className="mb-8">
                      <div className="flex items-start space-x-4">
                        {message.role === "assistant" && (
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                            AI
                          </div>
                        )}
                        <div className={`flex-1 ${message.role === "user" ? "ml-auto max-w-2xl" : ""}`}>
                          <div
                            className={`px-4 py-3 rounded-2xl inline-block ${message.role === "user" ? "bg-gray-700 text-white" : "text-gray-100"}`}
                          >
                            {message.parts.map((part, i) =>
                              part.type === "text" ? <div key={i}>{part.text}</div> : null,
                            )}
                          </div>
                        </div>
                        {message.role === "user" && (
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                            R
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="mb-8">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                          AI
                        </div>
                        <div className="flex-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Chat Form */}
            <div className="p-4 border-t border-gray-700">
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="bg-gray-700 rounded-3xl flex items-end p-3">
                    <div className="flex items-center space-x-2 mr-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white p-1"
                        onClick={() => setShowTools(!showTools)}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                      {showTools && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white px-2 py-1 text-sm"
                        >
                          <Grid3X3 className="h-4 w-4 mr-1" />
                          Tools
                        </Button>
                      )}
                    </div>

                    <textarea
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Tanyakan strategi trading Anda..."
                      className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none min-h-[24px] max-h-32 py-1"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSubmit(e as any)
                        }
                      }}
                    />

                    <div className="flex items-center space-x-2 ml-3">
                      <Button type="button" variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                        <Mic className="h-5 w-5" />
                      </Button>
                      <Button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed p-2 rounded-full"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">AI Trading Assistant</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setShowChat(true)} className="text-gray-300 hover:text-white">
                Try Chat
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                <Crown className="h-4 w-4 mr-2" />
                Get Plus
              </Button>
              <Button
                className="p-2 px-5 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-semibold hover:bg-blue-700"
                onClick={handleAuthClick}
              >
                {session ? "Dashboard" : "Login"}
              </Button>

              <Dialog open={openLogin} onOpenChange={setOpenLogin}>
                <DialogContent className="max-w-xl h-[90%]">
                  <DialogTitle>{viewLogin === "signin" ? "Sign In" : "Sign Up"}</DialogTitle>
                  {viewLogin === "signin" ? (
                    <Login onGoToSignUp={() => setViewLogin("signup")} />
                  ) : (
                    <SignUp onGoToSignIn={() => setViewLogin("signin")} />
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            AI Trading Chat Assistant
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Revolusi cara Anda trading dengan AI yang memahami pasar. Dapatkan insight real-time, analisis chart
            otomatis, dan strategi trading yang dipersonalisasi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl"
              onClick={() => setShowChat(true)}
            >
              Mulai Chat Gratis
              <ArrowUp className="ml-2 h-5 w-5 rotate-45" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg rounded-xl"
              onClick={handleAuthClick}
            >
              {session ? "Dashboard" : "Daftar Sekarang"}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Fitur Unggulan</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Teknologi AI terdepan untuk membantu setiap keputusan trading Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-gray-700/50 rounded-full w-fit">{feature.icon}</div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-center">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Mengapa Memilih AI Trading Assistant?</h2>
              <p className="text-xl text-gray-400 mb-8">
                Platform trading AI yang dirancang khusus untuk trader Indonesia dengan teknologi machine learning
                terdepan.
              </p>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-800 rounded-lg">{benefit.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{benefit.title}</h3>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 rounded-2xl border border-gray-700">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Statistik Platform</h3>
                <p className="text-gray-400">Dipercaya oleh ribuan trader</p>
              </div>

              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-1">10K+</div>
                  <div className="text-gray-400">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-1">95%</div>
                  <div className="text-gray-400">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-1">24/7</div>
                  <div className="text-gray-400">AI Support</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-1">1M+</div>
                  <div className="text-gray-400">Analyses Done</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Apa Kata Pengguna</h2>
            <p className="text-xl text-gray-400">Testimoni dari trader yang sudah merasakan manfaatnya</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Budi Santoso",
                role: "Day Trader",
                content:
                  "AI Assistant ini benar-benar mengubah cara saya trading. Analisis chart yang akurat dan insight yang mudah dipahami.",
                rating: 5,
              },
              {
                name: "Sari Dewi",
                role: "Swing Trader",
                content:
                  "Fitur upload chart sangat membantu. AI bisa langsung kasih rekomendasi entry dan exit point yang tepat.",
                rating: 5,
              },
              {
                name: "Ahmad Rizki",
                role: "Crypto Trader",
                content:
                  "Mode Future trading-nya sangat akurat untuk prediksi jangka panjang. Profit saya meningkat 40% sejak pakai ini.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Siap Meningkatkan Trading Anda?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Bergabunglah dengan ribuan trader yang sudah merasakan keuntungan menggunakan AI Trading Assistant. Mulai
            gratis hari ini!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl"
              onClick={() => setShowChat(true)}
            >
              Coba Gratis Sekarang
              <Bot className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg rounded-xl"
            >
              Lihat Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">AI Trading</span>
              </div>
              <p className="text-gray-400">Platform AI trading terdepan untuk trader Indonesia.</p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Produk</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Spot Trading
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Future Trading
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Chart Analysis
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Auto Insight
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Perusahaan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Karir
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Kontak
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Trading Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
