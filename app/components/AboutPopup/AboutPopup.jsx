"use client";

import { useState } from "react";
import { FiX, FiLinkedin, FiGithub, FiMail } from "react-icons/fi";
import "./AboutPoup.css";
import usePopupAnimation from "../usePopupAnimation";

const AboutPopup = ({
  onClose,
  summary = "Write your introduction here.",
  linkedinUrl = "https://linkedin.com",
  githubUrl = "https://github.com",
  email = "akashdpcali@gmail.com",
}) => {
  const [activeSection, setActiveSection] = useState("summary");
  const popupRef = usePopupAnimation();

  return (
    <div className="about-popup" ref={popupRef}>
      {/* Header */}
      <div className="about-popup-header">
        <div className="about-popup-title">About Me</div>

        <button
          className="about-popup-close"
          onClick={onClose}
          aria-label="Close About popup"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Section Navigation */}
      <div className="about-popup-section-display">
        <button
          className={`about-popup-tab ${
            activeSection === "summary" ? "active" : ""
          }`}
          onClick={() => setActiveSection("summary")}
        >
          Summary
        </button>

        <button
          className={`about-popup-tab ${
            activeSection === "contact" ? "active" : ""
          }`}
          onClick={() => setActiveSection("contact")}
        >
          Get in touch
        </button>
      </div>

      {/* Summary Section */}
      {activeSection === "summary" && (
        <div className="about-popup-summary-section-div">
          <p>{summary}</p>
        </div>
      )}

      {/* Contact Section */}
      {activeSection === "contact" && (
        <div className="about-popup-contact-section-div">
          {/* LinkedIn */}
          <a
            className="about-popup-contact-card about-popup-linkedin-card"
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="about-popup-contact-icon">
              <FiLinkedin size={23} />
            </div>

            <div className="about-popup-contact-info">
              <div className="about-popup-contact-title">LinkedIn</div>
              <div className="about-popup-contact-subtitle">
                Connect with me
              </div>
            </div>
          </a>

          {/* GitHub */}
          <a
            className="about-popup-contact-card about-popup-github-card"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="about-popup-contact-icon">
              <FiGithub size={23} />
            </div>

            <div className="about-popup-contact-info">
              <div className="about-popup-contact-title">GitHub</div>
              <div className="about-popup-contact-subtitle">
                Explore my projects
              </div>
            </div>
          </a>

          {/* Gmail */}
          <a
            className="about-popup-contact-card about-popup-gmail-card"
            href={`mailto:${email}`}
          >
            <div className="about-popup-contact-icon">
              <FiMail size={23} />
            </div>

            <div className="about-popup-contact-info">
              <div className="about-popup-contact-title">Gmail</div>
              <div className="about-popup-contact-subtitle">
                Send me an email
              </div>
            </div>
          </a>
        </div>
      )}
    </div>
  );
};

export default AboutPopup;
