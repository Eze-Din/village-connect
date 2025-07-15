
import React from 'react';
import { useData } from '../../hooks/useData';
import Card from '../../components/ui/Card';

const ResidentAnnouncements: React.FC = () => {
    const { state } = useData();

    return (
        <div className="space-y-6 px-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Announcements</h1>
            <div className="space-y-4">
                {state.announcements.map(ann => (
                    <Card key={ann.id} className={`border-l-4 ${ann.isUrgent ? 'border-red-500' : 'border-blue-500'}`}>
                        <div className="flex justify-between items-start">
                           <h2 className="text-xl font-bold text-gray-900 dark:text-white">{ann.title}</h2>
                           {ann.isUrgent && <span className="text-sm font-semibold text-red-500">URGENT</span>}
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{ann.content}</p>
                        <p className="mt-4 text-xs text-gray-400">Published: {new Date(ann.publishedAt).toLocaleString()}</p>
                    </Card>
                ))}
                {state.announcements.length === 0 && (
                    <Card>
                        <p className="text-center text-gray-500 dark:text-gray-400">No announcements have been posted yet.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ResidentAnnouncements;
