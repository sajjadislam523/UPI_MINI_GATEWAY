import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

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
                    <nav className="flex items-center gap-4">
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
            </header>
            <main className="max-w-4xl mx-auto p-4">
                <Outlet />
            </main>
        </div>
    );
}
