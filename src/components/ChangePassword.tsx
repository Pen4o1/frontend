import React, { useState } from 'react';
import { 
  IonModal, 
  IonButton, 
  IonInput, 
  IonItem, 
  IonLabel, 
  IonText,
  IonLoading
} from '@ionic/react';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onPasswordChanged: () => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ 
  isOpen, 
  onDismiss,
  onPasswordChanged
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('https://grown-evidently-chimp.ngrok-free.app/api/change/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: newPassword,
          password_confirmation: confirmPassword
        })
      });

      if (response.ok) {
        setSuccess('Password successfully changed!');
        setTimeout(() => {
          onDismiss();
          onPasswordChanged();
          setNewPassword('');
          setConfirmPassword('');
          setSuccess('');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Password reset failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <div className="settings-modal-content">
        <h2>Change Password</h2>
        
        <IonItem>
          <IonLabel position="stacked">New Password</IonLabel>
          <IonInput
            type="password"
            value={newPassword}
            onIonChange={(e) => {
              setNewPassword(e.detail.value!);
              setError('');
            }}
            placeholder="Enter new password"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Confirm Password</IonLabel>
          <IonInput
            type="password"
            value={confirmPassword}
            onIonChange={(e) => {
              setConfirmPassword(e.detail.value!);
              setError('');
            }}
            placeholder="Confirm new password"
          />
        </IonItem>

        {error && <IonText color="danger">{error}</IonText>}
        {success && <IonText color="success">{success}</IonText>}

        <div className="button-group">
          <IonButton 
            expand="block" 
            color="primary" 
            onClick={handleResetPassword}
            disabled={loading}
          >
            Change Password
          </IonButton>
          
          <IonButton 
            expand="block" 
            color="medium" 
            onClick={() => {
              onDismiss();
              setNewPassword('');
              setConfirmPassword('');
              setError('');
            }}
            disabled={loading}
          >
            Cancel
          </IonButton>
        </div>

        <IonLoading isOpen={loading} message="Updating password..." />
      </div>
    </IonModal>
  );
};

export default PasswordChangeModal;