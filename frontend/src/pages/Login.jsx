import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.email || !formData.password) {
            alert("Please enter email and password");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                "http://127.0.0.1:5000/api/login",
                {
                    email: formData.email,
                    password: formData.password
                }
            );

            if (response.data.status === "success") {

                alert("Login successful");

                // Store logged-in user
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );

                // Go to home page
                navigate("/");

            } else {

                alert(
                    response.data.message ||
                    "Login failed"
                );
            }

        } catch (error) {

            console.error("Login error:", error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Login failed"
                );

            } else {

                alert("Unable to connect to backend");
            }

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="auth-container">

            <div className="auth-card">

                <div className="auth-logo">
                    ◈ DEEPFAKE AI
                </div>

                <h1>Welcome Back</h1>

                <p className="auth-subtitle">
                    Login to access AI-powered video authentication
                </p>


                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Email Address</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>


                <p className="auth-footer">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Create Account
                    </Link>

                </p>


                <Link
                    to="/"
                    className="back-home"
                >
                    ← Back to Home
                </Link>

            </div>

        </div>
    );
}

export default Login;