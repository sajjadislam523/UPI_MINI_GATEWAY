import axios from "axios";
import { useEffect, useState } from "react";
import UserManagement from "../components/admin/UserManagement";

interface Stats {
    totalUsers: number;
    totalOrders: number;
    userOrders: { username: string; count: number }[];
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const api = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get<Stats>(`${api}/api/dashboard/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStats(res.data);
            } catch (err) {
                console.error(err);
                alert("Failed to fetch stats");
            } finally {
                setLoading(false);
            }
        })();
    }, [api, token]);

    if (loading) return <div>Loading...</div>;
    if (!stats) return <div>Failed to load stats.</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
        <p className="text-4xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-700">Total Orders</h2>
        <p className="text-4xl font-bold text-blue-600">{stats.totalOrders}</p>
                </div>
            </div>

<div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Orders by User</h2>
    <ul className="space-y-3">
                    {stats.userOrders.map((user) => (
                        <li
                            key={user.username}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                        >
                <span className="text-gray-800">{user.username}</span>
                <span className="font-semibold text-blue-600">{user.count}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <UserManagement />
        </div>
    );
}
