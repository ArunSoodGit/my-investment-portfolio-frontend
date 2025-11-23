import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "./authApi";
import "./RegisterPage.css";

export default function RegisterForm() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const r = await registerApi({ email, username, password });

            if (r.success) {
                setSuccess(true);
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setError("Błąd rejestracji – sprawdź dane");
            }
        } catch (err: any) {
            setError("Błąd serwera. Spróbuj ponownie.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Rejestracja</h2>
                <form onSubmit={submit} className="register-form">
                    <div className="input-group">
                        <label>Login</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Wpisz login"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Wpisz email"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Hasło</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Wpisz hasło"
                            required
                        />
                    </div>

                    {error && <div className="error">{error}</div>}
                    {success && <div className="success">Konto utworzone! Przekierowanie...</div>}

                    <button type="submit" className="register-button">Zarejestruj</button>
                </form>
                <div className="register-footer">
                    Masz już konto? <span onClick={() => navigate("/login")} className="link">Zaloguj się</span>
                </div>
            </div>
        </div>
    );
}
