import React, { useContext, useState, useEffect } from 'react';
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
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { UserContext } from '../../App';
import { useHistory } from 'react-router-dom';
import '../../components/styles/login-style.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const context = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    // Initialize Google Auth for web
    GoogleAuth.initialize({
      clientId: '918043959140-c0c6cur70js4ubt6hsb4seik2l90jf26.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true
    });
  }, []);

  if (!context) {
    throw new Error('UserContext must be used within a UserContext.Provider');
  }

  const { setIsLoggedIn, setIsCompleated } = context;

  interface LoginResponse {
    token: string;
    redirect_url: string;
  }

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
        const data: LoginResponse = await response.json();
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

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await GoogleAuth.signIn();
      
      if (!result.authentication?.idToken) {
        throw new Error('No ID token received');
      }

      const response = await fetch('https://grown-evidently-chimp.ngrok-free.app/api/web/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_token: result.authentication.idToken,
          access_token: result.authentication.accessToken
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('jwt_token', data.token);
        setIsLoggedIn(true);
        setIsCompleated(data.user.compleated);
        history.push(data.redirect_url);
      } else {
        setErrorMessage('Google login failed');
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      setErrorMessage(
        error.message === 'popup_closed_by_user' 
          ? 'Login canceled' 
          : 'Google login failed'
      );
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
                  <IonButton
                    expand="block"
                    color="medium"
                    className="social-button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    Continue with Google
                  </IonButton>
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
        <IonText className="version-text">
          Version 1.0.1
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default Login;