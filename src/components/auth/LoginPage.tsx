import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { loginApi } from "./authApi";
import "./LoginPage.css";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await loginApi({ username, password });

            if (response.success) {
                login(response.token, response.refreshToken);
                navigate("/portfolio");
            } else {
                setError("Nieprawidłowe dane logowania");
            }
        } catch (err: any) {
            setError("Błąd serwera. Spróbuj ponownie.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Logowanie</h2>
                <form onSubmit={onSubmit} className="login-form">
                    <div className="input-group">
                        <label>Login</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Wpisz login"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Hasło</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Wpisz hasło"
                            required
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button type="submit" className="login-button">Zaloguj</button>
                </form>
                <div className="login-footer">
                    Nie masz konta? <span onClick={() => navigate("/register")} className="link">Zarejestruj się</span>
                </div>
            </div>
        </div>
    );
}
