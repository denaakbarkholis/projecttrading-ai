"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Mic, ArrowUp, Grid3X3, X } from "lucide-react"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  imageFile: File | null
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>
  uploadedImage: string | null
  setUploadedImage: React.Dispatch<React.SetStateAction<string | null>>
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading, setImageFile, uploadedImage, setUploadedImage, fileInputRef }: ChatInputProps) {
  const [showTools, setShowTools] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [input])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setUploadedImage(imageUrl)
    setImageFile(file) 
  }


  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setUploadedImage(null)
    fileInputRef.current!.value = "" 
  }

  return (
    <div className="p-2 sm:p-4">
      <div className="w-full flex justify-center">
        <form onSubmit={handleSubmit} className="relative w-[700px] max-w-4xl">
          <div className="bg-[#2b2c2e] rounded-2xl sm:rounded-3xl flex flex-col p-3 sm:p-4 w-full max-h-[400px] overflow-y-auto">
            {uploadedImage && (
              <div className="relative mb-3">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="max-h-25 w-[250px] rounded-lg object-contain border border-gray-600"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 hover:bg-opacity-80"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Ketikkan sesuatu..."
              className="bg-transparent resize-none text-gray-100 focus:outline-none w-full placeholder:text-gray-500 
              overflow-y-auto max-h-[120px] sm:max-h-[160px] min-h-[40px] text-sm sm:text-base
              scrollbar-thin scrollbar-thumb-[#3b3d40] scrollbar-track-transparent"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e as any)
                }
              }}
            />

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white hover:bg-gray-500 rounded-full transition-colors"
                  onClick={triggerFileInput}
                >
                  <Plus className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-white hover:bg-gray-500 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-colors"
                >
                  <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Tools</span>
                </Button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button type="button" variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                  <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  type="submit"
                  disabled={(!input.trim() && !uploadedImage) || isLoading}
                  className="bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed p-1.5 sm:p-2 rounded-full"
                >
                  <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
