import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const validateForm = () => {
        if (username.trim() === "") {
            setError("Username is required.");
            return false;
        }

        if (password.trim() === "") {
            setError("Password is required.");
            return false;
        }

        if (username.trim().length < 3 || username.trim().length > 16) {
            setError("Username must be between 3 and 16 characters.");
            return false;
        }

        if (password.length < 8 || password.length > 16) {
            setError("Password must be between 8 and 16 characters.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        const response = await fetch(
            "https://library-management-backend-production-2dc0.up.railway.app/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        if (response.status === 201) {
            setSuccess("Registration successful. Please login.");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

            return;
        }

        const data = await response.json();

        if (response.status === 409) {
            setError(data.message);
            return;
        }

        if (response.status === 400) {
            setError("Please enter a valid username and password.");
            return;
        }

        setError("Registration failed. Please try again.");
    };

    return (
        <div className="login-container">

            <h2 className="login-title">Register</h2>

            <form className="login-form" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Username</label>

                    <input
                        className="form-input"
                        type="text"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError("");
                            setSuccess("");
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>

                    <input
                        className="form-input"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                            setSuccess("");
                        }}
                    />
                </div>

                <button className="login-button" type="submit">
                    Register
                </button>

            </form>

            {error && <p className="login-error">{error}</p>}

            {success && <p className="login-success">{success}</p>}

            <a
                className="back-login-link"
                onClick={() => navigate("/login")}
            >
                Back to Login
            </a>

        </div>
    );
}

export default Register;