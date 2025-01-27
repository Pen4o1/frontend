import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ValidateTokenProps {
  onValidation: (isValid: boolean, isComplete: boolean, email: string, emailVerified: boolean) => void;
  onVerificationRequired: (token: string, email: string) => void;
}

const ValidateToken: React.FC<ValidateTokenProps> = ({ onValidation, onVerificationRequired }) => {
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          onValidation(false, false, '', false);
          return;
        }

        const response = await fetch('https://grown-evidently-chimp.ngrok-free.app/api/validate/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        signal: controller.signal, // Attach abort signal
      });

      clearTimeout(timeoutId); 
        if (response.ok) {
          const data = await response.json();
          const email = data.user.email;
          const emailVerified = data.user.email_verified_at !== null;

          onValidation(data.valid, data.compleated, email, emailVerified);

          if (!emailVerified) {
            onVerificationRequired(token, email);
          }
        } else {
          localStorage.removeItem('jwt_token');
          onValidation(false, false, '', false);
        }
      } catch (error) {
        console.error('Error validating token', error);
        onValidation(false, false, '', false);
      }
    };

    validateToken();
  }, [location.pathname]); // Add location.pathname as dependency

  return null;
};

export default ValidateToken;