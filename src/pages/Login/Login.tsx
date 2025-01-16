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
import '../../components/styles/login-style.css';
import { UserContext } from '../../App';
import { useHistory } from 'react-router-dom';
import { eye, eyeOff } from 'ionicons/icons';
import { getClientId, getPlatform } from '../../utils/platform';

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

  interface LoginResponse {
    token: string;
    redirect_url: string;
  }

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('https://grown-evidently-chimp.ngrok-free.app/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      if (response.ok) {
        const data: LoginResponse = await response.json();
  
        // Save the token in local storage
        localStorage.setItem('jwt_token', data.token);
  
        setIsLoggedIn(true);
        setIsCompleated(true);
        setErrorMessage(null);
  
        if (data.redirect_url) {
          console.log('Login successful:', data);
          history.push(data.redirect_url);
        }
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
  
/*
  const handleGoogleLogin = () => {
    const platform = getPlatform();
    const clientId = getClientId(); // Retrieves client ID from environment
    const redirectUri =
      platform === 'ios'
        ? import.meta.env.VITE_IOS_REDIRECT_URI // Using the iOS redirect URI from .env
        : import.meta.env.VITE_WEB_REDIRECT_URI; // Using the Web redirect URI from .env
  
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=profile email openid`;
  
    window.location.href = googleAuthUrl; // Redirects to Google OAuth page
  };

  for the button
  <IonButton
                    expand="block"
                    color="medium"
                    className="social-button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    Continue with Google
                  </IonButton>

    i need to fix for the ios

*/

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
                  fill="outline"
                  className="register-button"
                  disabled={loading}
                >
                  <a href="/register">Create New Account</a>
                </IonButton>

                <div className="social-login-buttons">
                <IonButton
                    href="https://grown-evidently-chimp.ngrok-free.app/api/auth/google"
                    expand="block"
                    color="medium"
                    className="social-button"
                    disabled={loading}
                  >
                    Continue with Google
                  </IonButton>
                </div>

                <IonLoading isOpen={loading} />
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;



