import React, { useState, useEffect } from 'react';
import api from '../api';
import { Search, Edit, Trash2, Filter, MoreHorizontal, Download } from 'lucide-react';
import ServiceForm from './ServiceForm';
import DashboardStats from './DashboardStats';

const ServiceList = () => {
    const [entries, setEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [editingEntry, setEditingEntry] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEntries();
    }, []);

    useEffect(() => {
        filterEntries();
    }, [searchTerm, statusFilter, entries]);

    const fetchEntries = async () => {
        setLoading(true);
        try {
            const response = await api.get('/service-entries');
            setEntries(response.data);
        } catch (error) {
            console.error('Error fetching entries:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterEntries = () => {
        let result = entries;

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(
                (entry) =>
                    entry.customerName.toLowerCase().includes(lowerTerm) ||
                    entry.tokenNumber.toLowerCase().includes(lowerTerm) ||
                    entry.customerMobile.includes(searchTerm)
            );
        }

        if (statusFilter !== 'All') {
            result = result.filter((entry) => entry.status === statusFilter);
        }

        setFilteredEntries(result);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await api.delete(`/service-entries/${id}`);
                fetchEntries();
            } catch (error) {
                console.error('Error deleting entry:', error);
            }
        }
    };

    const handleEdit = (entry) => {
        setEditingEntry(entry);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setEditingEntry(null);
        fetchEntries();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Delivered': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            case 'In Progress': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-7xl pb-24 md:pb-8">
            <DashboardStats entries={entries} />

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        Service Records
                    </h1>
                    <p className="text-slate-400 mt-1">Manage and track all repair jobs</p>
                </div>
                <button
                    onClick={() => {
                        setEditingEntry(null);
                        setIsFormOpen(true);
                    }}
                    className="hidden md:flex bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105 font-medium items-center gap-2"
                >
                    <span>+ New Service</span>
                </button>
            </div>

            {/* Mobile Floating Action Button - High Visibility */}
            <button
                onClick={() => {
                    setEditingEntry(null);
                    setIsFormOpen(true);
                }}
                className="fixed bottom-8 right-6 z-[9999] p-5 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-500/50 hover:bg-indigo-500 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
                aria-label="Add new service"
            >
                <span className="text-3xl font-bold leading-none mb-1">+</span>
            </button>

            <div className="bg-dark-800 rounded-3xl shadow-xl border border-dark-700 overflow-hidden backdrop-blur-sm">
                {/* Toolbar */}
                <div className="p-6 border-b border-dark-700 flex flex-col md:flex-row gap-4 justify-between items-center bg-dark-800/50">
                    <div className="relative flex-1 w-full md:w-auto md:max-w-md">
                        <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Name, Token, or Mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-slate-200 placeholder-slate-500 transition-all outline-none"
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative">
                            <Filter className="absolute left-3 top-3.5 text-slate-400" size={16} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 pr-8 py-3 bg-dark-900 border border-dark-700 rounded-xl text-slate-300 focus:ring-2 focus:ring-indigo-500/50 outline-none appearance-none cursor-pointer"
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                        <button className="p-3 bg-dark-900 border border-dark-700 rounded-xl text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors">
                            <Download size={20} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-dark-700/50">
                        <thead className="bg-dark-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Token Info</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer Details</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Device & Issue</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700/50 bg-dark-800/30">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500 animate-pulse">Loading records...</td></tr>
                            ) : filteredEntries.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No records found matching your criteria.</td></tr>
                            ) : (
                                filteredEntries.map((entry) => (
                                    <tr key={entry._id} className="hover:bg-dark-700/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm font-bold text-indigo-400">#{entry.tokenNumber}</span>
                                            <div className="text-xs text-slate-500 mt-0.5">{new Date(entry.entryDate).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-3">
                                                    {entry.customerName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-200">{entry.customerName}</div>
                                                    <div className="text-xs text-slate-500">{entry.customerMobile}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-300 font-medium">{entry.mobileBrandModel}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-[150px]">{entry.issueDescription}</div>
                                            <div className="text-xs font-mono text-emerald-400 mt-1">₹{entry.estimatedCharge}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(entry.status)}`}>
                                                {entry.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(entry)} className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-dark-700 rounded-lg transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(entry._id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-dark-700 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isFormOpen && (
                <ServiceForm
                    currentEntry={editingEntry}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
};

export default ServiceList;
