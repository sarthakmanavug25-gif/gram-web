"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { isThisMonth, rupees } from "@/lib/format";

const SUGGESTIONS = [
  "How do I scan a crop?",
  "What's my spend this month?",
  "Any disease alerts today?",
  "How does auto sprinkler work?",
];

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
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
          context: {
            name: state.profile.name,
            farmSizeAcres: state.profile.farmSizeAcres,
            season: state.profile.season,
            monthSpend: monthTotal,
            monthlyBudget: state.profile.monthlyBudget,
            entries: state.expenses.length,
            sprinklerPercent: state.sprinklerPercent,
            lastScan: state.scans[0]?.diseaseName ?? null,
            topCategory:
              [...state.expenses]
                .sort((a, b) => b.amount - a.amount)[0]?.category ?? null,
          },
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
        updateChat(
          assistantId,
          "I could not reach the assistant service just now. Please try again."
        );
      }
    } catch {
      updateChat(
        assistantId,
        `You spent ${rupees(monthTotal)} this month across ${state.expenses.length} entries. I'm offline right now, so open Expenses or Crop Doctor for the full detail.`
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open GramConnect Assistant"
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
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[78dvh] w-full max-w-phone flex-col rounded-t-[26px] border border-white/10 bg-[rgba(16,19,16,0.97)] sm:right-4 sm:top-4 sm:mx-0 sm:h-auto sm:w-[380px] sm:rounded-[26px] sm:left-auto"
            >
              <div className="flex items-center justify-between border-b border-white/8 px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-primary/15 text-green-bright">
                    <Sparkles size={16} />
                  </span>
                  <div>
                    <p className="text-[15px] font-bold leading-tight">
                      GramConnect Assistant
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      Ask in English, हिंदी or Hinglish
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close assistant"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-1.5 text-text-secondary hover:bg-white/10"
                >
                  <X size={18} />
                </button>
              </div>

              <div
                ref={scrollRef}
                className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4"
              >
                {chat.length === 0 && (
                  <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4 text-[13px] text-text-secondary">
                    Namaste! I can help with the app, your expenses and crop
                    problems. Try a question below.
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
                          : "max-w-[82%] whitespace-pre-wrap rounded-2xl rounded-bl-md border border-white/8 bg-white/[0.06] px-3.5 py-2.5 text-[13.5px] text-text-primary"
                      }
                    >
                      {m.content || <TypingDots />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/8 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3">
                {chat.length === 0 && (
                  <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="shrink-0 whitespace-nowrap rounded-full border border-green-primary/30 bg-green-primary/10 px-3 py-1.5 text-[12px] font-semibold text-green-bright"
                      >
                        {s}
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
                    placeholder="Ask about your farm..."
                    className="h-11 flex-1 rounded-full border border-white/10 bg-white/[0.06] px-4 text-[14px] outline-none focus:border-green-primary/50"
                  />
                  <button
                    type="submit"
                    aria-label="Send message"
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
