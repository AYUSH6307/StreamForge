import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../styles/Login.css";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
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
navigate("/dashboard");
console.log(localStorage.getItem("token"));
        console.log(response.data);

        localStorage.setItem(
            "token",
            response.data.access_token
        );

        alert("Login Successful!");

        navigate("/dashboard");

    } catch (error) {

        console.error(error);

        if (error.response) {
            alert(error.response.data.detail);
        } else {
            alert("Cannot connect to backend.");
        }

    }

};
    return (
    <div className="login-container">

        <div className="login-card">

        <h1 className="logo">StreamForge</h1>

        <h3>Welcome Back</h3>

        {/* Connect the form */}
            <form onSubmit={handleLogin}>

            <div className="form-group">

            <label>Email</label>

            <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            </div>

            <div className="form-group">

            <label>Password</label>

            <input
    type="password"
    className="form-control"
    placeholder="Enter your password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
/>

            </div>

            <button className="btn btn-primary w-100 mt-3">
            Login
            </button>

        </form>

        <p className="mt-3 text-center">
            Don't have an account?

            <Link to="/register">
            Register
            </Link>

        </p>

        </div>

    </div>
    );
}

export default Login;