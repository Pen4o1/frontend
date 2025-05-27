import React, { useState, useRef } from 'react';
import {
  IonModal,
  IonButton,
  IonInput,
} from '@ionic/react';
import './styles/verification-code-window.css';

interface VerificationCodeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onVerify: (code: string) => void;
}

const VerificationCodeModal: React.FC<VerificationCodeModalProps> = ({
  isOpen,
  onDismiss,
  onVerify,
}) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLIonInputElement | null)[]>([]);

  const handleInputChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // To move to the next input if available
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

  const handleVerify = () => {
    const verificationCode = code.join('');
    if (verificationCode.length === 6) {
      onVerify(verificationCode);
    } else {
      alert('Please enter a valid 6-digit code.');
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss} backdropDismiss={false}>
      <div className="verification-modal-content">
        <h2>Enter Verification Code</h2>
        <p>We’ve sent a code to your email. Please enter the 6-digit code below.</p>

        <div className="verification-input-container">
          {code.map((digit, index) => (
            <IonInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              id={`code-input-${index}`}
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

        <IonButton expand="block" onClick={handleVerify}>
          Verify
        </IonButton>
      </div>
    </IonModal>
  );
};

export default VerificationCodeModal;
