import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b">
                <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
                    <h1 className="text-lg font-semibold">
                        <Link to="/">UPI Link Generator</Link>
                    </h1>
                    {/* Hamburger Menu for small screens */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    {/* Regular Nav for medium and large screens */}
                    <nav className="hidden md:flex items-center gap-4">
                        {username ? (
                            <>
                                <span>Welcome, {username}</span>
                                {role === "admin" && (
                                    <Link
                                        to="/admin/dashboard"
                                        className="text-blue-600"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="text-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-blue-600">
                                Login
                            </Link>
                        )}
                    </nav>
                </div>
                {/* Responsive Nav for small screens */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <nav className="flex flex-col items-center gap-4 p-4">
                            {username ? (
                                <>
                                    <span>Welcome, {username}</span>
                                    {role === "admin" && (
                                        <Link
                                            to="/admin/dashboard"
                                            className="text-blue-600"
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-600"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="text-blue-600">
                                    Login
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </header>
            <main className="max-w-4xl mx-auto p-4">
                <Outlet />
            </main>
        </div>
    );
}
