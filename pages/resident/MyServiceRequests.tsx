
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { ServiceRequest, ServiceRequestStatus, ServiceRequestCategory } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import { PlusCircle } from 'lucide-react';

const RequestForm: React.FC<{ onSave: (request: ServiceRequest) => void; onClose: () => void; userId: string; }> = ({ onSave, onClose, userId }) => {
    const [formData, setFormData] = useState({
        category: ServiceRequestCategory.Roads,
        description: '',
        location: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: `req-${Date.now()}`,
            submittedBy: userId,
            ...formData,
            status: ServiceRequestStatus.New,
            submittedAt: new Date().toISOString(),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Select label="Category" name="category" value={formData.category} onChange={handleChange}>
                {Object.values(ServiceRequestCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </Select>
            <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} required />
            <Input label="Location (e.g., street address or cross-streets)" name="location" value={formData.location} onChange={handleChange} required />
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">Submit Request</Button>
            </div>
        </form>
    );
};

const MyServiceRequests: React.FC = () => {
    const { user } = useAuth();
    const { state, dispatch } = useData();
    const [isModalOpen, setModalOpen] = useState(false);

    const myRequests = state.serviceRequests.filter(req => req.submittedBy === user?.id);

    const handleSave = (request: ServiceRequest) => {
        dispatch({ type: 'ADD_SERVICE_REQUEST', payload: request });
        setModalOpen(false);
    };
    
     const getStatusBadgeColor = (status: ServiceRequestStatus) => {
        switch(status) {
            case ServiceRequestStatus.New: return 'blue';
            case ServiceRequestStatus.InProgress: return 'yellow';
            case ServiceRequestStatus.Resolved: return 'green';
            case ServiceRequestStatus.Closed: return 'gray';
            default: return 'gray';
        }
    };


    return (
        <div className="space-y-6 px-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Service Requests</h1>
                <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
                    <PlusCircle size={20} /> New Request
                </Button>
            </div>
            <div className="space-y-4">
                {myRequests.length > 0 ? myRequests.map(req => (
                    <Card key={req.id}>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                           <div className="flex-grow">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">{req.category}</h2>
                                    <Badge color={getStatusBadgeColor(req.status)}>{req.status}</Badge>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Location: {req.location}</p>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">{req.description}</p>
                                {req.adminNotes && <p className="mt-2 p-2 rounded bg-blue-50 dark:bg-gray-700 text-sm text-blue-800 dark:text-blue-200"><strong>Admin Note:</strong> {req.adminNotes}</p>}
                           </div>
                           <p className="mt-2 sm:mt-0 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap sm:ml-4">
                                Submitted: {new Date(req.submittedAt).toLocaleString()}
                           </p>
                        </div>
                    </Card>
                )) : (
                    <Card>
                        <p className="text-center text-gray-500 dark:text-gray-400">You have not submitted any service requests yet.</p>
                    </Card>
                )}
            </div>
            
            <Modal title="Submit New Service Request" isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                {user && <RequestForm onSave={handleSave} onClose={() => setModalOpen(false)} userId={user.id} />}
            </Modal>
        </div>
    );
};

export default MyServiceRequests;
