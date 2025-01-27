import React, { createContext, useState } from 'react';
import { Route, useLocation } from 'react-router-dom';
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
} from '@ionic/react';
import { home, add, person, settings } from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home-page/Home-page';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/Forgotten-password/Forgot-password';
import MyProfile from './pages/My-profile/My-profile';
import AddFood from './pages/Add-food/Add-food';
import NutritionInfo from './components/nutritionScreen';
import CompleteRegistration from './pages/Complete-registration/Complete-registaration';
import SetGoalWindow from './components/SetGoalWindow';
import TestCal from './pages/Add-food/Test-add-foods';
import SetMealPlan from './components/MealPlan';
import TestBackend from './pages/FoodSearch';
import TestRecipes from './pages/test_for_recipes';
import VerificationCodeModal from './components/VerificationCodeWindow';
import ValidateToken from './components/ValidateToken';
import SettingsWindow from './components/SettingsWindow';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { setupIonicReact } from '@ionic/react';
import './components/styles/app-style.css';

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

// UserContext for global state management
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
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleValidation = (isValid: boolean, isComplete: boolean, email: string, emailVerified: boolean) => {
    setIsLoggedIn(isValid);
    setIsCompleated(isComplete);
    setUserEmail(email);

    if (isValid && !emailVerified) {
      setVerificationModalOpen(true);
    }

    setLoading(false);
  };

  const handleVerificationRequired = async (token: string, email: string) => {
    try {
      setLoading(true);
      const response = await fetch('https://grown-evidently-chimp.ngrok-free.app/api/send/verification/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        console.error('Failed to send verification email');
      }
    } catch (error) {
      console.error('Error sending verification email', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    const token = localStorage.getItem('jwt_token');
    if (!token || !code || !userEmail) {
      console.error('Invalid input');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://grown-evidently-chimp.ngrok-free.app/api/verify/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail, verification_code: code }),
      });

      if (response.ok) {
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
      <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, isCompleated, setIsCompleated }}>
        <IonApp>
          <IonReactRouter>
            <ValidateToken 
              onValidation={handleValidation} 
              onVerificationRequired={handleVerificationRequired} 
            />

            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/">
                  {isLoggedIn ? <Home /> : <Login />}
                </Route>
                <Route exact path="/home">
                  {isLoggedIn ? <Home /> : <Login />}
                </Route>
                <Route exact path="/add-food">
                  {isLoggedIn ? <AddFood /> : <Login />}
                </Route>
                <Route exact path="/my-profile">
                  {isLoggedIn ? <MyProfile /> : <Login />}
                </Route>
                <Route exact path="/login">
                  {isLoggedIn ? <Home /> : <Login />}
                </Route>
                <Route exact path="/register">
                  {isLoggedIn ? <Home /> : <Register />}
                </Route>
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
                  <TestBackend />
                </Route>
                <Route exact path="/test3">
                  <TestRecipes />
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
                  <IonTabButton tab="Settings" onClick={() => setIsSettingsModalOpen(true)}>
                    <IonButton fill="clear" className="icon-button">
                      <IonIcon icon={settings} slot="start" />
                    </IonButton>
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

            <VerificationCodeModal
              isOpen={verificationModalOpen}
              onDismiss={() => setVerificationModalOpen(false)}
              onVerify={handleVerifyCode}
            />

            <SetGoalWindow isOpen={showGoalWindow} onClose={() => setShowGoalWindow(false)} />

            <SetMealPlan isOpen={showMealWindow} onClose={() => setShowMealWindow(false)} />

            <SettingsWindow isOpen={isSettingsModalOpen} onDismiss={() => setIsSettingsModalOpen(false)} />
          </IonReactRouter>

          <IonLoading isOpen={loading} />
        </IonApp>
      </UserContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default App;