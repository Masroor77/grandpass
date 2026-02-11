import React from 'react';
import { Smartphone, RotateCw, CheckCircle, IndianRupee } from 'lucide-react';

const DashboardStats = ({ entries }) => {
    const totalRepairs = entries.length;
    const totalRevenue = entries.reduce((sum, entry) => sum + (Number(entry.estimatedCharge) || 0), 0);
    const activeRepairs = entries.filter(e => e.status === 'In Progress' || e.status === 'Pending').length;
    const completedRepairs = entries.filter(e => e.status === 'Completed' || e.status === 'Delivered').length;

    const stats = [
        {
            title: 'Total Repairs',
            value: totalRepairs,
            icon: Smartphone,
            color: 'bg-blue-500',
            gradient: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Active Repairs',
            value: activeRepairs,
            icon: RotateCw,
            color: 'bg-yellow-500',
            gradient: 'from-yellow-500 to-amber-600',
        },
        {
            title: 'Completed',
            value: completedRepairs,
            icon: CheckCircle,
            color: 'bg-green-500',
            gradient: 'from-green-500 to-emerald-600',
        },
        {
            title: 'Est. Revenue',
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: IndianRupee,
            color: 'bg-purple-500',
            gradient: 'from-purple-500 to-indigo-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 animate-fade-in-up">
            {stats.map((stat, index) => (
                <div key={index} className="bg-dark-800 rounded-2xl p-5 md:p-6 shadow-lg border border-dark-700 relative overflow-hidden group hover:border-dark-600 transition-all duration-300">
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full transition-transform group-hover:scale-110 duration-300`}></div>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-dark-700 text-white ${stat.color} bg-opacity-20`}>
                            <stat.icon size={24} className={`text-${stat.color.split('-')[1]}-400`} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
