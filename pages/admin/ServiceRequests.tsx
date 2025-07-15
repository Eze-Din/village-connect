
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { ServiceRequest, ServiceRequestStatus, User } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Badge from '../../components/ui/Badge';
import { Eye } from 'lucide-react';

const RequestDetailsModal: React.FC<{
    request: ServiceRequest;
    resident: User | undefined;
    onClose: () => void;
    onUpdate: (request: ServiceRequest) => void;
}> = ({ request, resident, onClose, onUpdate }) => {
    const [status, setStatus] = useState(request.status);
    const [adminNotes, setAdminNotes] = useState(request.adminNotes || '');

    const handleUpdate = () => {
        onUpdate({ ...request, status, adminNotes });
        onClose();
    };

    return (
        <Modal title={`Request #${request.id.substring(0, 8)}`} isOpen={true} onClose={onClose}>
            <div className="space-y-4">
                <div><strong>Resident:</strong> {resident?.fullName || 'N/A'} ({resident?.email})</div>
                <div><strong>Location:</strong> {request.location}</div>
                <div><strong>Submitted:</strong> {new Date(request.submittedAt).toLocaleString()}</div>
                <div><strong>Category:</strong> {request.category}</div>
                <p><strong>Description:</strong> {request.description}</p>
                {request.photoUrl && <img src={request.photoUrl} alt="Issue" className="max-w-full rounded-lg mt-2" />}
                <hr className="dark:border-gray-600"/>
                <Select label="Update Status" value={status} onChange={(e) => setStatus(e.target.value as ServiceRequestStatus)}>
                    {Object.values(ServiceRequestStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Textarea label="Admin Notes (Private)" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button onClick={handleUpdate}>Update Request</Button>
                </div>
            </div>
        </Modal>
    );
};

const ServiceRequests: React.FC = () => {
    const { state, dispatch } = useData();
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

    const handleUpdate = (request: ServiceRequest) => {
        dispatch({ type: 'UPDATE_SERVICE_REQUEST', payload: request });
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
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resident Service Requests</h1>
            <Card>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left">Category</th>
                                <th className="px-6 py-3 text-left">Description</th>
                                <th className="px-6 py-3 text-left">Resident</th>
                                <th className="px-6 py-3 text-left">Submitted</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {state.serviceRequests.map(req => {
                                const resident = state.users.find(u => u.id === req.submittedBy);
                                return (
                                    <tr key={req.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{req.category}</td>
                                        <td className="px-6 py-4 max-w-sm whitespace-nowrap overflow-hidden text-ellipsis text-sm text-gray-500 dark:text-gray-300">{req.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{resident?.fullName || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(req.submittedAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><Badge color={getStatusBadgeColor(req.status)}>{req.status}</Badge></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(req)}>
                                                <Eye size={16} className="mr-1"/> View
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                         </tbody>
                    </table>
                </div>
            </Card>
            {selectedRequest && (
                <RequestDetailsModal 
                    request={selectedRequest}
                    resident={state.users.find(u => u.id === selectedRequest.submittedBy)}
                    onClose={() => setSelectedRequest(null)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default ServiceRequests;
