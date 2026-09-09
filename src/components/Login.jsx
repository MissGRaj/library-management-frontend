import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        const response = await fetch("https://libary-management-backend-production.up.railway.app/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                username: username, 
                password: password
            })
        });

        const data = await response.text();

        localStorage.setItem("token", data);
        navigate("/books");
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
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button className="login-button" type="submit">Login</button>
            </form>
        </div>
        );

    }

export default Login;