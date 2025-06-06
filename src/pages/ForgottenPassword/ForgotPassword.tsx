import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonInput, 
  IonButton, 
  IonItem, 
  IonLabel, 
  IonText,
  IonLoading,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import '../../components/styles/login-style.css'; 
import ResetPasswordWindow from '../../components/ResetPasswordWindow';
import config from '../../utils/config';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();


  const handleSendCode = async () => {
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${config.BASE_URL}/api/password/reset/send/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setShowVerificationModal(true);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (code: string, newPassword: string, confirmPassword: string) => {
    if (!code || !newPassword || !confirmPassword) {
      setErrorMessage('Please fill all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${config.BASE_URL}/api/password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email,
          code: code,
          password: newPassword
        }),
      });

      if (response.ok) {
        alert('Password successfully reset!');
        setShowVerificationModal(false);
        setEmail('');
        setErrorMessage('');
        history.push('/login');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Forgot Password</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="login-content">
        <IonGrid className="ion-justify-content-center ion-align-items-center">
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <div className="form-box">
                <IonText className="ion-padding login-item">
                  <h3>Enter your email to reset password</h3>
                </IonText>

                <IonItem className="input-box">
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonInput
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                    placeholder="Enter your registered email"
                    required
                  />
                </IonItem>

                {errorMessage && (
                  <IonText color="danger" className="ion-padding">
                    <p>{errorMessage}</p>
                  </IonText>
                )}

                <IonButton
                  expand="block"
                  onClick={handleSendCode}
                  disabled={loading}
                  className="ion-margin-top"
                >
                  Send Verification Code
                </IonButton>

                <p className="sign-up-text">
                  Go back to login? <a href="/login" className="sign-up-link">Sign In</a>
                </p>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        <ResetPasswordWindow
          isOpen={showVerificationModal}
          onDismiss={() => {
            setShowVerificationModal(false);
            setErrorMessage('');
          }}
          onVerify={handlePasswordReset}
        />

        <IonLoading isOpen={loading} message={'Processing...'} />
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;