import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const api = import.meta.env.VITE_API_URL;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${api}/api/auth/login`, {
                username,
                password,
            });
            const { token, role } = res.data;
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("username", res.data.username);

            if (role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error(err);
            alert("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
        <p className="text-center text-gray-500">Please login to your account</p>
                <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700"
                >
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                >
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
            </div>
                    <button
                        type="submit"
                        disabled={loading}
                className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
