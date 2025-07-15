
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { Bid, BidStatus, BidSubmission } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Badge from '../../components/ui/Badge';

const SubmitProposalForm: React.FC<{ bid: Bid, userId: string, onSave: (submission: BidSubmission) => void, onClose: () => void }> = ({ bid, userId, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        vendorName: '',
        bidAmount: 0,
        proposal: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: `sub-${Date.now()}`,
            bidId: bid.id,
            submittedBy: userId,
            bidAmount: Number(formData.bidAmount),
            vendorName: formData.vendorName,
            proposal: formData.proposal,
            submittedAt: new Date().toISOString()
        });
        onClose();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Your Name or Company Name" name="vendorName" value={formData.vendorName} onChange={handleChange} required/>
            <Input label="Bid Amount ($)" name="bidAmount" type="number" value={formData.bidAmount} onChange={handleChange} required/>
            <Textarea label="Proposal Details" name="proposal" value={formData.proposal} onChange={handleChange} required />
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">Submit Proposal</Button>
            </div>
        </form>
    );
};

const Bids: React.FC = () => {
    const { user } = useAuth();
    const { state, dispatch } = useData();
    const [submittingBid, setSubmittingBid] = useState<Bid | null>(null);

    const openBids = state.bids.filter(b => b.status === BidStatus.Open);
    const otherBids = state.bids.filter(b => b.status !== BidStatus.Open);

    const handleSaveSubmission = (submission: BidSubmission) => {
        dispatch({ type: 'ADD_BID_SUBMISSION', payload: submission });
        alert('Your proposal has been submitted successfully!');
    }

    const getStatusBadgeColor = (status: BidStatus) => {
        switch(status) {
            case BidStatus.Open: return 'green';
            case BidStatus.UnderReview: return 'yellow';
            case BidStatus.Awarded: return 'blue';
            case BidStatus.Closed: return 'red';
            default: return 'gray';
        }
    };

    return (
        <div className="space-y-8 px-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Open Bids</h1>
                <p className="text-gray-600 dark:text-gray-400">View and submit proposals for open village projects.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {openBids.length > 0 ? openBids.map(bid => (
                    <Card key={bid.id} className="flex flex-col">
                        <div className="flex-grow">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{bid.title}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Budget: ${bid.budgetEstimate.toLocaleString()}</p>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-4">{bid.description}</p>
                        </div>
                        <div className="border-t dark:border-gray-700 mt-4 pt-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Deadline: {new Date(bid.submissionDeadline).toLocaleString()}</p>
                            <Button className="w-full mt-4" onClick={() => setSubmittingBid(bid)}>Submit Proposal</Button>
                        </div>
                    </Card>
                )) : (
                    <p className="md:col-span-2 lg:col-span-3 text-gray-500 dark:text-gray-400">There are no open bids at this time.</p>
                )}
            </div>

            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-12">Past Bids</h1>
                <p className="text-gray-600 dark:text-gray-400">View information on recently closed or awarded bids.</p>
            </div>
            <div className="space-y-4">
                {otherBids.map(bid => (
                    <Card key={bid.id}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{bid.title}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Budget: ${bid.budgetEstimate.toLocaleString()}</p>
                                {bid.status === BidStatus.Awarded && <p className="mt-1 text-sm font-semibold text-green-600">Awarded to: {bid.awardedTo}</p>}
                            </div>
                            <Badge color={getStatusBadgeColor(bid.status)}>{bid.status}</Badge>
                        </div>
                    </Card>
                ))}
            </div>

            {submittingBid && user && (
                <Modal title={`Submit Proposal for: ${submittingBid.title}`} isOpen={true} onClose={() => setSubmittingBid(null)}>
                    <SubmitProposalForm bid={submittingBid} userId={user.id} onSave={handleSaveSubmission} onClose={() => setSubmittingBid(null)} />
                </Modal>
            )}
        </div>
    );
};

export default Bids;
