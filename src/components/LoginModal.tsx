import { useContext, useState } from "react";
import { UserContext } from "./UserContext";

interface LoginModalProps {
    closeModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ closeModal }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const userContext = useContext(UserContext);

    if (!userContext) {
        throw new Error('UserContext must be used within a UserProvider');
    }

    const { setUser } = userContext;

    const handleLogin = async () => {
        try {
            const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/user/login`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const userData = await response.json();

            setUser(userData);

            closeModal();
        } catch (err) {
            setError('Login failed, please try again');
        }
    };

    return (
        <div className="modal">
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="modal-input"
            />
            <div className="modal-buttons">
                <button onClick={handleLogin}>Login</button>
                <button onClick={closeModal}>Cancel</button>
            </div>
        </div>
    );
};

export default LoginModal;