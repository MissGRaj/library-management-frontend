import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "https://library-management-backend-production-2dc0.up.railway.app/auth/login",
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

            if (response.ok) {
                const token = await response.text();

                localStorage.setItem("token", token);
                navigate("/books");

                return;
            }

            const data = await response.json();

            if (response.status === 401) {
                setError(data.message);
                return;
            }

            setError("Login failed. Please try again.");

        } catch (error) {
            setError("Unable to connect to the server.");
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>

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
                    }}
                    />
                </div>

                <button className="login-button" type="submit">Login</button>
            </form>

            {error && <p className="login-error">{error}</p>}

            <a
                className="create-account-link"
                onClick={() => navigate("/register")}
            >
                Create Account
            </a>

        </div>
        );

    }

export default Login;