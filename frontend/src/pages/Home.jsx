import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Home() {
    return (
        <div className="home-page">

            {/* Navigation */}
            <nav className="navbar">

                <div className="nav-logo">
                    ◈ DEEPFAKE AI
                </div>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>

            </nav>


            {/* Hero Section */}
            <section className="hero-section">

                <div className="hero-content">

                    <div className="hero-logo">
                        ◈ DEEPFAKE AI
                    </div>

                    <p className="hero-subtitle">
                        AI POWERED VIDEO AUTHENTICATION
                    </p>

                    <h1>
                        Detect Deepfakes
                        <br />
                        <span>With AI</span>
                    </h1>

                    <p className="hero-description">
                        Analyze videos using advanced deep learning
                        technology to identify AI-generated and
                        manipulated content.
                    </p>


                    {/* Buttons */}
                    <div className="hero-buttons">

                        <Link
                            to="/detect"
                            className="primary-button"
                        >
                            Start Detection
                        </Link>

                    </div>


                    {/* Features */}
                    <div className="features">

                        <div className="feature-card">
                            <div className="feature-icon">🧠</div>
                            <h3>CNN</h3>
                            <p>Visual Analysis</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🎞️</div>
                            <h3>LSTM</h3>
                            <p>Temporal Analysis</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🤖</div>
                            <h3>AI</h3>
                            <p>Video Detection</p>
                        </div>

                    </div>


                    {/* Status */}
                    <div className="verification-box">

                        <div>● AI ANALYSIS</div>
                        <div>● VIDEO ANALYSIS</div>
                        <div>✓ AI VERIFIED</div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;