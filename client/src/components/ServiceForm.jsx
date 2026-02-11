import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, Save, FileText, Smartphone, User, IndianRupee } from 'lucide-react';

const InputField = ({ label, name, type = 'text', icon: Icon, required = false, value, onChange, ...props }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon size={18} className="text-slate-500" />
            </div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full pl-10 pr-4 py-3 bg-dark-900/50 border border-dark-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-slate-200 placeholder-slate-600 transition-all outline-none"
                {...props}
            />
        </div>
    </div>
);

const genToken = () => `T-${Date.now().toString().slice(-6)}`;

const ServiceForm = ({ currentEntry, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        customerMobile: '',
        mobileBrandModel: '',
        issueDescription: '',
        estimatedCharge: '',
        status: 'Pending',
        tokenNumber: '',
        entryDate: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (currentEntry) {
            setFormData({
                tokenNumber: currentEntry.tokenNumber || '',
                customerName: currentEntry.customerName || '',
                customerMobile: currentEntry.customerMobile || '',
                mobileBrandModel: currentEntry.mobileBrandModel || '',
                issueDescription: currentEntry.issueDescription || '',
                estimatedCharge: currentEntry.estimatedCharge ?? '',
                status: currentEntry.status || 'Pending',
                entryDate: currentEntry.entryDate ? new Date(currentEntry.entryDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                tokenNumber: prev.tokenNumber || genToken(),
                entryDate: new Date().toISOString().slice(0, 10),
            }));
        }
        setError('');
    }, [currentEntry]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const validate = () => {
        if (!formData.tokenNumber?.trim()) return 'Token Number is required.';
        if (!formData.customerName?.trim()) return 'Customer Name is required.';
        if (!formData.customerMobile?.trim()) return 'Customer Mobile Number is required.';
        const digitsOnly = formData.customerMobile.replace(/\D/g, '');
        if (digitsOnly.length < 10 || digitsOnly.length > 15) return 'Customer Mobile Number should be 10–15 digits.';
        if (!formData.mobileBrandModel?.trim()) return 'Mobile Brand / Model is required.';
        if (!formData.issueDescription?.trim()) return 'Complaint / Issue Description is required.';
        if (formData.estimatedCharge === '' || Number.isNaN(Number(formData.estimatedCharge))) return 'Estimated Service Charge is required.';
        if (Number(formData.estimatedCharge) < 0) return 'Estimated Service Charge must be 0 or more.';
        if (!formData.entryDate) return 'Date of Entry is required.';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const msg = validate();
        if (msg) {
            setError(msg);
            return;
        }

        const payload = {
            ...formData,
            estimatedCharge: Number(formData.estimatedCharge),
        };

        try {
            if (currentEntry?._id) {
                await api.put(`/service-entries/${currentEntry._id}`, payload);
            } else {
                await api.post('/service-entries', payload);
            }
            onSuccess?.();
        } catch (err) {
            setError(err?.message || 'Failed to save. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-dark-800 rounded-3xl shadow-2xl border border-dark-700 w-full max-w-lg transform transition-all scale-100 relative overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-dark-700 bg-gradient-to-r from-dark-800 to-dark-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {currentEntry ? 'Edit Service Details' : 'New Service Request'}
                    </h2>
                    <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors bg-dark-700 hover:bg-rose-500 p-2 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-2">
                    <InputField
                        label="Token Number"
                        name="tokenNumber"
                        icon={Smartphone}
                        required
                        value={formData.tokenNumber}
                        onChange={handleChange}
                        placeholder="Auto-generated (editable)"
                    />
                    <InputField
                        label="Customer Name"
                        name="customerName"
                        icon={User}
                        required
                        autoFocus
                        value={formData.customerName}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Mobile Number"
                        name="customerMobile"
                        icon={Smartphone}
                        required
                        inputMode="numeric"
                        placeholder="10–15 digits"
                        value={formData.customerMobile}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Device Model"
                        name="mobileBrandModel"
                        icon={Smartphone}
                        required
                        value={formData.mobileBrandModel}
                        onChange={handleChange}
                    />

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Issue Description</label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <FileText size={18} className="text-slate-500" />
                            </div>
                            <textarea
                                name="issueDescription"
                                value={formData.issueDescription}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full pl-10 pr-4 py-3 bg-dark-900/50 border border-dark-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-slate-200 placeholder-slate-600 transition-all outline-none resize-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Est. Charge (₹)"
                            name="estimatedCharge"
                            type="number"
                            icon={IndianRupee}
                            required
                            min="0"
                            value={formData.estimatedCharge}
                            onChange={handleChange}
                        />
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Status</label>
                            <div className="relative">
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full pl-4 pr-10 py-3 bg-dark-900/50 border border-dark-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-slate-200 appearance-none outline-none cursor-pointer"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Date of Entry</label>
                            <input
                                type="date"
                                name="entryDate"
                                value={formData.entryDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-slate-200 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                            {error}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-dark-700">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2.5 border border-dark-600 rounded-xl text-sm font-medium text-slate-300 hover:bg-dark-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 text-sm font-medium transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceForm;
