
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Announcement, ServiceRequestStatus } from '../../types';
import Badge from '../../components/ui/Badge';
import { PlusCircle, ArrowRight } from 'lucide-react';

const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({ announcement }) => (
    <div className="p-4 border-l-4 rounded-r-md bg-white dark:bg-gray-800 shadow-sm" style={{ borderLeftColor: announcement.isUrgent ? '#ef4444' : '#3b82f6' }}>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{announcement.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-1">{announcement.content}</p>
        <p className="text-xs text-gray-400 mt-2">{new Date(announcement.publishedAt).toLocaleString()}</p>
    </div>
);


const ResidentDashboard: React.FC = () => {
    const { user } = useAuth();
    const { state } = useData();

    const myRequests = state.serviceRequests.filter(req => req.submittedBy === user?.id);
    const recentAnnouncements = state.announcements.slice(0, 3);
    
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
        <div className="space-y-8 px-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.fullName}!</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Recent Announcements</h2>
                             <Link to="/resident/announcements">
                                <Button variant="ghost" size="sm">View All <ArrowRight className="w-4 h-4 ml-1"/></Button>
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {recentAnnouncements.length > 0 ? (
                                recentAnnouncements.map(ann => <AnnouncementCard key={ann.id} announcement={ann} />)
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No recent announcements.</p>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                     <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">My Service Requests</h2>
                            <Link to="/resident/requests">
                                <Button variant="ghost" size="sm">View All</Button>
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {myRequests.slice(0, 4).map(req => (
                                <div key={req.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{req.category}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{req.description}</p>
                                    </div>
                                    <Badge color={getStatusBadgeColor(req.status)}>{req.status}</Badge>
                                </div>
                            ))}
                             {myRequests.length === 0 && <p className="text-gray-500 dark:text-gray-400">You haven't submitted any requests yet.</p>}
                        </div>
                        <Link to="/resident/requests" className="w-full">
                            <Button className="w-full mt-6">
                                <PlusCircle className="w-5 h-5 mr-2"/> Submit New Request
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ResidentDashboard;
