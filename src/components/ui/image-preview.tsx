"use client"

import { useState } from "react"
import { X, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImagePreviewProps {
    src: string
    alt: string
    className?: string
    width?: number
    height?: number
}

export function ImagePreview({ src, alt, className, width, height }: ImagePreviewProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (!src) return null

    return (
        <>
            <div className={cn("relative group cursor-pointer inline-block", className)} onClick={(e) => {
                e.preventDefault()
                setIsOpen(true)
            }}>
                <img
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover rounded-md transition-all hover:brightness-90"
                    width={width}
                    height={height}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-md">
                    <ZoomIn className="text-white h-4 w-4 drop-shadow-md" />
                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsOpen(false)
                    }}
                >
                    <div className="relative p-4 max-w-4xl w-full flex flex-col items-center">
                        <button
                            className="absolute top-0 right-4 p-2 text-white/70 hover:text-white transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-8 w-8" />
                            <span className="sr-only">Close</span>
                        </button>
                        <img
                            src={src}
                            alt={alt}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </>
    )
}
