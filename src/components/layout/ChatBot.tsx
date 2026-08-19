"use client";

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    X,
    ArrowUp,
    Plus,
    Bot,
    Loader2,
    AlertCircle,
    RotateCcw,
    RefreshCw,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { portfolioData } from "@/data/portfolio";
import { useTranslations, useLocale } from "next-intl";
import { BREAKPOINTS, getViewportWidth, isBelowMd } from "@/lib/breakpoints";
import { useMarvinPageContextOptional } from "@/providers/MarvinPageContextProvider";
import {
    inputPlaceholder,
    pickEmptyReply,
    pickOpener,
    pickRequestFailed,
} from "@/lib/marvin/voice";
import { MAX_INPUT_LENGTH } from "@/lib/marvin/limits";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    error?: boolean;
    /** Written by the client, not the model. Never sent back as history. */
    local?: boolean;
    imagePreview?: string;
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateId(): string {
    return Math.random().toString(36).slice(2, 11);
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Markdown renderer (simple, no external deps) ─────────────────────────────
function SimpleMarkdown({ text }: { text: string }) {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;
    let k = 0; // Separate key counter - always unique regardless of i's position

    while (i < lines.length) {
        const line = lines[i];

        // Empty line → spacing
        if (line.trim() === "") {
            elements.push(<div key={k++} className="h-2" />);
            i++;
            continue;
        }

        // Heading ##
        if (line.startsWith("## ")) {
            elements.push(
                <p key={k++} className="font-semibold text-sm mt-2 mb-1">
                    {inlineFormat(line.slice(3))}
                </p>
            );
            i++;
            continue;
        }

        // Heading #
        if (line.startsWith("# ")) {
            elements.push(
                <p key={k++} className="font-bold text-sm mt-2 mb-1">
                    {inlineFormat(line.slice(2))}
                </p>
            );
            i++;
            continue;
        }

        // Bullet list
        if (line.match(/^[-*•] /)) {
            const items: string[] = [];
            while (i < lines.length && lines[i].match(/^[-*•] /)) {
                items.push(lines[i].replace(/^[-*•] /, ""));
                i++;
            }
            elements.push(
                <ul key={k++} className="list-disc list-inside space-y-0.5 my-1">
                    {items.map((item, idx) => (
                        <li key={idx} className="text-sm leading-relaxed">
                            {inlineFormat(item)}
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        // Numbered list
        if (line.match(/^\d+\. /)) {
            const items: string[] = [];
            while (i < lines.length && lines[i].match(/^\d+\. /)) {
                items.push(lines[i].replace(/^\d+\. /, ""));
                i++;
            }
            elements.push(
                <ol key={k++} className="list-decimal list-inside space-y-0.5 my-1">
                    {items.map((item, idx) => (
                        <li key={idx} className="text-sm leading-relaxed">
                            {inlineFormat(item)}
                        </li>
                    ))}
                </ol>
            );
            continue;
        }

        // Regular paragraph
        elements.push(
            <p key={k++} className="text-sm leading-relaxed">
                {inlineFormat(line)}
            </p>
        );
        i++;
    }

    return <div className="space-y-1">{elements}</div>;
}

function inlineFormat(text: string): React.ReactNode {
    // Bold (**text**), italic (*text*), code (`code`), links [text](url)
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={idx}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
            return <em key={idx}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
            return (
                <code key={idx} className="px-1 py-0.5 rounded text-xs font-mono bg-foreground/10">
                    {part.slice(1, -1)}
                </code>
            );
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
            return (
                <a
                    key={idx}
                    href={linkMatch[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-80"
                >
                    {linkMatch[1]}
                </a>
            );
        }
        return part;
    });
}

// ─── Suggested questions moved into component for i18n ───

// ─── Message bubble ───────────────────────────────────────────────────────────
const MessageBubble = React.memo(function MessageBubble({
    message,
    onRetry,
}: {
    message: Message;
    onRetry?: () => void;
}) {
    const t = useTranslations("chatbot");
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
        >
            <div className={cn("flex flex-col gap-1 max-w-[90%]", isUser ? "items-end" : "items-start")}>
                <div
                    className={cn(
                        "break-words",
                        isUser
                            ? "px-3.5 py-2.5 rounded-2xl rounded-tr-sm bg-primary text-primary-foreground selection:bg-white/45 selection:text-neutral-900"
                            : message.error
                                ? "px-3.5 py-2.5 rounded-2xl bg-destructive/10 text-destructive"
                                : "py-0.5 text-foreground"
                    )}
                >
                    {isUser ? (
                        <div className="space-y-2">
                            {message.imagePreview && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={message.imagePreview}
                                    alt="Attached"
                                    className="max-h-36 rounded-md object-cover"
                                />
                            )}
                            {message.content ? (
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            ) : null}
                        </div>
                    ) : message.error ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                <p className="text-sm">{message.content}</p>
                            </div>
                            {onRetry && (
                                <button
                                    onClick={onRetry}
                                    className="flex items-center gap-1 text-xs underline underline-offset-2 hover:opacity-80 w-fit"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    {t("retry")}
                                </button>
                            )}
                        </div>
                    ) : (
                        <SimpleMarkdown text={message.content} />
                    )}
                </div>
                <span className="text-[10px] text-foreground/40 px-1">{formatTime(message.timestamp)}</span>
            </div>
        </motion.div>
    );
});

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="flex justify-start py-1"
        >
            <div className="flex gap-1 items-center h-3">
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-foreground/40"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
}

const MARVIN_INSET = 16;
const MARVIN_RADIUS = 20;
const MARVIN_MAX_RATIO = 0.3;
const MARVIN_MIN_PX = 280;
const MARVIN_DEFAULT_PX = 360;

function getMarvinMaxWidth(viewportWidth = getViewportWidth()) {
    if (isBelowMd(viewportWidth)) {
        return Math.max(240, viewportWidth - MARVIN_INSET * 2);
    }
    return Math.floor(viewportWidth * MARVIN_MAX_RATIO);
}

function getMarvinMinWidth(viewportWidth = getViewportWidth()) {
    const max = getMarvinMaxWidth(viewportWidth);
    if (isBelowMd(viewportWidth)) return max;
    return Math.min(MARVIN_MIN_PX, max);
}

function clampMarvinWidth(width: number, viewportWidth = getViewportWidth()) {
    const min = getMarvinMinWidth(viewportWidth);
    const max = getMarvinMaxWidth(viewportWidth);
    return Math.min(max, Math.max(min, Math.round(width)));
}

function defaultMarvinWidth(viewportWidth = getViewportWidth()) {
    if (isBelowMd(viewportWidth)) return getMarvinMaxWidth(viewportWidth);
    if (viewportWidth < BREAKPOINTS.LG) {
        return clampMarvinWidth(Math.floor(viewportWidth * 0.28), viewportWidth);
    }
    return clampMarvinWidth(MARVIN_DEFAULT_PX, viewportWidth);
}

// ─── ChatWindow ───────────────────────────────────────────────────────────────
function ChatWindow({
    onClose,
    panelWidth,
}: {
    onClose: () => void;
    panelWidth: number;
}) {
    const t = useTranslations("chatbot");
    const locale = useLocale();
    const marvinPage = useMarvinPageContextOptional();
    const pageContext = marvinPage?.pageContext ?? null;

    const [messages, setMessages] = useState<Message[]>(() => {
        if (typeof window !== "undefined") {
            try {
                const saved = sessionStorage.getItem("portfolio-chat-messages");
                if (saved) {
                    const parsed = JSON.parse(saved);
                    return parsed.map((m: any) => ({
                        ...m,
                        timestamp: new Date(m.timestamp)
                    }));
                }
            } catch (e) {
                // ignore parsing errors
            }
        }
        return [
            {
                id: generateId(),
                role: "assistant",
                content: pickOpener(portfolioData.personal.name),
                timestamp: new Date(),
                local: true,
            },
        ];
    });

    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem("portfolio-chat-messages", JSON.stringify(messages));
        }
    }, [messages]);
    const [input, setInput] = useState("");
    const [pendingImage, setPendingImage] = useState<{
        preview: string;
        base64: string;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
    const [lastUserImage, setLastUserImage] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const clearPendingImage = useCallback(() => {
        setPendingImage((prev) => {
            if (prev?.preview) URL.revokeObjectURL(prev.preview);
            return null;
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, []);

    const resetChat = useCallback(() => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;
        setIsLoading(false);
        setInput("");
        setLastUserMessage(null);
        setLastUserImage(null);
        clearPendingImage();
        const greeting: Message = {
            id: generateId(),
            role: "assistant",
            content: pickOpener(portfolioData.personal.name),
            timestamp: new Date(),
            local: true,
        };
        setMessages([greeting]);
        try {
            sessionStorage.setItem("portfolio-chat-messages", JSON.stringify([greeting]));
        } catch {
            // ignore quota / private mode
        }
        requestAnimationFrame(() => inputRef.current?.focus());
    }, [clearPendingImage, t]);

    const handleImagePick = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                e.target.value = "";
                return;
            }
            if (file.size > MAX_IMAGE_BYTES) {
                e.target.value = "";
                return;
            }

            const preview = URL.createObjectURL(file);
            const buffer = await file.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            let binary = "";
            for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
            const base64 = btoa(binary);

            setPendingImage((prev) => {
                if (prev?.preview) URL.revokeObjectURL(prev.preview);
                return { preview, base64 };
            });
        },
        []
    );

    // Auto-scroll to bottom
    // Scroll only the chat transcript - never scrollIntoView (that moves the page shell)
    const scrollToBottom = useCallback((smooth = true) => {
        const el = scrollContainerRef.current;
        if (!el) return;
        el.scrollTo({
            top: el.scrollHeight,
            behavior: smooth ? "smooth" : "auto",
        });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, scrollToBottom]);

    // Show scroll-to-bottom button when not at bottom
    const handleScroll = useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        setShowScrollBtn(distFromBottom > 60);
    }, []);

    // Focus input on open
    useEffect(() => {
        const timer = setTimeout(() => inputRef.current?.focus(), 100);
        return () => clearTimeout(timer);
    }, []);

    // Cleanup abort controller on unmount
    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const sendMessage = useCallback(
        async (text: string, imageBase64?: string | null, imagePreview?: string | null) => {
            const trimmed = text.trim().slice(0, MAX_INPUT_LENGTH);
            const image = imageBase64 ?? pendingImage?.base64 ?? null;
            const preview = imagePreview ?? pendingImage?.preview ?? null;
            if (!trimmed && !image) return;

            const content = trimmed || (image ? "What do you see in this image?" : "");
            setLastUserMessage(content);
            setLastUserImage(image);
            setInput("");
            setPendingImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";

            const userMsg: Message = {
                id: generateId(),
                role: "user",
                content,
                timestamp: new Date(),
                imagePreview: preview || undefined,
            };

            setMessages((prev) => [...prev, userMsg]);
            setIsLoading(true);

            // Only model-visible turns. Errors and the opener are written
            // client-side; sending them back teaches the model to imitate them.
            const apiMessages = [...messages, userMsg]
                .filter((m) => !m.error && !m.local)
                .map(({ role, content: c }) => ({ role, content: c }));

            abortControllerRef.current?.abort();
            const controller = new AbortController();
            abortControllerRef.current = controller;

            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages: apiMessages,
                        locale,
                        image: image || undefined,
                        pageContext: pageContext ?? undefined,
                    }),
                    signal: controller.signal,
                });

                const data = await res.json().catch(() => ({}));
                const reply =
                    typeof data?.reply === "string"
                        ? data.reply
                        : typeof data?.error === "string"
                            ? data.error
                            : null;

                if (!res.ok && !reply) {
                    throw new Error(pickRequestFailed());
                }

                if (!reply) {
                    throw new Error(pickEmptyReply());
                }

                setMessages((prev) => [
                    ...prev,
                    {
                        id: generateId(),
                        role: "assistant",
                        content: reply,
                        timestamp: new Date(),
                        error: res.status === 429 ? true : undefined,
                    },
                ]);
            } catch (err: unknown) {
                if (err instanceof Error && err.name === "AbortError") return;

                const errorMsg =
                    err instanceof Error
                        ? err.message
                        : pickRequestFailed();

                setMessages((prev) => [
                    ...prev,
                    {
                        id: generateId(),
                        role: "assistant",
                        content: errorMsg,
                        timestamp: new Date(),
                        error: true,
                    },
                ]);
            } finally {
                // Don't clear loading if a newer request already took over
                if (abortControllerRef.current === controller) {
                    setIsLoading(false);
                }
            }
        },
        [messages, pendingImage, locale, t, pageContext]
    );

    const handleRetry = useCallback(() => {
        if (!lastUserMessage) return;
        // Remove last error message
        setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.error) return prev.slice(0, -1);
            return prev;
        });
        sendMessage(lastUserMessage, lastUserImage, null);
    }, [lastUserMessage, lastUserImage, sendMessage]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
            }
        },
        [input, sendMessage]
    );

    // Auto-resize textarea
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setInput(e.target.value.slice(0, MAX_INPUT_LENGTH));
            const el = e.target;
            el.style.height = "auto";
            el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
        },
        []
    );

    const firstName = portfolioData.personal.name.trim().split(/\s+/)[0] || portfolioData.personal.name;
    const SUGGESTED_QUESTIONS = (t.raw("suggestions") as string[]).map((q) =>
        q.replaceAll("{name}", firstName)
    );
    const showSuggestions = messages.length <= 1;

    return (
            <motion.aside
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    width: panelWidth,
                    top: "var(--marvin-inset)",
                    right: "var(--marvin-inset)",
                    bottom: "var(--marvin-inset)",
                    height: "calc(100dvh - (2 * var(--marvin-inset)))",
                    borderRadius: "var(--marvin-radius)",
                }}
                className={cn(
                    "marvin-chat-panel fixed z-[120] flex flex-col overflow-hidden overscroll-contain",
                    "bg-background border border-white/12",
                    "shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
                )}
                data-lenis-prevent
                aria-label="Marvin chat panel"
            >
                {/* Header - keep content aligned with navbar; tighter bottom so the rule sits higher */}
                <div className="flex-shrink-0 border-b border-foreground/8 bg-foreground/3 px-4 vmd:px-5 pt-4 vmd:pt-6 pb-2">
                    <div className="flex items-center justify-between gap-3 py-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative flex-shrink-0">
                                <div className="w-9 h-9 vmd:w-10 vmd:h-10 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-primary" />
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold leading-none truncate">{t("title")}</p>
                                <p className="text-[11px] text-foreground/50 mt-0.5 truncate">
                                    {t("subtitle", { name: portfolioData.personal.name })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                            <button
                                type="button"
                                onClick={resetChat}
                                className="p-2 vmd:p-2.5 rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 text-foreground hover:scale-110"
                                aria-label={t("resetChat")}
                                title={t("resetChat")}
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 vmd:p-2.5 rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 text-foreground hover:scale-110"
                                aria-label={t("close")}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages area */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    data-lenis-prevent
                    className="marvin-chat-scroll flex-1 overflow-y-auto px-3.5 py-4 space-y-4"
                >
                    {messages.map((msg, idx) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            onRetry={msg.error && idx === messages.length - 1 ? handleRetry : undefined}
                        />
                    ))}

                    <AnimatePresence>
                        {isLoading && <TypingIndicator />}
                    </AnimatePresence>

                    {/* Suggested questions */}
                    <AnimatePresence>
                        {showSuggestions && !isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                className="flex flex-wrap gap-2 pt-1"
                            >
                                {SUGGESTED_QUESTIONS.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => sendMessage(q)}
                                        className={cn(
                                            "text-xs px-3 py-1.5 rounded-full border transition-all",
                                            "bg-foreground/5 border-foreground/10 text-foreground/70",
                                            "hover:bg-primary/10 hover:border-primary/30 hover:text-foreground",
                                            "active:scale-95"
                                        )}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                </div>

                {/* Scroll to bottom button */}
                <AnimatePresence>
                    {showScrollBtn && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => scrollToBottom()}
                            className={cn(
                                "absolute right-3 bottom-[7.5rem] z-10",
                                "w-7 h-7 rounded-full flex items-center justify-center",
                                "bg-background border border-foreground/15 shadow-md",
                                "text-foreground/60 hover:text-foreground transition-colors"
                            )}
                        >
                            <ChevronDown className="w-3.5 h-3.5" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Composer - Claude-style shell */}
                <div className="flex-shrink-0 px-3 pt-2 pb-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        className="hidden"
                        onChange={handleImagePick}
                    />
                    <div
                        className={cn(
                            "flex flex-col rounded-xl border transition-colors",
                            "bg-[#f4f4f3] border-[#e5e5e3]",
                            "dark:bg-foreground/[0.06] dark:border-foreground/10",
                            "focus-within:border-[#d4d4d1] dark:focus-within:border-foreground/20"
                        )}
                    >
                        {pendingImage && (
                            <div className="px-3 pt-3">
                                <div className="relative inline-block">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={pendingImage.preview}
                                        alt="Pending attachment"
                                        className="h-16 w-16 rounded-md object-cover border border-foreground/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={clearPendingImage}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center"
                                        aria-label="Remove image"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )}
                        <textarea
                            ref={inputRef}
                            data-lenis-prevent
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={inputPlaceholder(portfolioData.personal.name.split(/\s+/)[0])}
                            maxLength={200}
                            rows={1}
                            className={cn(
                                "w-full resize-none bg-transparent px-3.5 pt-3 pb-2 text-sm",
                                "placeholder:text-foreground/40 text-foreground",
                                "focus:outline-none",
                                "min-h-[44px] max-h-[120px] leading-relaxed"
                            )}
                            style={{ height: "44px" }}
                        />
                        <div className="flex items-center justify-between gap-2 px-2 pb-2 pt-0.5">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    "w-8 h-8 rounded-md flex items-center justify-center",
                                    "text-foreground/50 hover:text-foreground hover:bg-foreground/8",
                                    "transition-colors"
                                )}
                                aria-label="Add image"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => sendMessage(input)}
                                disabled={!input.trim() && !pendingImage}
                                className={cn(
                                    "flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center",
                                    "bg-white text-neutral-900 border border-black/10",
                                    "dark:bg-white dark:text-neutral-900",
                                    "transition-all active:scale-95",
                                    "disabled:opacity-35 disabled:cursor-not-allowed disabled:active:scale-100",
                                    "hover:bg-neutral-100"
                                )}
                                aria-label="Send message"
                            >
                                {isLoading && !input.trim() && !pendingImage ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                                )}
                            </button>
                        </div>
                    </div>
                    <p className="text-[10px] text-foreground/35 mt-2 text-center px-2 leading-snug">
                        {t("inputHint")}
                    </p>
                </div>
            </motion.aside>
    );
}

// ─── Main ChatBot component ───────────────────────────────────────────────────
export function ChatBot({ headless = false }: { headless?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasNewMsg, setHasNewMsg] = useState(false);
    const [panelWidth, setPanelWidth] = useState(MARVIN_DEFAULT_PX);
    const [isDragging, setIsDragging] = useState(false);

    const toggle = useCallback(() => {
        setIsOpen((prev) => !prev);
        setHasNewMsg(false);
    }, []);

    const close = useCallback(() => setIsOpen(false), []);

    // Clamp width on viewport resize; seed a sensible default when opening
    useEffect(() => {
        const syncWidth = () => {
            setPanelWidth((prev) =>
                isBelowMd(getViewportWidth()) ? getMarvinMaxWidth() : clampMarvinWidth(prev)
            );
        };
        syncWidth();
        window.addEventListener("resize", syncWidth);
        return () => window.removeEventListener("resize", syncWidth);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        setPanelWidth(defaultMarvinWidth());
    }, [isOpen]);

    // Inset split (md+) vs overlay (mobile): layout effect = before paint
    useLayoutEffect(() => {
        const root = document.documentElement;
        const mobile = isBelowMd(getViewportWidth());

        if (isOpen) {
            root.dataset.marvinOpen = "true";
            if (mobile) root.dataset.marvinOverlay = "true";
            else delete root.dataset.marvinOverlay;
            root.style.setProperty("--marvin-inset", `${MARVIN_INSET}px`);
            root.style.setProperty("--marvin-gap", mobile ? "0px" : `${MARVIN_INSET}px`);
            root.style.setProperty("--marvin-radius", `${MARVIN_RADIUS}px`);
            // Mobile overlay: shell math must NOT subtract chat width
            root.style.setProperty(
                "--marvin-panel-width",
                mobile ? "0px" : `${panelWidth}px`
            );
        } else {
            root.dataset.marvinOpen = "false";
            delete root.dataset.marvinOverlay;
            root.style.setProperty("--marvin-inset", "0px");
            root.style.setProperty("--marvin-gap", "0px");
            root.style.setProperty("--marvin-radius", "0px");
            root.style.setProperty("--marvin-panel-width", "0px");
        }

        return () => {
            root.dataset.marvinOpen = "false";
            delete root.dataset.marvinOverlay;
            root.style.setProperty("--marvin-inset", "0px");
            root.style.setProperty("--marvin-gap", "0px");
            root.style.setProperty("--marvin-radius", "0px");
            root.style.setProperty("--marvin-panel-width", "0px");
            delete root.dataset.marvinDragging;
        };
    }, [isOpen, panelWidth]);

    // Refresh GSAP ScrollTrigger when frame mode toggles
    useEffect(() => {
        const refresh = async () => {
            try {
                const gsap = (await import("gsap")).default;
                const { ScrollTrigger } = await import("gsap/ScrollTrigger");
                gsap.registerPlugin(ScrollTrigger);
                ScrollTrigger.refresh();
            } catch {
                /* gsap optional */
            }
        };
        const t = window.setTimeout(refresh, 50);
        return () => window.clearTimeout(t);
    }, [isOpen, panelWidth]);

    useEffect(() => {
        const root = document.documentElement;
        if (isDragging) root.dataset.marvinDragging = "true";
        else delete root.dataset.marvinDragging;
    }, [isDragging]);

    // Resize drag lives in the gap (outside chat overflow), so it isn't clipped
    const handleResizePointerDown = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (isBelowMd(getViewportWidth())) return;
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);

            const onMove = (ev: PointerEvent) => {
                const next = window.innerWidth - ev.clientX - MARVIN_INSET;
                setPanelWidth(clampMarvinWidth(next));
            };

            const onUp = () => {
                setIsDragging(false);
                window.removeEventListener("pointermove", onMove);
                window.removeEventListener("pointerup", onUp);
                window.removeEventListener("pointercancel", onUp);
            };

            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
            window.addEventListener("pointercancel", onUp);
        },
        []
    );

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) close();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, close]);

    // Listen for external toggle events (e.g. from Footer / hero)
    useEffect(() => {
        const handleToggle = () => {
            setIsOpen((prev) => !prev);
            setHasNewMsg(false);
        };
        const handleOpen = () => {
            setIsOpen(true);
            setHasNewMsg(false);
        };
        window.addEventListener("portfolio:toggle-chatbot", handleToggle);
        window.addEventListener("portfolio:open-chatbot", handleOpen);
        return () => {
            window.removeEventListener("portfolio:toggle-chatbot", handleToggle);
            window.removeEventListener("portfolio:open-chatbot", handleOpen);
        };
    }, []);

    return (
        <>
            <AnimatePresence>
                {isOpen && <ChatWindow onClose={close} panelWidth={panelWidth} />}
            </AnimatePresence>

            {isOpen && (
                <div
                    role="separator"
                    aria-orientation="vertical"
                    aria-label="Resize chat panel"
                    aria-valuemin={getMarvinMinWidth()}
                    aria-valuemax={getMarvinMaxWidth()}
                    aria-valuenow={panelWidth}
                    onPointerDown={handleResizePointerDown}
                    className={cn(
                        "fixed z-[130] hidden vmd:flex items-center justify-center",
                        "cursor-col-resize touch-none select-none"
                    )}
                    style={{
                        top: "var(--marvin-inset)",
                        bottom: "var(--marvin-inset)",
                        right: "calc(var(--marvin-inset) + var(--marvin-panel-width))",
                        width: "var(--marvin-gap)",
                    }}
                >
                    <span
                        className={cn(
                            "h-14 w-[3px] rounded-full bg-white/25 transition-colors",
                            isDragging ? "bg-white/60" : "hover:bg-white/50"
                        )}
                    />
                </div>
            )}

            {/* Trigger button - globally fixed corner button */}
            {!headless && (
                <motion.button
                    onClick={toggle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "relative p-3 rounded-full transition-all group",
                        "border border-foreground/10",
                        isOpen
                            ? "bg-primary/20 border-primary/40"
                            : "bg-foreground/5 hover:bg-foreground/10"
                    )}
                    aria-label="Open portfolio chatbot"
                    aria-expanded={isOpen}
                >
                    <MessageSquare
                        className={cn(
                            "w-5 h-5 transition-colors",
                            isOpen
                                ? "text-primary"
                                : "text-foreground/60 group-hover:text-foreground"
                        )}
                    />
                    {/* Notification dot */}
                    {hasNewMsg && !isOpen && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background"
                        />
                    )}
                    {/* Pulse ring when closed */}
                    {!isOpen && (
                        <motion.span
                            className="absolute inset-0 rounded-full border border-primary/30"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    )}
                </motion.button>
            )}
        </>
    );
}
