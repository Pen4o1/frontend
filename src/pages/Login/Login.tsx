import React, { useContext, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonLoading,
  IonButton,
  IonItem,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import { UserContext } from '../../App';
import { useHistory } from 'react-router-dom';
import '../../components/styles/login-style.css';
import GoogleLogin from '../../components/GoogleLogin';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const context = useContext(UserContext);
  const history = useHistory();

  if (!context) {
    throw new Error('UserContext must be used within a UserContext.Provider');
  }

  const { setIsLoggedIn, setIsCompleated } = context;

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('https://grown-evidently-chimp.ngrok-free.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('jwt_token', data.token);
        setIsLoggedIn(true);
        setIsCompleated(true);
        history.push(data.redirect_url);
      } else if (response.status === 422) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Invalid credentials.');
      } else {
        setErrorMessage('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>MacroGenie</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="login-content">
        <IonGrid className="ion-justify-content-center ion-align-items-center">
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <div className="form-box">
                <IonItem>
                  <h2>Login</h2>
                </IonItem>

                <IonItem>
                  <IonInput
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </IonItem>

                <IonItem>
                  <IonInput
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
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

                {errorMessage && (
                  <IonText color="danger" className="error-message">
                    {errorMessage}
                  </IonText>
                )}

                <IonButton
                  expand="block"
                  className="login-button"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </IonButton>

                <IonButton
                  expand="block"
                  className="login-button"
                  href="/register"
                  disabled={loading}
                >
                  Create New Account
                </IonButton>

                <div className="social-login-buttons">
                  <GoogleLogin />
                </div>

                <IonButton
                  expand="block"
                  fill="clear"
                  className="forgot-password-button"
                  routerLink="/forgot-password"
                  disabled={loading}
                >
                  Forgot Password?
                </IonButton>

                <IonLoading isOpen={loading} />
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonText>
          Version 1.0.2
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default Login;
