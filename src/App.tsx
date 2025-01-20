import React, { createContext, useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonButton,
  IonIcon,
  IonLabel,
  IonTabs,
  IonLoading,
  IonModal,
  IonInput,
  IonItem,
  IonLabel as IonFormLabel,
  IonButton as IonModalButton,
} from '@ionic/react';
import { home, add, person } from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home-page/Home-page';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/Forgotten-password/Forgot-password';
import MyProfile from './pages/My-profile/My-profile';
import AddFood from './pages/Add-food/Add-food';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { setupIonicReact } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './components/styles/app-style.css';
import NutritionInfo from './components/nutritionScreen';
import CompleteRegistration from './pages/Complete-registration/Complete-registaration';
import SetGoalWindow from './components/SetGoalWindow';
import TestCal from './pages/Add-food/Test-add-foods';
import SetMealPlan from './components/MealPlan';
import TestBAckend from './pages/FoodSearch';
import TEstRecipes from './pages/test_for_recipes';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

export const UserContext = createContext<{
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  isCompleated: boolean;
  setIsCompleated: (value: boolean) => void;
} | null>(null);

setupIonicReact();

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCompleated, setIsCompleated] = useState(false);
  const [showGoalWindow, setShowGoalWindow] = useState(false);
  const [showMealWindow, setShowMealWindow] = useState(false);
  const [showGetMealPLan, setShowGetMealPlan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const history = useHistory();

  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          history.push('/login');
          setLoading(false);
          return;
        }

        const response = await fetch(
          'https://grown-evidently-chimp.ngrok-free.app/api/validate/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.valid);
          setIsCompleated(data.compleated);

          // Store user email
          const email = data.user.email;
          setUserEmail(email);

          // If email is not verified, trigger email verification
          if (data.user.email_verified_at === null) {
            setVerificationModalOpen(true); // Show modal to input the verification code
            // Send verification email request with the user's email
            await sendVerificationEmail(token, email);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Authentication check failed', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [history]); // Runs only once on mount

  // Function to send the verification email request
  const sendVerificationEmail = async (token: string, email: string) => {
    try {
      const response = await fetch(
        'https://grown-evidently-chimp.ngrok-free.app/api/send-verification-code',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }), // Add email in the payload
        }
      );
      if (!response.ok) {
        console.error('Failed to send verification email');
      }
    } catch (error) {
      console.error('Error sending verification email', error);
    }
  };

  // Function to verify the code entered by the user
  const verifyCode = async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token || !verificationCode || !userEmail) {
      console.error('Invalid input');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'https://grown-evidently-chimp.ngrok-free.app/api/verify-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: userEmail, verification_code: verificationCode }), // Use the stored email and code
        }
      );

      if (response.ok) {
        // Close modal when email is verified
        setVerificationModalOpen(false);
        alert('Email successfully verified!');
      } else {
        alert('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying email code', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <UserContext.Provider
        value={{ isLoggedIn, setIsLoggedIn, isCompleated, setIsCompleated }}
      >
        <IonApp>
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/">
                  {isLoggedIn ? <Home/> : <Login />}
                </Route>
                <Route exact path="/home">
                  {isLoggedIn ? <Home />: <Login/>}
                </Route>
                <Route exact path="/add-food">
                  {isLoggedIn ? <AddFood />: <Login/>}
                </Route>
                <Route exact path="/my-profile">
                  {isLoggedIn ? <MyProfile/>: <Login/> }
                </Route>
                <Route exact path="/login">
                  {isLoggedIn ? <Home/> : <Login />}
                </Route>
                <Route exact path="/register">
                  {isLoggedIn ? <Home/> : <Register />}</Route>
                <Route exact path="/forgot-password">
                  <ForgotPassword />
                </Route>
                <Route exact path="/nutrition-info" component={NutritionInfo} />
                <Route exact path="/complete-registaration">
                  <CompleteRegistration />
                </Route>
                <Route exact path="/test">
                  <TestCal />
                </Route>
                <Route exact path="/test2">
                  <TestBAckend />
                </Route>
                <Route exact path="/test3">
                  <TEstRecipes />
                </Route>
              </IonRouterOutlet>

              {isLoggedIn && (
                <IonTabBar slot="bottom">
                  <IonTabButton tab="home" href="/home">
                    <IonIcon icon={home} />
                    <IonLabel>Home</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="add-food" href="/add-food">
                    <IonIcon icon={add} />
                    <IonLabel>Add Food</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="my-profile" href="/my-profile">
                    <IonIcon icon={person} />
                    <IonLabel>Profile</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              )}

              {isLoggedIn && isCompleated && (
                <IonTabBar slot="top">
                  <IonTabButton tab="Set Goal" onClick={() => setShowGoalWindow(true)}>
                    <IonButton>Set Goal</IonButton>
                  </IonTabButton>
                  <IonTabButton tab="Set Meal Plan" onClick={() => setShowMealWindow(true)}>
                    <IonButton>Set Meal Plan</IonButton>
                  </IonTabButton>
                </IonTabBar>
              )}

              {isLoggedIn && !isCompleated && (
                <IonTabBar slot="top">
                  <IonTabButton tab="Complete registration" href="/complete-registaration">
                    <IonButton>Complete registration</IonButton>
                  </IonTabButton>
                </IonTabBar>
              )}
            </IonTabs>

            {/* Modal for verification */}
            <IonModal 
            isOpen={verificationModalOpen} 
            onDidDismiss={() => setVerificationModalOpen(false)} 
            backdropDismiss={false}
            >
              <IonItem>
                <IonFormLabel>Verification Code</IonFormLabel>
                <IonInput
                  value={verificationCode}
                  onIonChange={(e) => setVerificationCode(e.detail.value!)}
                  placeholder="Enter the code from your email"
                />
              </IonItem>
              <IonModalButton onClick={verifyCode}>Verify</IonModalButton>
            </IonModal>

            <SetGoalWindow isOpen={showGoalWindow} onClose={() => setShowGoalWindow(false)} />
            <SetMealPlan isOpen={showMealWindow} onClose={() => setShowMealWindow(false)} />
          </IonReactRouter>
          <IonLoading isOpen={loading} />
        </IonApp>
      </UserContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
