"use client"

import type React from "react"

import { useState } from "react"
import { FileImage, FileVideo, Mic, Upload, X } from "lucide-react"
import { Button } from "@/frontend/components/ui/button"

interface UploadAreaProps {
  name: string
  onFilesChange?: (files: File[]) => void
}

export function UploadArea({ name, onFilesChange }: UploadAreaProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files)
      const updatedFiles = [...files, ...newFiles]
      setFiles(updatedFiles)
      if (onFilesChange) {
        onFilesChange(updatedFiles)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const updatedFiles = [...files, ...newFiles]
      setFiles(updatedFiles)
      if (onFilesChange) {
        onFilesChange(updatedFiles)
      }
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    if (onFilesChange) {
      onFilesChange(updatedFiles)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <FileImage className="h-5 w-5" />
    } else if (file.type.startsWith("video/")) {
      return <FileVideo className="h-5 w-5" />
    } else if (file.type.startsWith("audio/")) {
      return <Mic className="h-5 w-5" />
    } else {
      return <FileImage className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm font-medium">Drag and drop files here or click to browse</p>
        <p className="text-xs text-muted-foreground">Support for images, videos, and audio files</p>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept="image/*,video/*,audio/*"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <Button variant="outline" size="sm" className="mt-2" type="button" asChild>
            <span>Browse Files</span>
          </Button>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files ({files.length})</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  {getFileIcon(file)}
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Hidden input to store files for form submission */}
          {files.map((file, index) => (
            <input key={`file-input-${index}`} type="hidden" name={`${name}[]`} value={URL.createObjectURL(file)} />
          ))}
        </div>
      )}
    </div>
  )
}

