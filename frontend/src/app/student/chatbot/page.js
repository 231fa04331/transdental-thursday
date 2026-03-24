"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";

const KEYWORDS = ["karma", "dharma", "bhakti", "peace", "devotion", "krishna", "gita", "atman"];
const MIN_MEANINGFUL_LENGTH = 56;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withHighlights = (text) => {
  const pieces = String(text || "").split(/(\s+)/);

  return pieces.map((piece, index) => {
    const normalized = piece.toLowerCase().replace(/[^a-z]/g, "");
    if (KEYWORDS.includes(normalized)) {
      return (
        <span key={`${piece}-${index}`} className="chat-highlight-word">
          {piece}
        </span>
      );
    }

    return <span key={`${piece}-${index}`}>{piece}</span>;
  });
};

export default function StudentChatbotPage() {
  const containerRef = useRef(null);
  const utteranceRef = useRef(null);
  const speakTimeoutRef = useRef(null);
  const mountedRef = useRef(true);
  const selectedVoiceRef = useRef(null);
  const voicesRef = useRef([]);

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [autoVoice, setAutoVoice] = useState(false);
  const [ttsStatus, setTtsStatus] = useState("");
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  const [expandedExplanations, setExpandedExplanations] = useState({});
  const token = useAuthStore((state) => state.token);
  const [messages, setMessages] = useState([
    {
      id: "welcome-message",
      from: "bot",
      text: "Hare Krishna. I am your spiritual companion. Ask me anything about Bhagavad Gita wisdom, peace, karma, or daily devotional guidance.",
      createdAt: Date.now(),
    },
  ]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return undefined;
    }

    const pickVoice = (voiceList) => {
      if (!Array.isArray(voiceList) || !voiceList.length) {
        selectedVoiceRef.current = null;
        return;
      }

      const preferred =
        voiceList.find((voice) => /en(-|_)in/i.test(voice.lang)) ||
        voiceList.find((voice) => /india|samantha|zira|heera|google.*female/i.test(voice.name)) ||
        voiceList.find((voice) => /^en/i.test(voice.lang)) ||
        voiceList[0];

      selectedVoiceRef.current = preferred || null;
    };

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
      pickVoice(voicesRef.current);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  const formatForSpeech = (value) =>
    String(value || "")
      .replace(/\n+/g, ". ")
      .replace(/\s+/g, " ")
      .replace(/([.!?])\s+/g, "$1 ... ")
      .trim();

  const ensureMeaningfulResponse = (value) => {
    let text = String(value || "").trim();

    if (!text) {
      return "Krishna reminds us that steady devotion and sincere effort bring clarity. Offer your actions with a peaceful heart, and wisdom will unfold naturally.";
    }

    if (text.length < MIN_MEANINGFUL_LENGTH) {
      text = `${text}\n\nWisdom: Perform your duty with devotion, remain peaceful, and leave the results to Krishna.`;
    }

    if (!/hare\s+krishna/i.test(text) && Math.random() < 0.24) {
      text = `Hare Krishna 🙏. ${text}`;
    }

    return text;
  };

  const getResponseSections = (text) => {
    const cleaned = String(text || "").trim();
    const sentenceParts = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);

    if (!sentenceParts.length) {
      return { wisdom: "", explanation: "" };
    }

    const wisdom = sentenceParts.slice(0, 2).join(" ").trim();
    const explanation = sentenceParts.slice(2).join(" ").trim();
    return { wisdom, explanation };
  };

  const stopSpeaking = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }

    window.speechSynthesis.cancel();
    setSpeakingMessageId(null);
    setIsSpeechPaused(false);
    setTtsStatus("");
  };

  const speakText = (text, messageId) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setTtsStatus("Voice is not supported in this browser.");
      return;
    }

    const cleanText = String(text || "").trim();
    if (!cleanText) {
      setTtsStatus("Nothing to read yet.");
      return;
    }

    if (speakingMessageId === messageId && window.speechSynthesis.speaking) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsSpeechPaused(false);
        setTtsStatus("Playing voice...");
      } else {
        window.speechSynthesis.pause();
        setIsSpeechPaused(true);
        setTtsStatus("Voice paused.");
      }
      return;
    }

    setTtsStatus("");
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(formatForSpeech(cleanText));
    utterance.lang = selectedVoiceRef.current?.lang || "en-IN";
    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }
    utterance.rate = 0.86;
    utterance.pitch = 0.92;
    utterance.volume = 1;
    utterance.onstart = () => {
      setSpeakingMessageId(messageId);
      setIsSpeechPaused(false);
      setTtsStatus("Playing voice...");
    };
    utterance.onend = () => {
      setSpeakingMessageId((current) => (current === messageId ? null : current));
      setIsSpeechPaused(false);
      setTtsStatus("");
    };
    utterance.onerror = () => {
      setSpeakingMessageId((current) => (current === messageId ? null : current));
      setIsSpeechPaused(false);
      setTtsStatus("Unable to play voice. Tap again.");
    };

    utteranceRef.current = utterance;

    // Some browsers drop audio if speak is called immediately after cancel.
    speakTimeoutRef.current = window.setTimeout(() => {
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    }, 90);
  };

  const getVerseReference = (text) => {
    const refMatch = String(text || "").match(/BG\s*\d+\.\d+/i);
    return refMatch ? refMatch[0].toUpperCase() : "";
  };

  const appendBotMessageWithTyping = async (rawText) => {
    const fullText = ensureMeaningfulResponse(rawText);
    const botId = `bot-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      {
        id: botId,
        from: "bot",
        text: "",
        reference: getVerseReference(fullText),
        createdAt: Date.now(),
      },
    ]);

    const chunkSize = fullText.length > 350 ? 6 : 4;
    for (let index = chunkSize; index <= fullText.length; index += chunkSize) {
      if (!mountedRef.current) {
        return;
      }

      const partial = fullText.slice(0, Math.min(index, fullText.length));
      setMessages((prev) =>
        prev.map((message) =>
          message.id === botId
            ? {
                ...message,
                text: partial,
              }
            : message
        )
      );
      await sleep(14);
    }

    if (autoVoice) {
      speakText(fullText, botId);
    }
  };

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      from: "user",
      text: trimmed,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined;

      const { data } = await api.post("/api/chatbot", { message: userMessage.text }, config);
      const responseText =
        String(data?.response || data?.reply || data?.message || "").trim() ||
        "I am not sure based on scriptures.";
      await appendBotMessageWithTyping(responseText);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) {
        await appendBotMessageWithTyping("Your session appears to have ended. Please login again, and I will continue guiding you.");
      } else {
        const backendMessage = String(error?.response?.data?.message || "").trim();
        await appendBotMessageWithTyping(
          backendMessage ||
            "I am here with you. I could not reach a full answer just now, but please ask again and we will reflect together peacefully."
        );
      }
    } finally {
      setIsThinking(false);
    }
  };

  const messageCountLabel = useMemo(() => `${messages.length} messages`, [messages.length]);

  const shouldShowTimeDivider = (index) => {
    if (index === 0) {
      return true;
    }

    const currentTime = messages[index]?.createdAt || 0;
    const previousTime = messages[index - 1]?.createdAt || 0;
    return currentTime - previousTime > 8 * 60 * 1000;
  };

  const formatMessageTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <ProtectedPage allowedRoles={["student"]}>
      <AppShell role="student" title="Spiritual Chatbot">
        <div className="chat-shell rounded-3xl border border-[var(--line)] p-3 shadow-soft md:p-5">
          <div className="chat-header mb-3 rounded-2xl px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="chat-header-kicker">Hare Krishna</p>
                <h2 className="font-heading text-xl text-[var(--text)] md:text-2xl">Spiritual Companion</h2>
              </div>
              <label className="chat-toggle text-xs text-[var(--text-muted)] md:text-sm">
                <input
                  type="checkbox"
                  checked={autoVoice}
                  onChange={(e) => setAutoVoice(e.target.checked)}
                />
                <span>Play voice automatically</span>
              </label>
            </div>
          </div>

          <div ref={containerRef} className="chat-messages h-[440px] space-y-3 overflow-y-auto rounded-2xl p-3 md:p-4">
            {messages.map((msg, index) => {
              const { wisdom, explanation } = getResponseSections(msg.text);
              const isBot = msg.from === "bot";
              const isPlaying = speakingMessageId === msg.id && !isSpeechPaused;
              const isPaused = speakingMessageId === msg.id && isSpeechPaused;
              const canExpand = explanation.length > 0;

              return (
              <div key={msg.id}>
                {shouldShowTimeDivider(index) ? (
                  <div className="chat-divider">
                    <span>{formatMessageTime(msg.createdAt)}</span>
                  </div>
                ) : null}

                <div
                  className={`chat-row ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                <article className={`chat-bubble ${msg.from === "user" ? "chat-user" : "chat-bot"} ${isPlaying ? "chat-bot-playing" : ""}`}>
                  {msg.from === "bot" ? (
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="chat-bot-label">Spiritual Guide</p>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => speakText(msg.text, msg.id)}
                          className={`chat-speak-btn ${isPlaying ? "chat-speak-btn-active" : ""}`}
                          aria-label="Play or pause bot response"
                        >
                          <span className={isPlaying ? "chat-speaker-pulse" : ""}>{isPaused ? "▶" : "🔊"}</span>
                        </button>
                        {speakingMessageId === msg.id ? (
                          <button
                            type="button"
                            onClick={stopSpeaking}
                            className="chat-stop-btn"
                            aria-label="Stop audio"
                          >
                            ■
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  <p className="chat-text">{withHighlights(isBot ? wisdom || msg.text : msg.text)}</p>

                  {isBot && canExpand ? (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedExplanations((prev) => ({
                            ...prev,
                            [msg.id]: !prev[msg.id],
                          }))
                        }
                        className="chat-explain-btn"
                      >
                        {expandedExplanations[msg.id] ? "Hide explanation" : "Show explanation"}
                      </button>

                      {expandedExplanations[msg.id] ? (
                        <p className="chat-explanation mt-2">{withHighlights(explanation)}</p>
                      ) : null}
                    </div>
                  ) : null}

                  {msg.from === "bot" && msg.reference ? (
                    <p className="chat-reference">{msg.reference}</p>
                  ) : null}
                </article>
              </div>
              </div>
            );})}

            {isThinking ? (
              <div className="chat-row justify-start">
                <div className="chat-bubble chat-bot max-w-[220px]">
                  <p className="chat-bot-label mb-2">Spiritual Guide</p>
                  <p className="chat-thinking-text">Reflecting on wisdom...</p>
                  <div className="chat-typing" aria-label="Bot is typing">
                    <span />
                    <span />
                    <span />
                  </div>
                  <p className="chat-thinking-subtext">Spiritual Guide is typing...</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-between px-1 text-xs text-[var(--text-muted)]">
            <p>{messageCountLabel}</p>
            <p>{ttsStatus || "Devotional, calm, and scripture-aware"}</p>
          </div>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask with your heart... for example: what is BG 2.47?"
              className="chat-input flex-1 rounded-2xl px-4 py-3"
            />
            <button
              type="button"
              onClick={send}
              disabled={isThinking || !input.trim()}
              className="chat-send rounded-2xl px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isThinking ? "Reflecting..." : "Send"}
            </button>
          </div>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
