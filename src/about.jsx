import React from "react";
import "./about.css";
import AboutBackground from "./about_section.jpg";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Authenticity",
      description:
        "We only sell 100% authentic, brand-name colognes — no imitations, no knockoffs. Shop with confidence.",
    },
    {
      title: "Affordable Pricing",
      description:
        "Experience luxurious, designer-level fragrances without the luxury price tag. Premium scents for less.",
    },
    {
      title: "Curated Selection",
      description:
        "From bold and spicy to fresh and floral, discover a curated variety tailored to your unique style.",
    },
  ];

  return (
    <div className="about-container">
      <img src={AboutBackground} alt="About Background" className="about-background" />
      <div className="about-overlay">
        <h2>Why Scent Society?</h2>
        <div className="about-grid">
          {features.map((feature, index) => (
            <div className="about-card" key={index}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
        <button className="cta-button" onClick={() => navigate("/")}>
          🏠 Home
        </button>
      </div>
    </div>
  );
};

export default About;
