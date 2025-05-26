import React, { useState } from 'react';
import VerificationCodeModal from './VerificationCodeWindow';
import config from '../utils/config';

interface EmailVerificationHandlerProps {
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
  onLoadingChange: (isLoading: boolean) => void;
}

export const EmailVerificationHandler: React.FC<EmailVerificationHandlerProps> = ({
  userEmail,
  isOpen,
  onClose,
  onLoadingChange,
}) => {
  const handleSendVerificationCode = async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token || !userEmail) return;

    try {
      onLoadingChange(true);
      const response = await fetch(`${config.BASE_URL}/api/send/verification/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        console.error('Failed to send verification email');
      }
    } catch (error) {
      console.error('Error sending verification email', error);
    } finally {
      onLoadingChange(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    const token = localStorage.getItem('jwt_token');
    if (!token || !code || !userEmail) {
      console.error('Invalid input');
      return;
    }

    try {
      onLoadingChange(true);
      const response = await fetch(`${config.BASE_URL}/api/verify/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail, verification_code: code }),
      });

      if (response.ok) {
        onClose();
        alert('Email successfully verified!');
      } else {
        alert('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying email code', error);
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <VerificationCodeModal
      isOpen={isOpen}
      onDismiss={onClose}
      onVerify={handleVerifyCode}
    />
  );
};

export default EmailVerificationHandler;
