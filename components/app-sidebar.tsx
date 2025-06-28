"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Sidebar, X, SquarePen, Flower, TimerResetIcon, MenuSquareIcon, LucideMenu, SparkleIcon } from "lucide-react"
import { clsx } from "clsx"

interface ChatSidebarProps {
  chatHistory: { id: string; context: string }[]
  isCollapsed: boolean
  onToggleCollapse: () => void
  isMobileMenuOpen?: boolean
  onToggleMobileMenu?: () => void
  onSelectChat: (chatId: string) => void 
  onNewChat: (chatType?: string) => void 
  activeChatId?: string | null
  isTypingHistory?: boolean
}

const navItems = [
  { icon: BookOpen, label: "Library" },
  { icon: SparkleIcon, label: "Special Features" },
]

const featureItems = [
  { label: "For Advance Trading", name: "trader" },
  { label: "For Expertise Future", name: "future" },
  { label: "For Superb Spotting", name: "spot" },
  { label: "For Good Compounding", name: "compounding" }
]

function NavButton({ icon: Icon, label, isCollapsed }: { icon: any; label: string; isCollapsed: boolean }) {
  return (
    <Button
      variant="ghost"
      className={`w-full ${isCollapsed ? "justify-center px-2" : "justify-start"} text-gray-300 hover:bg-gray-800`}
      title={isCollapsed ? label : undefined}
    >
      <Icon className="h-4 w-4 mr-2" />
      {!isCollapsed && label}
    </Button>
  )
}

function FeatureNav({
  label,
  name,
  isCollapsed,
  onClick,
}: {
  label: string
  name: string
  isCollapsed: boolean
  onClick: () => void
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`w-full ${isCollapsed ? "justify-center px-2" : "justify-start"} text-gray-300 hover:bg-gray-800`}
      title={isCollapsed ? label : undefined}
    >
      {!isCollapsed && label}
    </Button>
  )
}

export function AppSidebar({
  chatHistory,
  isCollapsed,
  onToggleCollapse,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onSelectChat,
  onNewChat,
  activeChatId,
  isTypingHistory
}: ChatSidebarProps) {

  return (
    <div
      className={`${
        isCollapsed && !isMobileMenuOpen ? "w-16" : "w-64"
      } bg-[#171717] flex flex-col transition-all duration-300 ease-in-out h-screen`}
    >
      <div className="p-3">
        <div
          className={`flex items-center mb-4 ${isCollapsed && !isMobileMenuOpen ? "justify-center" : "justify-between"} group`}
        >
          <div className="md:hidden absolute top-3 right-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg px-2 py-1"
              onClick={onToggleMobileMenu}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isCollapsed && !isMobileMenuOpen ? (
            <div className="relative w-6 h-6 flex items-center justify-center group">
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0">
                <Flower className="h-4 w-4" />
              </div>

              <button
                onClick={onToggleCollapse}
                title="Expand sidebar"
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
              >
                <Sidebar className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="w-6 h-6 flex items-center justify-center">
                <Flower className="h-4 w-4" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg px-2 py-1 transition-colors duration-200 hidden md:flex"
                onClick={onToggleCollapse}
                title="Collapse sidebar"
              >
                <Sidebar className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <Button
          onClick={() => onNewChat()}
          className={`w-full ${isCollapsed && !isMobileMenuOpen ? "justify-center px-2" : "justify-start"} bg-transparent hover:bg-gray-800 text-gray-300 mb-3`}
          title={isCollapsed && !isMobileMenuOpen ? "New chat" : undefined}
        >
          <SquarePen className="h-4 w-4 mr-2" />
          {(!isCollapsed || isMobileMenuOpen) && "New chat"}
        </Button>
      </div>

      <div className="px-3 space-y-1 mb-4">
        {navItems.map((item, i) => (
          <NavButton key={i} icon={item.icon} label={item.label} isCollapsed={isCollapsed && !isMobileMenuOpen} />
        ))}
      </div>

      <div className="px-3 space-y-1 mb-4">
        {featureItems.map((item, i) => (
          <FeatureNav
            key={i}
            label={item.label}
            name={item.name}
            isCollapsed={isCollapsed && !isMobileMenuOpen}
            onClick={() => onNewChat(item.name)}
          />
        ))}
      </div>

      <div className="flex-1 px-3 overflow-hidden">
        {!isCollapsed || isMobileMenuOpen ? (
          <>
            <div className="text-xs text-gray-500 mb-2 px-2">Chats</div>
            <div className="overflow-y-auto max-h-[calc(70vh-180px)] pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {isTypingHistory && (
                <div className="flex items-center gap-2 px-3 py-2 ml-3 rounded-md text-gray-400 animate-pulse">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:.1s]" />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:.3s]" />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:.5s]" />
                </div>
              )}

              {chatHistory.map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  onClick={() => onSelectChat(chat.id)}
                  className={clsx(
                    "w-full justify-start text-left h-auto py-2 px-2 relative group transition-colors duration-200 rounded-md",
                    activeChatId === chat.id
                      ? "bg-[#212121]"
                      : "text-gray-300 hover:bg-gray-800"
                  )}
                >
                  <span
                    className={clsx(
                      "truncate text-sm pl-3",
                      activeChatId === chat.id ? "text-white" : "text-gray-300 group-hover:text-white"
                    )}
                  >
                    {chat.context}
                  </span>
                </Button>
              ))}
            </div>
          </>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-center px-2 text-gray-300 hover:bg-gray-800"
            title="Chat history"
          />
        )}
      </div>
    </div>
  )
}
