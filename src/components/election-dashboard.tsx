"use client";
import { useEffect, useRef } from "react";
import {
    CheckCircle2,
    Calendar,
    Building2,
    UserCheck,
    Vote,
    Users,
    User,
    ChartColumn,
} from "lucide-react";

// --- Data Configuration ---

const timelineEvents = [
    {
        id: 1,
        date: "২৯ ডিসেম্বর ২০২৫",
        title: "মনোনয়নপত্র জমার শেষ দিন",
        status: "completed", // completed, current, upcoming
    },
    {
        id: 2,
        date: "৪ জানুয়ারি ২০২৬",
        title: "মনোনয়নপত্র যাচাই-বাছাই",
        status: "completed",
    },
    {
        id: 3,
        date: "২০ জানুয়ারি ২০২৬",
        title: "প্রত্যাহারের শেষ দিন",
        status: "completed",
    },
    {
        id: 4,
        date: "১০ ফেব্রুয়ারি ২০২৬",
        title: "প্রচারণার শেষ সময়",
        status: "current",
    },
    {
        id: 5,
        date: "১২ ফেব্রুয়ারি ২০২৬",
        title: "ভোট গ্রহণ",
        status: "upcoming",
    },
];

const statsData = [
    {
        id: 1,
        label: "সংসদ আসন",
        value: "৩০০",
        icon: Building2,
    },
    {
        id: 2,
        label: "মোট প্রার্থী",
        value: "১,৯৮১",
        icon: UserCheck,
    },
    {
        id: 3,
        label: "রাজনৈতিক দল",
        value: "৫১",
        icon: Vote,
    },
    {
        id: 4,
        label: "ভোট কেন্দ্র",
        value: "৪২,৭৬১",
        icon: ChartColumn,
    },
    {
        id: 5,
        label: "মোট ভোটার",
        value: "১২,৭৭,১১,৭৯৫",
        icon: Users,
    },
    {
        id: 6,
        label: "পুরুষ ভোটার",
        value: "৬,৪৮,২৫,১৫১",
        icon: User,
    },
    {
        id: 7,
        label: "নারী ভোটার",
        value: "৬,২৮,৮৫,৫২৪",
        icon: User,
    },
    {
        id: 8,
        label: "তৃতীয় লিঙ্গ",
        value: "১,১২০",
        icon: User,
    },
];

// --- Sub-Components ---

const TimelineEvent = ({ event }: { event: typeof timelineEvents[0] }) => {
    const getStatusStyles = () => {
        switch (event.status) {
            case "completed":
                return "bg-white border-indigo-500 text-indigo-500 opacity-60";
            case "current":
                return "bg-white border-indigo-600 text-indigo-600 shadow-xl shadow-indigo-500/20 scale-125";
            case "upcoming":
                return "bg-white border-slate-300 text-slate-400";
            default:
                return "";
        }
    };

    return (
        <div
            id={event.status === "current" ? "current-timeline-event" : undefined}
            className="flex flex-col items-center group w-48 flex-shrink-0"
        >
            <button
                className={`size-9 rounded-full flex items-center justify-center transition-all duration-500 mb-6 border-2 hover:scale-110 ${getStatusStyles()}`}
            >
                {event.status === "completed" ? (
                    <CheckCircle2 className="size-5" />
                ) : (
                    <Calendar className="size-5" />
                )}
            </button>
            <div className="text-center space-y-1.5 px-2">
                <div className="text-sm font-normal opacity-80 text-slate-500">
                    {event.date}
                </div>
                <div
                    className={`text-lg tracking-tight transition-colors ${event.status === "current"
                        ? "text-slate-900 font-bold"
                        : "text-slate-600 group-hover:text-indigo-600"
                        }`}
                >
                    {event.title}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ item }: { item: typeof statsData[0] }) => {
    const Icon = item.icon;
    return (
        <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 hover:bg-slate-50 transition-all duration-300 group cursor-default border-b border-r border-slate-100 last:border-0">
            <div className="flex items-center gap-3 md:contents">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon className="size-5" />
                </div>
                <div className="md:hidden text-slate-500 font-normal opacity-80">
                    {item.label}
                </div>
            </div>
            <div className="min-w-0">
                <div className="text-xl md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 leading-tight tracking-tight transition-all duration-500">
                    {item.value}
                </div>
                <div className="hidden md:block text-[13px] text-slate-500 font-normal opacity-80">
                    {item.label}
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

const ElectionDashboard = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentEvent = document.getElementById("current-timeline-event");
        if (currentEvent && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const containerWidth = container.clientWidth;
            const itemLeft = currentEvent.offsetLeft;
            const itemWidth = currentEvent.clientWidth;

            // Calculate center position
            const scrollPos = itemLeft - (containerWidth / 2) + (itemWidth / 2);

            container.scrollTo({
                left: scrollPos,
                behavior: "smooth"
            });
        }
    }, []);

    return (
        <section className="bg-slate-50 pt-10 font-sans selection:bg-indigo-200">

            {/* 1. CALENDAR SECTION */}
            <section id="calendar" className="container mx-auto px-4 pb-10">
                {/* Header */}
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-slate-300 flex-1" />
                    <h2 className="text-2xl md:text-3xl font-semibold text-white bg-red-600 px-6 py-2 rounded-lg shadow-sm">
                        রোড টু ইলেকশন
                    </h2>
                    <div className="h-px bg-slate-300 flex-1" />
                </div>

                {/* Timeline Card */}
                <div className="bg-white/60 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="relative bg-slate-50/50 border-t border-slate-200/30 overflow-hidden">
                        <div
                            ref={scrollContainerRef}
                            className="relative p-4 overflow-x-auto no-scrollbar select-none"
                        >
                            <div className="flex justify-between items-start min-w-[800px] md:min-w-[1000px] relative z-10 px-8 md:px-12">
                                {/* Horizontal Line */}
                                <div className="absolute top-[19px] left-0 right-0 h-0.5 bg-slate-200 z-0 mx-8" />

                                {/* Timeline Items */}
                                {timelineEvents.map((event) => (
                                    <TimelineEvent key={event.id} event={event} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. STATS SECTION */}
            <section id="stats" className="container mx-auto px-4">
                {/* Header */}
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-slate-300 flex-1" />
                    <h2 className="text-2xl md:text-3xl font-semibold text-white bg-red-600 px-6 py-2 rounded-lg shadow-sm">
                        সংক্ষিপ্ত তথ্য
                    </h2>
                    <div className="h-px bg-slate-300 flex-1" />
                </div>

                {/* Stats Card */}
                <div className="bg-white/60 backdrop-blur-xl border border-slate-200 rounded-2xl overflow-hidden">

                    {/* Upper Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 bg-transparent h-full">
                        {statsData.slice(0, 4).map((item) => (
                            <StatCard key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 w-full" />

                    {/* Lower Row */}
                    <div className="bg-slate-50/30">
                        <div className="grid grid-cols-2 lg:grid-cols-4 bg-transparent h-full">
                            {statsData.slice(4, 8).map((item) => (
                                <StatCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </section>
    );
};

export default ElectionDashboard;