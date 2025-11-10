import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GoogleLoginButton: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received');
      }

      // Call backend to authenticate
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      const userData = data.user;

      // Update auth context
      await login(credentialResponse.credential);
      
      // Navigate based on profile completion
      if (!userData.department || !userData.circle) {
        navigate('/setup-profile', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleError = () => {
    console.error('Login Failed');
    alert('Login failed. Please try again.');
  };

  return (
    <div className="w-full max-w-sm">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={false}
        theme="filled_blue"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="384"
      />
    </div>
  );
};

export default GoogleLoginButton;