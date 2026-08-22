"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import gsap from "gsap";

import "./AiChatSection.css";

export default function AiChatSection({ isOpen, onClose }) {
  const sectionRef = useRef(null);
  const backdropRef = useRef(null);
  const conversationRef = useRef(null);

  const abortControllerRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Akash's AI assistant. Ask me anything about his skills, projects, experience, or background.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --------------------------------
  // GSAP OPEN / CLOSE
  // --------------------------------

  useEffect(() => {
    const section = sectionRef.current;
    const backdrop = backdropRef.current;

    if (!section || !backdrop) return;

    gsap.killTweensOf([section, backdrop]);

    if (isOpen) {
      gsap.set(section, {
        display: "flex",
        x: "100%",
      });

      gsap.set(backdrop, {
        display: "block",
        opacity: 0,
      });

      const timeline = gsap.timeline();

      timeline
        .to(
          backdrop,
          {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          0,
        )
        .to(
          section,
          {
            x: "0%",
            duration: 0.65,
            ease: "power3.out",
          },
          0,
        );
    } else {
      const timeline = gsap.timeline({
        onComplete: () => {
          gsap.set(section, {
            display: "none",
          });

          gsap.set(backdrop, {
            display: "none",
          });
        },
      });

      timeline
        .to(
          section,
          {
            x: "100%",
            duration: 0.6,
            ease: "power3.inOut",
          },
          0,
        )
        .to(
          backdrop,
          {
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
          },
          0.1,
        );
    }
  }, [isOpen]);

  // --------------------------------
  // AUTO SCROLL
  // --------------------------------

  useEffect(() => {
    const conversation = conversationRef.current;

    if (!conversation) return;

    conversation.scrollTop = conversation.scrollHeight;
  }, [messages, isLoading]);

  // --------------------------------
  // SEND MESSAGE
  // --------------------------------

  const handleSendMessage = async () => {
    const trimmedMessage = input.trim();

    if (!trimmedMessage || isLoading) return;

    // Cancel any previous request
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMessage = {
      role: "user",
      content: trimmedMessage,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        signal: controller.signal,

        body: JSON.stringify({
          messages: updatedMessages.slice(-10),
        }),
      });

      if (!response.ok) {
        let errorMessage = "Something went wrong.";

        try {
          const errorData = await response.json();

          errorMessage = errorData.error || errorMessage;
        } catch {
          // Response wasn't JSON
        }

        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error("No response stream received.");
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content: "",
        },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let aiResponse = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true,
        });

        aiResponse += chunk;

        setMessages((previousMessages) => {
          const updated = [...previousMessages];

          const lastMessageIndex = updated.length - 1;

          updated[lastMessageIndex] = {
            ...updated[lastMessageIndex],
            content: aiResponse,
          };

          return updated;
        });
      }
    } catch (error) {
      // User intentionally cancelled the request
      if (error.name === "AbortError") {
        return;
      }

      console.error("AI chat error:", error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't process that request right now. Please try again.",
        },
      ]);
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }

      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // --------------------------------
  // ENTER KEY
  // --------------------------------

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      handleSendMessage();
    }
  };

  // --------------------------------
  // TEXTAREA AUTO RESIZE
  // --------------------------------

  const handleInputChange = (event) => {
    const textarea = event.target;

    setInput(textarea.value);

    textarea.style.height = "auto";

    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
  };

  return (
    <>
      {/* BACKDROP */}

      <div
        ref={backdropRef}
        className="ai-chat-section-backdrop"
        onClick={() => {
          abortControllerRef.current?.abort();
          onClose();
        }}
      />

      {/* CHAT */}

      <section ref={sectionRef} className="ai-chat-section">
        {/* HEADER */}

        <div className="ai-chat-section-header">
          <div className="ai-chat-section-header-left-div">
            <img
              src="/assets/portfolio-ai-logo.jpg"
              alt="Akash AI"
              className="ai-chat-section-ai-icon"
            />

            <div className="ai-chat-section-title">Ask AI</div>
          </div>

          <button
            type="button"
            className="ai-chat-section-header-right-div ai-chat-section-close icon"
            onClick={() => {
              abortControllerRef.current?.abort();
              onClose();
            }}
            aria-label="Close AI chat"
          >
            <X />
          </button>
        </div>

        {/* CONVERSATION */}

        <div
          ref={conversationRef}
          className="ai-chat-section-conversation-display-div"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.role === "user"
                  ? "ai-chat-section-user-message"
                  : "ai-chat-section-ai-message"
              }
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          ))}

          {/* LOADING */}

          {isLoading && (
            <div className="ai-chat-section-ai-message ai-chat-loading">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>

        {/* INPUT */}

        <div className="ai-chat-section-message-input-div">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Akash D P"
            className="ai-chat-section-message-input"
            rows="1"
            disabled={isLoading}
          />

          <button
            type="button"
            className="ai-chat-section-message-send-button"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
          >
            <Send size={18} strokeWidth={2} />
          </button>
        </div>
      </section>
    </>
  );
}
