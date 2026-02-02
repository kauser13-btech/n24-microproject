"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CountDownProps {
    targetDate: string
    className?: string
}

// Helper to convert English digits to Bangla
const toBanglaDigits = (num: number | string) => {
    const finalEnlishToBanglaNumber: { [key: string]: string } = {
        "0": "০",
        "1": "১",
        "2": "২",
        "3": "৩",
        "4": "৪",
        "5": "৫",
        "6": "৬",
        "7": "৭",
        "8": "৮",
        "9": "৯",
    }
    return num.toString().replace(/\d/g, (d) => finalEnlishToBanglaNumber[d])
}

const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : num;
}

export function CountDown({ targetDate, className }: CountDownProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date()
            let newTimeLeft = {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
            }

            if (difference > 0) {
                newTimeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                }
            }

            setTimeLeft(newTimeLeft)
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [targetDate])

    if (!isClient) {
        return null // Avoid hydration mismatch
    }

    const timeUnits = [
        { label: "দিন", value: timeLeft.days },
        { label: "ঘণ্টা", value: timeLeft.hours },
        { label: "মিনিট", value: timeLeft.minutes },
        { label: "সেকেন্ড", value: timeLeft.seconds },
    ]

    return (
        <div className={cn("w-full flex justify-center", className)}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl w-full">
                {timeUnits.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1 relative group overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 text-center">
                            <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-600 mb-2 font-mono tabular-nums leading-none tracking-tight">
                                {toBanglaDigits(formatNumber(item.value))}
                            </div>
                            <div className="text-sm md:text-base font-medium text-slate-500 uppercase tracking-widest">
                                {item.label}
                            </div>
                        </div>

                        {/* Decorative background elements */}
                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute -left-4 -top-4 w-16 h-16 bg-gradient-to-br from-pink-50 to-orange-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>
        </div>
    )
}
