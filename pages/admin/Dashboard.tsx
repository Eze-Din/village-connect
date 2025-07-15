
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, FileText, UserPlus, PlusCircle, Megaphone, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useData } from '../../hooks/useData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { BidStatus, ServiceRequestStatus } from '../../types';

const StatCard: React.FC<{ icon: React.ElementType; title: string; value: string | number; color: string }> = ({ icon: Icon, title, value, color }) => (
  <Card className="flex items-center p-4">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  </Card>
);

const QuickAction: React.FC<{ icon: React.ElementType; label: string; to: string; }> = ({ icon: Icon, label, to }) => (
    <Link to={to} className="w-full">
        <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
            <Icon className="h-5 w-5"/>
            <span>{label}</span>
        </Button>
    </Link>
)

const AdminDashboard: React.FC = () => {
  const { state } = useData();

  const openServiceRequests = state.serviceRequests.filter(r => r.status === ServiceRequestStatus.New || r.status === ServiceRequestStatus.InProgress).length;
  const activeBids = state.bids.filter(b => b.status === BidStatus.Open || b.status === BidStatus.UnderReview).length;
  
  const recentActivities = [
      ...state.users.slice(-2).map(u => ({ type: 'New Resident', text: `${u.fullName} registered`, date: u.createdAt, to: '/admin/residents' })),
      ...state.bids.slice(-2).map(b => ({ type: 'New Bid', text: b.title, date: new Date().toISOString(), to: '/admin/bids' })),
      ...state.serviceRequests.slice(-2).map(r => ({ type: 'New Request', text: r.description.substring(0, 30)+'...', date: r.submittedAt, to: '/admin/requests' })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  
  const calendarEvents = state.bids
    .filter(b => b.status === BidStatus.Open)
    .map(b => ({ date: b.submissionDeadline, title: `Bid Deadline: ${b.title}` }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} title="Total Residents" value={state.users.filter(u => u.role === 'RESIDENT').length} color="bg-blue-500" />
        <StatCard icon={Users} title="Total Staff" value={state.staff.length} color="bg-green-500" />
        <StatCard icon={FileText} title="Open Service Requests" value={openServiceRequests} color="bg-yellow-500" />
        <StatCard icon={Briefcase} title="Active Bids" value={activeBids} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <QuickAction icon={UserPlus} label="Add New Staff" to="/admin/staff"/>
                    <QuickAction icon={PlusCircle} label="Create New Bid" to="/admin/bids"/>
                    <QuickAction icon={Megaphone} label="Post Announcement" to="/admin/announcements"/>
                </div>
            </Card>

             {/* Recent Activity */}
            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Activity</h2>
                <ul className="space-y-4">
                    {recentActivities.map((activity, index) => (
                        <li key={index} className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <span className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                                    {activity.type.charAt(0)}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.type}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{activity.text}</p>
                            </div>
                            <div className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(activity.date).toLocaleDateString()}
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
        
        {/* Sidebar-like column for Calendar */}
        <div className="lg:col-span-1">
            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                    <CalendarIcon className="h-6 w-6 mr-2" />
                    Upcoming Deadlines
                </h2>
                <div className="space-y-4">
                    {calendarEvents.length > 0 ? calendarEvents.map((event, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <div className="flex-shrink-0 text-center bg-blue-100 dark:bg-blue-900 rounded-md p-2">
                                <p className="font-bold text-blue-800 dark:text-blue-200">{new Date(event.date).getDate()}</p>
                                <p className="text-xs text-blue-600 dark:text-blue-400">{new Date(event.date).toLocaleString('default', { month: 'short' })}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{event.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Due by {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming deadlines.</p>
                    )}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
