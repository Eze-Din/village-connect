
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  if (!user) {
    return <div>Loading profile...</div>;
  }
  
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    contactNumber: user.contactNumber,
    address: user.address
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      ...formData,
    };
    updateUser(updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
      <Card>
        <form onSubmit={handleSave} className="space-y-4">
          <Input 
            label="Full Name" 
            name="fullName"
            value={formData.fullName} 
            onChange={handleInputChange} 
            disabled={!isEditing} 
            required
          />
          <Input 
            label="Email" 
            name="email"
            type="email"
            value={formData.email} 
            onChange={handleInputChange} 
            disabled={true} // Email is not editable
          />
          <Input 
            label="Contact Number" 
            name="contactNumber"
            value={formData.contactNumber} 
            onChange={handleInputChange} 
            disabled={!isEditing}
            required
          />
          <Input 
            label="Address" 
            name="address"
            value={formData.address} 
            onChange={handleInputChange} 
            disabled={!isEditing}
            required
          />
          <div className="flex justify-end gap-2 pt-4">
            {isEditing ? (
              <>
                <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
