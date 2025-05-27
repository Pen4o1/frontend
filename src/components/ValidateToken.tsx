import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  IonLoading
} from '@ionic/react'; // ✅ Import IonLoading from Ionic
import config from '../utils/config';

interface ValidateTokenProps {
  onValidation: (
    isValid: boolean,
    isComplete: boolean,
    email: string,
    emailVerified: boolean,
    isGoogle: boolean
  ) => void;
  onVerificationRequired: (token: string, email: string) => void;
}

const ValidateToken: React.FC<ValidateTokenProps> = ({ onValidation, onVerificationRequired }) => {
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [location.pathname]);

  return (
    <IonLoading
      isOpen={loading}
      spinner="crescent"
      translucent
    />
  );
};

export default ValidateToken;
