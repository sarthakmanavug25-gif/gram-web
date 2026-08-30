"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Mic, MicOff, Send, Sparkles, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { isThisMonth } from "@/lib/format";
import { useT, type StringKey } from "@/lib/i18n";
import { offlineReply } from "@/lib/assistant";

const SUGGESTIONS: StringKey[] = ["chat.s1", "chat.s2", "chat.s3", "chat.s4"];

type Recognition = {
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: { 0: { transcript: string } }[] }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => Recognition;
    webkitSpeechRecognition?: new () => Recognition;
  }
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<Recognition | null>(null);
  const { t } = useT();
  const chat = useApp((s) => s.chat);
  const pushChat = useApp((s) => s.pushChat);
  const updateChat = useApp((s) => s.updateChat);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat, open, pending]);

  function toggleVoice() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const BrowserSpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!BrowserSpeechRecognition) {
      setInput("Voice input is not supported in this browser.");
      return;
    }
    const recognition = new BrowserSpeechRecognition();
    recognition.lang = useApp.getState().language === "hi" ? "hi-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => setInput(event.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  async function send(text: string) {
    const message = text.trim();
    if (!message || pending) return;
    setInput("");
    setPending(true);

    const userId = `u-${Date.now()}`;
    pushChat({ id: userId, role: "user", content: message });

    const assistantId = `a-${Date.now()}`;
    pushChat({ id: assistantId, role: "assistant", content: "" });

    const state = useApp.getState();
    const monthTotal = state.expenses
      .filter((e) => isThisMonth(e.date))
      .reduce((sum, e) => sum + e.amount, 0);

    const categoryTotals = new Map<string, number>();
    for (const e of state.expenses) {
      categoryTotals.set(e.category, (categoryTotals.get(e.category) ?? 0) + e.amount);
    }
    const [topCategory, topCategoryAmount] =
      Array.from(categoryTotals.entries()).sort((a, b) => b[1] - a[1])[0] ?? [];

    const requestContext = {
      name: state.profile.name,
      farmSizeAcres: state.profile.farmSizeAcres,
      season: state.profile.season,
      monthSpend: monthTotal,
      monthlyBudget: state.profile.monthlyBudget,
      entries: state.expenses.length,
      sprinklerPercent: state.sprinklerPercent,
      lastScan: state.scans[0]?.diseaseName ?? null,
      topCategory: topCategory ?? null,
      topCategoryAmount: topCategoryAmount ?? null,
      lang: state.language,
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...state.chat
              .filter((m) => m.content)
              .map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: message },
          ],
          context: requestContext,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Chat request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        updateChat(assistantId, acc);
      }
      if (!acc) {
        updateChat(assistantId, offlineReply(message, requestContext));
      }
    } catch {
      updateChat(assistantId, offlineReply(message, requestContext));
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={t("chat.title")}
        onClick={() => setOpen(true)}
        className="fixed bottom-[104px] right-[max(16px,calc(50vw-232px))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-primary text-white shadow-glow transition hover:bg-green-dark"
      >
        <MessageCircle size={24} strokeWidth={2.2} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 overlay-bg backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[78dvh] w-full max-w-phone flex-col rounded-t-[26px] hairline sheet-surface sm:right-4 sm:top-4 sm:mx-0 sm:h-auto sm:w-[380px] sm:rounded-[26px] sm:left-auto"
            >
              <div className="flex items-center justify-between divider-b px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-primary/15 text-green-bright">
                    <Sparkles size={16} />
                  </span>
                  <div>
                    <p className="text-[15px] font-bold leading-tight">
                      {t("chat.title")}
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      {t("chat.subtitle")}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={t("common.close")}
                  onClick={() => setOpen(false)}
                  className="rounded-full p-1.5 text-text-secondary hover-surface"
                >
                  <X size={18} />
                </button>
              </div>

              <div
                ref={scrollRef}
                className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4"
              >
                {chat.length === 0 && (
                  <div className="rounded-2xl hairline surface p-4 text-[13px] text-text-secondary">
                    {t("chat.welcome")}
                  </div>
                )}
                {chat.map((m) => (
                  <div
                    key={m.id}
                    className={
                      m.role === "user" ? "flex justify-end" : "flex justify-start"
                    }
                  >
                    <div
                      className={
                        m.role === "user"
                          ? "max-w-[82%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-green-primary px-3.5 py-2.5 text-[13.5px] font-medium text-white"
                          : "max-w-[82%] whitespace-pre-wrap rounded-2xl rounded-bl-md hairline surface px-3.5 py-2.5 text-[13.5px] text-text-primary"
                      }
                    >
                      {m.content || <TypingDots />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider-t px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3">
                {chat.length === 0 && (
                  <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
                    {SUGGESTIONS.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => send(t(key))}
                        className="shrink-0 whitespace-nowrap rounded-full border border-green-primary/30 bg-green-primary/10 px-3 py-1.5 text-[12px] font-semibold text-green-bright"
                      >
                        {t(key)}
                      </button>
                    ))}
                  </div>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("chat.placeholder")}
                    className="h-11 flex-1 rounded-full hairline surface px-4 text-[14px] outline-none focus:border-green-primary/50"
                  />
                  <button
                    type="button"
                    aria-label={listening ? "Stop voice input" : "Start voice input"}
                    onClick={toggleVoice}
                    className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                      listening
                        ? "bg-red-500 text-white animate-pulse"
                        : "hairline surface text-green-bright"
                    }`}
                  >
                    {listening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                  <button
                    type="submit"
                    aria-label={t("chat.title")}
                    disabled={pending || !input.trim()}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-green-primary text-white disabled:opacity-40"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-text-secondary"
          style={{ animation: `dotPulse 1.2s ${i * 0.15}s infinite` }}
        />
      ))}
    </span>
  );
}
