import React, { useState } from 'react';
import { IonModal, IonButton } from '@ionic/react';
import PasswordChangeModal from '../components/ChangePassword';

interface SettingsWindowProps {
  isOpen: boolean;
  onDismiss: () => void;
}

const SettingsWindow: React.FC<SettingsWindowProps> = ({ isOpen, onDismiss }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
        <div className="settings-modal-content">
          <h2>Settings</h2>
          
          <IonButton 
            expand="block" 
            color="danger" 
            onClick={() => setShowPasswordModal(true)}
          >
            Reset Password
          </IonButton>
          
          <IonButton 
            expand="block" 
            color="medium" 
            onClick={onDismiss}
          >
            Close Settings
          </IonButton>
        </div>
      </IonModal>

      <PasswordChangeModal
        isOpen={showPasswordModal}
        onDismiss={() => setShowPasswordModal(false)}
        onPasswordChanged={() => {
          // Add any post-password-change logic here
          console.log('Password changed successfully!');
        }}
      />
    </>
  );
};

export default SettingsWindow;