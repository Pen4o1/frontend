import React, { useState, useRef } from 'react';
import {
  IonModal,
  IonButton,
  IonInput,
  IonText,
  IonIcon,
  IonItem,
} from '@ionic/react';
import './styles/verification-code-window.css';
import { eye, eyeOff } from 'ionicons/icons';



interface PasswordResetVerificationModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onVerify: (code: string, newPassword: string, confirmPassword: string) => void;
}

const PasswordResetVerificationModal: React.FC<PasswordResetVerificationModalProps> = ({
  isOpen,
  onDismiss,
  onVerify,
}) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputRefs = useRef<(HTMLIonInputElement | null)[]>([]);

  const handleInputChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.setFocus();
      }
    }
  };

  const handleBackspace = (value: string, index: number) => {
    if (value === '' && index > 0) {
      inputRefs.current[index - 1]?.setFocus();
    }
  };

  const validateForm = () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return false;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleVerify = () => {
    setError('');
    if (!validateForm()) return;
    
    onVerify(
      code.join(''),
      newPassword,
      confirmPassword
    );
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss} backdropDismiss={false}>
      <div className="verification-modal-content">
        <h2>Password Reset</h2>
        <p>Enter the 6-digit code sent to your email and your new password.</p>

        <div className="verification-input-container">
          {code.map((digit, index) => (
            <IonInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              className="verification-input"
              value={digit}
              type="number"
              maxlength={1}
              onIonInput={(e: any) => handleInputChange(e.target.value, index)}
              onKeyDown={(e: any) => {
                if (e.key === 'Backspace') {
                  handleBackspace(e.target.value, index);
                }
              }}
            />
          ))}
        </div>

        <div className="password-fields">
          <IonItem>
            <IonInput
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onIonChange={(e) => setNewPassword(e.detail.value!)}
              placeholder="Enter your password"
              required
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
        </div>

        {error && <IonText color="danger" className="error-message">{error}</IonText>}

        <IonButton expand="block" onClick={handleVerify}>
          Reset Password
        </IonButton>
      </div>
    </IonModal>
  );
};

export default PasswordResetVerificationModal;