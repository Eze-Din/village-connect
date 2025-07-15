
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Building2 } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    contactNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const isRegistered = await register({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          contactNumber: formData.contactNumber,
      });
      if (isRegistered) {
        setSuccess(true);
      } else {
        setError('An account with this email already exists.');
      }
    } catch (err) {
      setError('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                 <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 text-center">
                     <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Registration Successful!</h2>
                     <p className="mt-4 text-gray-600 dark:text-gray-300">Your account has been created and is now waiting for administrator approval. You will be notified once your account is activated.</p>
                     <Button className="mt-6" onClick={() => navigate('/login')}>Back to Login</Button>
                 </div>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center">
            <Building2 className="h-10 w-10 text-blue-600 dark:text-blue-500" />
            <h2 className="ml-3 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create an Account
            </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input name="fullName" label="Full Name" required onChange={handleChange} />
            <Input name="email" label="Email Address" type="email" required onChange={handleChange} />
            <Input name="address" label="Full Address" required onChange={handleChange} />
            <Input name="contactNumber" label="Contact Number" type="tel" required onChange={handleChange} />
            <Input name="password" label="Password" type="password" required onChange={handleChange} />
            <Input name="confirmPassword" label="Confirm Password" type="password" required onChange={handleChange} />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <Button type="submit" className="w-full flex justify-center" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </div>
             <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already a member?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
