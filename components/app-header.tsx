"use client"

import { useState } from "react"
import { ChevronDown, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import useUserProfile from "@/hooks/use-user-profile";

interface AppHeaderProps {
  onToggleMobileMenu?: () => void
}


export function AppHeader({ onToggleMobileMenu }: AppHeaderProps) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const { profile: userProfile, isLoading, isError, refreshProfile } = useUserProfile();

  const handleLogout = async () => {
    if (loading) return
    setLoading(true)

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Logout error:", error)
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      router.push("/")
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg px-2 py-1"
          onClick={onToggleMobileMenu}
        >
          <Menu className="h-4 w-4" />
        </Button>

        <span className="text-lg font-medium">ChatGPT</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>

      <div className="relative group">
        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full overflow-hidden border-2 border-gray-200 h-10 w-10 p-0 hover:border-blue-300"
            >
              <Image
                src={userProfile?.avatar_url || "https://ptzyxourwythwvgzedxa.supabase.co/storage/v1/object/public/img//Anonim.jpg"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full object-cover"
                style={{ width: "auto", height: "auto" }}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-49 bg-neutral-800 text-zinc-100 border border-zinc-800"
          >
            {/* Nama dan Email */}
            <div className="px-4 py-3">
              <h3 className="font-medium text-sm text-white">
                Hai, {userProfile?.name}
              </h3>
              <p className="font-medium text-xs text-zinc-400 cursor-pointer">
                {userProfile?.email}
              </p>
            </div>

            <DropdownMenuSeparator className="bg-zinc-500" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 focus:text-red-500 cursor-pointer data-[highlighted]:bg-zinc-800"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>

        </DropdownMenu>
      </div>
    </div>
  )
}
