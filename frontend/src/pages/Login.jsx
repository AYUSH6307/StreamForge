import { useState } from "react";
import cosmicRocket from "../assets/cosmic-rocket-adventure-stockcake.jpg";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";
import "../styles/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [activeTab, setActiveTab] = useState("login");

    const [username, setUsername] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    // =========================
    // LOGIN
    // =========================
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill all fields.");
            return;
        }

        try {
            const response = await loginUser({
                email,
                password,
            });

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            console.log(response.data);

            alert("Login Successful!");

            navigate("/dashboard");

        } catch (error) {
            console.error(error);

            if (error.response) {
                alert(
                    error.response.data.detail ||
                    "Login Failed!"
                );
            } else {
                alert("Cannot connect to backend.");
            }
        }
    };

    // =========================
    // REGISTER
    // =========================
    const handleRegister = async (e) => {
        e.preventDefault();

        if (
            !username ||
            !registerEmail ||
            !registerPassword ||
            !confirmPassword
        ) {
            alert("Please fill all fields.");
            return;
        }

        if (registerPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await registerUser({
                username,
                email: registerEmail,
                password: registerPassword,
            });

            console.log(response.data);

            alert("Registration Successful!");

            // Registration ke baad Login tab open
            setActiveTab("login");

            // Registered email login field mein automatically aa jayega
            setEmail(registerEmail);

            // Registration fields clear
            setUsername("");
            setRegisterEmail("");
            setRegisterPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.error(error);

            if (error.response) {
                alert(
                    error.response.data.detail ||
                    "Registration Failed!"
                );
            } else {
                alert("Cannot connect to the server.");
            }
        }
    };

    return (
        <div
            className="login-container"
            style={{
                backgroundImage: `url(${cosmicRocket})`,
            }}
        >

            <div className="login-card">

                {/* StreamForge Logo */}
                <h1 className="logo">
                    StreamForge
                </h1>

                {/* Login / Register Tabs */}
                <div className="auth-tabs">

                    <button
                        type="button"
                        className={
                            activeTab === "login"
                                ? "auth-tab active login-tab"
                                : "auth-tab login-tab"
                        }
                        onClick={() => setActiveTab("login")}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        className={
                            activeTab === "register"
                                ? "auth-tab active register-tab"
                                : "auth-tab register-tab"
                        }
                        onClick={() => setActiveTab("register")}
                    >
                        Register
                    </button>

                </div>

                {/* =========================
                    LOGIN FORM
                ========================= */}
                {activeTab === "login" && (
                    <>
                        <h3>Welcome Back</h3>

                        <form onSubmit={handleLogin}>

                            <div className="form-group">
                                <label>Email</label>

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>

                            <button
                                type="submit"
                                className="auth-submit login-submit"
                            >
                                Login
                            </button>

                        </form>
                    </>
                )}

                {/* =========================
                    REGISTER FORM
                ========================= */}
                {activeTab === "register" && (
                    <>
                        <h3>Create Account</h3>

                        <form onSubmit={handleRegister}>

                            <div className="form-group">
                                <label>Username</label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={registerEmail}
                                    onChange={(e) =>
                                        setRegisterEmail(e.target.value)
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter password"
                                    value={registerPassword}
                                    onChange={(e) =>
                                        setRegisterPassword(e.target.value)
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </div>

                            <button
                                type="submit"
                                className="auth-submit register-submit"
                            >
                                Register
                            </button>

                        </form>
                    </>
                )}

            </div>

        </div>
    );
}

export default Login;