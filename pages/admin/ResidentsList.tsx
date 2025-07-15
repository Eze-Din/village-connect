
import React from 'react';
import { useData } from '../../hooks/useData';
import { User, Role } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const ResidentsList: React.FC = () => {
    const { state, dispatch } = useData();

    const handleToggleApproval = (user: User) => {
        const updatedUser = { ...user, approved: !user.approved };
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    };

    const residents = state.users.filter(u => u.role === Role.Resident);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resident Accounts</h1>
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left">Name</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">Address</th>
                                <th className="px-6 py-3 text-left">Registered</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {residents.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.approved 
                                            ? <Badge color="green">Approved</Badge> 
                                            : <Badge color="yellow">Pending</Badge>
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Button 
                                            variant={user.approved ? "danger" : "primary"} 
                                            size="sm"
                                            onClick={() => handleToggleApproval(user)}
                                        >
                                            {user.approved ? 'Deactivate' : 'Approve'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ResidentsList;
