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

import Home from './pages/HomePage/HomePage';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgottenPassword/ForgotPassword';
import MyProfile from './pages/MyProfile/MyProfile';
import AddFood from './pages/AddFood/AddFood';
import NutritionInfo from './components/NutritionScreen';
import CompleteRegistration from './pages/CompleteRegistration/CompleteRegistaration';
import SetGoalWindow from './components/SetGoalWindow';
import TestCal from './pages/AddFood/Test-add-foods';
import SetMealPlan from './components/MealPlan';
import TestBackend from './pages/FoodSearch';
import TestRecipes from './pages/test_for_recipes';
import VerificationCodeModal from './components/VerificationCodeWindow';
import ValidateToken from './components/ValidateToken';
import SettingsWindow from './components/SettingsWindow';
import UploadImage from './pages/MyProfile/Upload';
import ColorPalettePreview from './pages/color-test/ColorPalettePreview';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { setupIonicReact } from '@ionic/react';
import config from './config';
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
  const [isGoogle, setIsGoogle] = useState(false);
  const [showGoalWindow, setShowGoalWindow] = useState(false);
  const [showMealWindow, setShowMealWindow] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  // useLocation() must only be used after the <IonReactRouter> is mounted so i need to modify this const location = useLocation();

  const handleValidation = (
    isValid: boolean,
    isComplete: boolean,
    email: string,
    emailVerified: boolean,
    isGoogle: boolean
  ) => {
    setIsLoggedIn(isValid);
    setIsCompleated(isComplete);
    setUserEmail(email);
    setIsGoogle(isGoogle);

    if (isValid && !emailVerified) {
      setVerificationModalOpen(true);
    }

    setLoading(false);
  };

  const handleVerificationRequired = async (token: string, email: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${config.BASE_URL}/api/send/verification/code`, {
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
      const response = await fetch(`${config.BASE_URL}/api/verify/email`, {
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
        <IonApp className="app-wrapper">
          <IonReactRouter>
            <>
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
                  <Route exact path="/test4">
                    <UploadImage />
                  </Route>
                  <Route exact path="/colors" component={ColorPalettePreview} />
                </IonRouterOutlet>

                {isLoggedIn && (
                  <IonTabBar slot="bottom">
                    <IonTabButton tab="add-food" href="/add-food" selected={location.pathname === '/add-food'}>
                      <IonIcon icon={add} color="primary" />
                      <IonLabel>Add Food</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="home" href="/home" selected={location.pathname === '/home'}>
                      <IonIcon icon={home} color="primary" />
                      <IonLabel>Home</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="my-profile" href="/my-profile" selected={location.pathname === '/my-profile'}>
                      <IonIcon icon={person} color="primary" />
                      <IonLabel>Profile</IonLabel>
                    </IonTabButton>
                  </IonTabBar>
                )}

                {isLoggedIn && isCompleated && (
                  <IonTabBar slot="top">
                    <IonTabButton tab="Set Goal" onClick={() => setShowGoalWindow(true)}>
                      <IonButton color="secondary" expand="full">Set Goal</IonButton>
                    </IonTabButton>
                    <IonTabButton tab="Set Meal Plan" onClick={() => setShowMealWindow(true)}>
                      <IonButton color="secondary" expand="full">Set Meal Plan</IonButton>
                    </IonTabButton>
                    <IonTabButton tab="Settings" onClick={() => setIsSettingsModalOpen(true)}>
                      <IonButton fill="clear" className="icon-button">
                        <IonIcon icon={settings} slot="start" color="secondary" />
                      </IonButton>
                    </IonTabButton>
                  </IonTabBar>
                )}

                {isLoggedIn && !isCompleated && (
                  <IonTabBar slot="top">
                    <IonTabButton tab="Complete registration" href="/complete-registaration">
                      <IonButton color="primary" expand="full">Complete registration</IonButton>
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
            </>
          </IonReactRouter>

          <IonLoading isOpen={loading} />
        </IonApp>
      </UserContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
