import React, { useState } from 'react';
import { IonModal, IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';

interface SettingsWindowProps {
  isOpen: boolean;
  onDismiss: () => void;
}

const SettingsWindow: React.FC<SettingsWindowProps> = ({ isOpen, onDismiss }) => {
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = () => {
    // Handle password reset i already have the backend and the verification code frontend
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <div className="settings-modal-content">
        <IonButton expand="block" color="danger" onClick={handleResetPassword}>
          Reset Password
        </IonButton>
        <IonButton expand="block" color="medium" onClick={onDismiss}>
          Close
        </IonButton>
      </div>
    </IonModal>
  );
};

export default SettingsWindow;
