"use client";

import { X } from "lucide-react";

import "./AiChatSection.css";

export default function AiChatSection() {
  return (
    <>
      {/* Background overlay */}
      <div className="ai-chat-section-backdrop" />

      <section className="ai-chat-section">
        {/* Header */}
        <header className="ai-chat-section-header">
          <div className="ai-chat-section-header-left-div">
            <img
              src="/assets/portfolio-ai-logo.jpg"
              alt="Akash AI"
              className="ai-chat-section-ai-icon"
            />

            <div className="ai-chat-section-title">Ask AI</div>
          </div>

          <div
            className="ai-chat-section-header-right-div ai-chat-section-close icon"
            role="button"
            tabIndex={0}
            aria-label="Close AI chat"
          >
            <X />
          </div>
        </header>

        {/* Conversation */}
        <div className="ai-chat-section-conversation-display-div">
          <div className="ai-chat-section-user-message">
            Hi, tell me about yourself.
          </div>

          <div className="ai-chat-section-ai-message">
            My name is Akash D P and I am a full-stack developer specializing in
            React.js, Next.js, Three.js, GSAP, Node.js, and Express.js.
          </div>
        </div>

        {/* Input */}
        <div className="ai-chat-section-message-input-div">
          <input
            type="text"
            placeholder="Ask about Akash D P"
            className="ai-chat-section-message-input"
          />

          <button type="button" className="ai-chat-section-message-send-button">
            Ask AI
          </button>
        </div>
      </section>
    </>
  );
}
