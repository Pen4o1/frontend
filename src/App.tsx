import React, { createContext, useState } from 'react';
import { Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonLoading,
} from '@ionic/react';
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
import ValidateToken from './components/ValidateToken';
import SettingsWindow from './components/SettingsWindow';
import UploadImage from './pages/MyProfile/Upload';
import ColorPalettePreview from './pages/color-test/ColorPalettePreview';
import EmailVerificationHandler from './components/EmailVerification';

import BottomTabBar from './components/TabBars/BottomTabBar';
import TopTabBarCompleted from './components/TabBars/TopTabBarCompleted';
import TopTabBarIncomplete from './components/TabBars/TopTabBarIncomplete';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { setupIonicReact } from '@ionic/react';
import config from './utils/config';
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
    setUserEmail(email);
    setVerificationModalOpen(true);
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

                {isLoggedIn && <BottomTabBar />}

                {isLoggedIn && isCompleated && (
                  <TopTabBarCompleted
                    onShowGoal={() => setShowGoalWindow(true)}
                    onShowMeal={() => setShowMealWindow(true)}
                    onOpenSettings={() => setIsSettingsModalOpen(true)}
                  />
                )}

                {isLoggedIn && !isCompleated && <TopTabBarIncomplete />}
              </IonTabs>

              <EmailVerificationHandler
                userEmail={userEmail}
                isOpen={verificationModalOpen}
                onClose={() => setVerificationModalOpen(false)}
                onLoadingChange={setLoading}
              />

              <SetGoalWindow isOpen={showGoalWindow} onClose={() => setShowGoalWindow(false)} />
              <SetMealPlan isOpen={showMealWindow} onClose={() => setShowMealWindow(false)} />
              <SettingsWindow isOpen={isSettingsModalOpen} onDismiss={() => setIsSettingsModalOpen(false)} />
              <IonLoading isOpen={loading} />
            </>
          </IonReactRouter>
        </IonApp>
      </UserContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
