
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Bid, BidStatus, BidSubmission } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import { PlusCircle, Edit, Trash2, Eye, Award } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import AIDraftButton from '../../components/AIDraftButton';

const BidForm: React.FC<{ bid?: Bid | null; onSave: (bid: Bid) => void; onClose: () => void; }> = ({ bid, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        title: bid?.title || '',
        description: bid?.description || '',
        budgetEstimate: bid?.budgetEstimate || 0,
        submissionDeadline: bid?.submissionDeadline ? new Date(bid.submissionDeadline).toISOString().substring(0, 16) : '',
        status: bid?.status || BidStatus.Open,
        awardedTo: bid?.awardedTo || '',
    });
    
    const [description, setDescription] = useState(bid?.description || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'budgetEstimate' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: bid?.id || `bid-${Date.now()}`,
            description,
            submissionDeadline: new Date(formData.submissionDeadline).toISOString(),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Title" name="title" value={formData.title} onChange={handleChange} required />
            <div className="relative">
                <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} required />
                 <AIDraftButton
                    onGeneratedText={setDescription}
                    promptLabel="Describe the bid requirements..."
                    className="absolute top-0 right-0 mt-1 mr-1"
                />
            </div>
            <Input label="Budget Estimate ($)" name="budgetEstimate" type="number" value={formData.budgetEstimate} onChange={handleChange} required />
            <Input label="Submission Deadline" name="submissionDeadline" type="datetime-local" value={formData.submissionDeadline} onChange={handleChange} required />
            <Select label="Status" name="status" value={formData.status} onChange={handleChange} required>
                {Object.values(BidStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            {formData.status === BidStatus.Awarded && (
                 <Input label="Awarded To" name="awardedTo" value={formData.awardedTo} onChange={handleChange} required />
            )}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">Save Bid</Button>
            </div>
        </form>
    );
};

const ViewSubmissionsModal: React.FC<{ bid: Bid; submissions: BidSubmission[]; onClose: () => void, onAward: (bid: Bid, vendorName: string) => void }> = ({ bid, submissions, onClose, onAward }) => (
    <Modal title={`Submissions for: ${bid.title}`} isOpen={true} onClose={onClose}>
        {submissions.length > 0 ? (
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead><tr><th className="px-4 py-2 text-left">Vendor</th><th className="px-4 py-2 text-left">Amount</th><th className="px-4 py-2 text-left">Submitted</th><th className="px-4 py-2 text-left">Actions</th></tr></thead>
                    <tbody>
                        {submissions.map(sub => (
                            <tr key={sub.id}>
                                <td className="px-4 py-2">{sub.vendorName}</td>
                                <td className="px-4 py-2">${sub.bidAmount.toLocaleString()}</td>
                                <td className="px-4 py-2">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                                <td>
                                    <Button variant="ghost" size="sm" onClick={() => onAward(bid, sub.vendorName)} title="Award Bid to this Vendor">
                                        <Award className="w-4 h-4 text-green-500"/>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        ) : <p>No submissions yet for this bid.</p>}
    </Modal>
)

const BidManagement: React.FC = () => {
    const { state, dispatch } = useData();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingBid, setEditingBid] = useState<Bid | null>(null);
    const [viewingSubmissions, setViewingSubmissions] = useState<Bid | null>(null);
    
    const handleOpenModal = (bid: Bid | null = null) => {
        setEditingBid(bid);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingBid(null);
    };

    const handleSaveBid = (bid: Bid) => {
        if (editingBid) {
            dispatch({ type: 'UPDATE_BID', payload: bid });
        } else {
            dispatch({ type: 'ADD_BID', payload: bid });
        }
        handleCloseModal();
    };

    const handleDeleteBid = (id: string) => {
        if (window.confirm("Are you sure you want to delete this bid?")) {
            dispatch({ type: 'DELETE_BID', payload: id });
        }
    };
    
    const handleAwardBid = (bid: Bid, vendorName: string) => {
        if (window.confirm(`Are you sure you want to award this bid to ${vendorName}?`)) {
            const updatedBid = { ...bid, status: BidStatus.Awarded, awardedTo: vendorName };
            dispatch({ type: 'UPDATE_BID', payload: updatedBid });
            setViewingSubmissions(null);
        }
    }
    
    const getStatusBadgeColor = (status: BidStatus) => {
        switch(status) {
            case BidStatus.Open: return 'green';
            case BidStatus.UnderReview: return 'yellow';
            case BidStatus.Awarded: return 'blue';
            case BidStatus.Closed: return 'red';
            default: return 'gray';
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bid Management</h1>
                <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                    <PlusCircle size={20} /> Create Bid
                </Button>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.bids.map(bid => {
                    const submissions = state.bidSubmissions.filter(sub => sub.bidId === bid.id);
                    return (
                        <Card key={bid.id} className="flex flex-col">
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{bid.title}</h2>
                                    <Badge color={getStatusBadgeColor(bid.status)}>{bid.status}</Badge>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Budget: ${bid.budgetEstimate.toLocaleString()}</p>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{bid.description}</p>
                                {bid.status === BidStatus.Awarded && <p className="mt-2 text-sm font-semibold text-green-600">Awarded to: {bid.awardedTo}</p>}
                            </div>
                            <div className="border-t dark:border-gray-700 mt-4 pt-4">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Deadline: {new Date(bid.submissionDeadline).toLocaleString()}</p>
                                <div className="flex justify-between items-center mt-2">
                                     <Button variant="ghost" size="sm" onClick={() => setViewingSubmissions(bid)}>
                                        <Eye size={16} className="mr-1" /> View Submissions ({submissions.length})
                                    </Button>
                                    <div className="space-x-1">
                                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(bid)}><Edit size={16} /></Button>
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDeleteBid(bid.id)}><Trash2 size={16} /></Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            <Modal title={editingBid ? 'Edit Bid' : 'Create New Bid'} isOpen={isModalOpen} onClose={handleCloseModal}>
                <BidForm bid={editingBid} onSave={handleSaveBid} onClose={handleCloseModal} />
            </Modal>
            
            {viewingSubmissions && (
                <ViewSubmissionsModal 
                    bid={viewingSubmissions} 
                    submissions={state.bidSubmissions.filter(s => s.bidId === viewingSubmissions.id)}
                    onClose={() => setViewingSubmissions(null)}
                    onAward={handleAwardBid}
                />
            )}
        </div>
    );
};

export default BidManagement;
