import { Link, Outlet } from "react-router";

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b">
                <div className="max-w-4xl mx-auto p-4 flex justify-between">
                    <h1 className="text-lg font-semibold">
                        UPI Link Generator
                    </h1>
                    <Link to="/" className="text-blue-600">
                        Admin
                    </Link>
                </div>
            </header>
            <main className="max-w-4xl mx-auto p-4">
                <Outlet />
            </main>
        </div>
    );
}
