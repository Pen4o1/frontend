import React, { useState, useEffect, useContext } from 'react';
import { IonButton, IonIcon, IonLoading, IonText } from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { UserContext } from '../App';
import { useHistory } from 'react-router-dom';
import { getPlatform } from '../utils/platform';
import '../components/styles/google-login-style.css'

const GoogleLogin: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const context = useContext(UserContext);
  const history = useHistory();

  const getClientId = (): string => {
    const platform = getPlatform();
    switch (platform) {
      case 'ios':
        return 'com.googleusercontent.apps.918043959140-fo9rk75odt49nbmsbdgothp1pqlhh5kv';
      case 'android':
        return 'android-client-id'; 
      default:
        return '918043959140-c0c6cur70js4ubt6hsb4seik2l90jf26.apps.googleusercontent.com';
    }
  };

  useEffect(() => {
    const clientId = getClientId();
    GoogleAuth.initialize({
      clientId: clientId,
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });
  }, []);

  if (!context) {
    throw new Error('UserContext must be used within a UserContext.Provider');
  }

  const { setIsLoggedIn, setIsCompleated } = context;

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
          access_token: result.authentication.accessToken,
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
    <div>
      {errorMessage && (
        <IonText color="danger" className="error-message">
          {errorMessage}
        </IonText>
      )}
      <IonButton
        expand="block"
        className="google-button"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        <IonIcon icon={logoGoogle} className="google-icon"/>
        Continue with Google
      </IonButton>
      <IonLoading isOpen={loading} />
    </div>
  );
};

export default GoogleLogin;
