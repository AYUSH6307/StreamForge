import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/Register.css";

function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
        alert("Please fill all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await registerUser({
            username,
            email,
            password,
        });

        console.log(response.data);

        alert("Registration Successful!");

        navigate("/login");

    } catch (error) {

        console.error(error);

        if (error.response) {
            alert(error.response.data.detail || "Registration Failed!");
        } else {
            alert("Cannot connect to the server.");
        }

    }
};

    return (
        <div className="register-container">

            <div className="register-card">

                <h1 className="logo">StreamForge</h1>

                <h3>Create Account</h3>

                <form onSubmit={handleRegister}>

                    <div className="form-group">
                        <label>Username</label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Username"
                            value={username}
                            onChange={(e)=>setUsername(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>

                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e)=>setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn btn-success w-100 mt-3"
                        type="submit"
                    >
                        Register
                    </button>

                </form>

                <p className="text-center mt-3">
                    Already have an account?

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;