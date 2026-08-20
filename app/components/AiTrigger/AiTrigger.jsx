"use client";

import "./AiTrigger.css";

export default function AiTrigger({ onClick }) {
  return (
    <button
      type="button"
      className="ai-bot-starter-button"
      onClick={onClick}
      aria-label="Ask AI about Akash"
    >
      <img
        src="/assets/portfolio-ai-logo.jpg"
        alt=""
        className="ai-bot-starter-icon"
      />

      <div className="ask-ai-message">Ask AI</div>
    </button>
  );
}
