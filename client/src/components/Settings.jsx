import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
            <div className="bg-dark-800 p-6 rounded-full mb-6 relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
                <SettingsIcon size={48} className="text-indigo-400 relative z-10" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="max-w-md">This section is currently under development. You will be able to configure application preferences, user accounts, and notifications here.</p>
        </div>
    );
};

export default Settings;
