import React, { useState } from 'react';
import { 
  IonModal, 
  IonButton, 
  IonInput, 
  IonItem, 
  IonLabel, 
  IonText,
  IonLoading,
  IonIcon
} from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import config from '../config';


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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      const response = await fetch(`${config.BASE_URL}/api/change/password`, {
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
          <IonInput
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onIonChange={(e) => setNewPassword(e.detail.value!)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
          <IonIcon
            slot="end"
            icon={showPassword ? eye : eyeOff}
            onClick={() => setShowPassword(!showPassword)}
          />
        </IonItem>

        <IonItem>
          <IonInput
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onIonChange={(e) =>
              setConfirmPassword(e.detail.value!)
            }
            placeholder="Confirm password"
            required
          >
            <IonIcon
              slot="end"
              icon={showConfirmPassword ? eye : eyeOff}
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
          </IonInput>
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