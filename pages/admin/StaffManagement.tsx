
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Staff, StaffStatus } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Badge from '../../components/ui/Badge';

const StaffForm: React.FC<{ staff?: Staff | null; onSave: (staff: Staff) => void; onClose: () => void; }> = ({ staff, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Staff, 'id' | 'salaryInfo'>>({
        fullName: staff?.fullName || '',
        role: staff?.role || '',
        contactInfo: {
            email: staff?.contactInfo.email || '',
            phone: staff?.contactInfo.phone || '',
        },
        joinDate: staff?.joinDate ? new Date(staff.joinDate).toISOString().split('T')[0] : '',
        status: staff?.status || StaffStatus.Active,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'email' || name === 'phone') {
            setFormData(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, [name]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: staff?.id || `staff-${Date.now()}`,
            salaryInfo: '****' // Not editable in this form
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
            <Input label="Role" name="role" value={formData.role} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={formData.contactInfo.email} onChange={handleChange} required />
            <Input label="Phone" name="phone" type="tel" value={formData.contactInfo.phone} onChange={handleChange} required />
            <Input label="Join Date" name="joinDate" type="date" value={formData.joinDate} onChange={handleChange} required />
            <Select label="Status" name="status" value={formData.status} onChange={handleChange} required>
                {Object.values(StaffStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">Save Staff</Button>
            </div>
        </form>
    );
};

const StaffManagement: React.FC = () => {
    const { state, dispatch } = useData();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

    const handleOpenModal = (staff: Staff | null = null) => {
        setEditingStaff(staff);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingStaff(null);
    };

    const handleSaveStaff = (staff: Staff) => {
        if (editingStaff) {
            dispatch({ type: 'UPDATE_STAFF', payload: staff });
        } else {
            dispatch({ type: 'ADD_STAFF', payload: staff });
        }
        handleCloseModal();
    };
    
    const handleDeleteStaff = (id: string) => {
        if (window.confirm("Are you sure you want to delete this staff member?")) {
            dispatch({ type: 'DELETE_STAFF', payload: id });
        }
    };

    const getStatusBadgeColor = (status: StaffStatus) => {
        switch(status) {
            case StaffStatus.Active: return 'green';
            case StaffStatus.OnLeave: return 'yellow';
            case StaffStatus.Terminated: return 'red';
            default: return 'gray';
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
                <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                    <PlusCircle size={20} /> Add Staff
                </Button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Contact</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Join Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {state.staff.map(staff => (
                                <tr key={staff.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{staff.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{staff.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{staff.contactInfo.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(staff.joinDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Badge color={getStatusBadgeColor(staff.status)}>{staff.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(staff)}><Edit size={16} /></Button>
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDeleteStaff(staff.id)}><Trash2 size={16} /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal title={editingStaff ? 'Edit Staff' : 'Add New Staff'} isOpen={isModalOpen} onClose={handleCloseModal}>
                <StaffForm staff={editingStaff} onSave={handleSaveStaff} onClose={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default StaffManagement;
