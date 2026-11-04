"use client";

import { useState } from "react";
import { FiX, FiSend, FiLoader } from "react-icons/fi";
import "./FeedbackPopup.css";

const FeedbackPopup = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSendFeedback = async () => {
    const trimmedFeedback = feedback.trim();

    if (!trimmedFeedback || isSending) return;

    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback: trimmedFeedback,
        }),
      });

      const responseText = await response.text();

      console.log("Backend status:", response.status);
      console.log("Backend response:", responseText);

      if (!response.ok) {
        throw new Error(responseText || `Server error: ${response.status}`);
      }

      setFeedback("");
      setIsSent(true);
    } catch (err) {
      console.error("Feedback submission error:", err);
      setError("Failed to send feedback. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="feedback-popup">
      <div className="feedback-popup-header">
        <div className="feedback-popup-title">Feedback</div>

        <button
          className="feedback-popup-close"
          onClick={onClose}
          aria-label="Close feedback popup"
        >
          <FiX />
        </button>
      </div>

      {!isSent ? (
        <>
          <textarea
            placeholder="Write your feedback..."
            className="feedback-popup-input"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={isSending}
          />

          {error && <p className="feedback-popup-error">{error}</p>}

          <button
            className="feedback-popup-send"
            onClick={handleSendFeedback}
            disabled={isSending || !feedback.trim()}
            aria-label="Send feedback"
          >
            {isSending ? (
              <FiLoader className="feedback-popup-spinner" />
            ) : (
              <FiSend />
            )}
          </button>
        </>
      ) : (
        <div className="feedback-popup-success">
          Thank you for your feedback!
        </div>
      )}
    </div>
  );
};

export default FeedbackPopup;
