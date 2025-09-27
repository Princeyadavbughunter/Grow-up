"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog"
import { Button } from "./button"
import { Textarea } from "./textarea"
import { cn } from "@/lib/utils"

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (content: string) => void
  title: string
  placeholder: string
  submitButtonText: string
  initialValue?: string
  isLoading?: boolean
}

export function CommentModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  placeholder,
  submitButtonText,
  initialValue = "",
  isLoading = false,
}: CommentModalProps) {
  const [content, setContent] = React.useState(initialValue)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Update content when initialValue changes
  React.useEffect(() => {
    setContent(initialValue)
  }, [initialValue])

  // Focus textarea when modal opens
  React.useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim() && !isLoading) {
      onSubmit(content.trim())
      setContent("")
    }
  }

  const handleClose = () => {
    setContent(initialValue) // Reset to initial value when closing
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn("w-[320px] sm:w-[500px] mx-auto rounded-2xl sm:rounded-lg")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              className="min-h-[120px] resize-none"
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!content.trim() || isLoading}
              className="min-w-[80px]"
            >
              {isLoading ? "Posting..." : submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
