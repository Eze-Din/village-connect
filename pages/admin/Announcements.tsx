
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Announcement } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import AIDraftButton from '../../components/AIDraftButton';

const AnnouncementForm: React.FC<{ announcement?: Announcement | null; onSave: (announcement: Announcement) => void; onClose: () => void; }> = ({ announcement, onSave, onClose }) => {
    const [title, setTitle] = useState(announcement?.title || '');
    const [content, setContent] = useState(announcement?.content || '');
    const [isUrgent, setIsUrgent] = useState(announcement?.isUrgent || false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: announcement?.id || `ann-${Date.now()}`,
            title,
            content,
            isUrgent,
            publishedAt: new Date().toISOString()
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
             <div className="relative">
                <Textarea label="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
                 <AIDraftButton
                    onGeneratedText={setContent}
                    promptLabel="What is the announcement about?"
                    className="absolute top-0 right-0 mt-1 mr-1"
                />
            </div>
            <div className="flex items-center">
                <input type="checkbox" id="isUrgent" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="isUrgent" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Mark as Urgent</label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">Save Announcement</Button>
            </div>
        </form>
    );
};


const Announcements: React.FC = () => {
    const { state, dispatch } = useData();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    const handleOpenModal = (announcement: Announcement | null = null) => {
        setEditingAnnouncement(announcement);
        setModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingAnnouncement(null);
    };

    const handleSave = (announcement: Announcement) => {
        if (editingAnnouncement) {
            dispatch({ type: 'UPDATE_ANNOUNCEMENT', payload: announcement });
        } else {
            dispatch({ type: 'ADD_ANNOUNCEMENT', payload: announcement });
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            dispatch({ type: 'DELETE_ANNOUNCEMENT', payload: id });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Announcements</h1>
                <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                    <PlusCircle size={20} /> New Announcement
                </Button>
            </div>
            <div className="space-y-4">
                {state.announcements.map(ann => (
                    <Card key={ann.id}>
                        <div className="flex justify-between items-start">
                           <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{ann.title}</h2>
                                {ann.isUrgent && <span className="text-sm font-semibold text-red-500">URGENT</span>}
                           </div>
                            <div className="flex-shrink-0 space-x-1">
                                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(ann)}><Edit size={16} /></Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(ann.id)}><Trash2 size={16} /></Button>
                            </div>
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{ann.content}</p>
                        <p className="mt-4 text-xs text-gray-400">Published: {new Date(ann.publishedAt).toLocaleString()}</p>
                    </Card>
                ))}
            </div>
            
            <Modal title={editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'} isOpen={isModalOpen} onClose={handleCloseModal}>
                <AnnouncementForm announcement={editingAnnouncement} onSave={handleSave} onClose={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default Announcements;
