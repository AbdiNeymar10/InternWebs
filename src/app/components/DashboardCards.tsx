'use client';

import { useRouter } from 'next/navigation';

export default function DashboardCards() {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* HR Manager Card */}
            <div className="bg-indigo-500 text-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-medium">HR manager</h2>
                <button
                    onClick={() => router.push('/hr-module')}
                    className="mt-2 bg-indigo-700 hover:bg-indigo-800 px-3 py-1.5 rounded text-sm transition-colors"
                >
                    View Details
                </button>
            </div>

            {/* Payroll Card */}
            <div className="bg-emerald-500 text-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-medium">Payroll</h2>
                <button className="mt-2 bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 rounded text-sm transition-colors">
                    View Details
                </button>
            </div>

            {/* Material Management Card */}
            <div className="bg-amber-500 text-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-medium">Material Management</h2>
                <button className="mt-2 bg-amber-700 hover:bg-amber-800 px-3 py-1.5 rounded text-sm transition-colors">
                    View Details
                </button>
            </div>

            {/* Finance Card */}
            <div className="bg-rose-500 text-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-medium">Finance</h2>
                <button className="mt-2 bg-rose-700 hover:bg-rose-800 px-3 py-1.5 rounded text-sm transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
}