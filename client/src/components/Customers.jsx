import React from 'react';
import { Users } from 'lucide-react';

const Customers = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
            <div className="bg-dark-800 p-6 rounded-full mb-6 relative">
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                <Users size={48} className="text-purple-400 relative z-10" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Customers</h1>
            <p className="max-w-md">The Admin/Customer management module is coming soon. This area will allow you to view customer history, loyalty points, and manage profiles.</p>
        </div>
    );
};

export default Customers;
