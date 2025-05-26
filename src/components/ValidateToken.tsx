import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import config from '../utils/config';

interface ValidateTokenProps {
  onValidation: (isValid: boolean, isComplete: boolean, email: string, emailVerified: boolean, isGoogle: boolean) => void;
  onVerificationRequired: (token: string, email: string) => void;
}

const ValidateToken: React.FC<ValidateTokenProps> = ({ onValidation, onVerificationRequired }) => {
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          onValidation(false, false, '', false, false);
          return;
        }

        const response = await fetch(`${config.BASE_URL}/api/validate/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
      });

        if (response.ok) {
          const data = await response.json();
          const email = data.user.email;
          const emailVerified = data.user.email_verified_at !== null;
          const isGoogle = data.user.isGoogle !== null;

          onValidation(data.valid, data.compleated, email, emailVerified, isGoogle);

          if (!emailVerified) {
            onVerificationRequired(token, email);
          }
        } else {
          localStorage.removeItem('jwt_token');
          onValidation(false, false, '', false, false);
        }
      } catch (error) {
        console.error('Error validating token', error);
        onValidation(false, false, '', false, false);
      }
    };

    validateToken();
  }, [location.pathname]); // Add location.pathname as dependency

  return null;
};

export default ValidateToken;