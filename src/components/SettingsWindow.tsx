import React, { useState } from 'react';
import { IonModal, IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';

interface SettingsWindowProps {
  isOpen: boolean;
  onDismiss: () => void;
}

const SettingsWindow: React.FC<SettingsWindowProps> = ({ isOpen, onDismiss }) => {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = () => {
    // Handle password reset i already have the backend and the verification code frontend
  };

  const handleChangeEmail = () => {
    // Handle email change logic 
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <div className="settings-modal-content">
        <IonItem>
          <IonLabel position="floating">New Email</IonLabel>
          <IonInput value={newEmail} onIonChange={(e) => setNewEmail(e.detail.value!)} />
        </IonItem>
        <IonButton expand="block" color="primary" onClick={handleChangeEmail}>
          Change Email
        </IonButton>
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
