"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import gsap from "gsap";

import "./AiChatSection.css";

export default function AiChatSection({ isOpen, onClose }) {
  const sectionRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const backdrop = backdropRef.current;

    if (!section || !backdrop) return;

    if (isOpen) {
      gsap.killTweensOf([section, backdrop]);

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

      return () => {
        timeline.kill();
      };
    }

    gsap.killTweensOf([section, backdrop]);

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
          duration: 0.65,
          ease: "power3.inOut",
        },
        0,
      )
      .to(
        backdrop,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        0.1,
      );

    return () => {
      timeline.kill();
    };
  }, [isOpen]);

  return (
    <>
      {/* Dark blurred background */}
      <div
        ref={backdropRef}
        className="ai-chat-section-backdrop"
        onClick={onClose}
      />

      {/* Chat section */}
      <section ref={sectionRef} className="ai-chat-section">
        {/* ================= HEADER ================= */}

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
            onClick={onClose}
            aria-label="Close AI chat"
          >
            <X />
          </button>
        </div>

        {/* ================= CONVERSATION ================= */}

        <div className="ai-chat-section-conversation-display-div">
          <div className="ai-chat-section-user-message">
            Hi, tell me about yourself.
          </div>

          <div className="ai-chat-section-ai-message">
            My name is Akash D P and I am a full-stack developer specializing in
            React.js, Next.js, Three.js, GSAP, Node.js, and Express.js.
          </div>
        </div>

        {/* ================= INPUT ================= */}

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
