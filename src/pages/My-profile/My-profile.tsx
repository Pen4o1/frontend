// src/pages/MyProfile.tsx

import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonAvatar,
  IonButton,
  IonIcon,
  IonToggle,
} from '@ionic/react';
import { pencil, settings, logOut, list } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import EditProfileModal from '../../components/EditProfileWindow';
import ShoppingListModal from '../../components/ShoppingListWindow';
import '../../components/styles/profile-style.css';

const MyProfile: React.FC = () => {
  const [themeToggle, setThemeToggle] = useState(false);
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    avatar: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShoppingListModalOpen, setIsShoppingListModalOpen] = useState(false);
  const history = useHistory();

  // Dark theme toggle logic
  const toggleChange = (event: any) => {
    toggleDarkTheme(event.detail.checked);
  };

  const toggleDarkTheme = (shouldAdd: boolean) => {
    document.body.classList.toggle('dark', shouldAdd);
  };

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const initializeDarkTheme = (isDark: boolean) => {
      setThemeToggle(isDark);
      toggleDarkTheme(isDark);
    };

    initializeDarkTheme(prefersDark.matches);

    const setDarkThemeFromMediaQuery = (mediaQuery: MediaQueryListEvent) => {
      initializeDarkTheme(mediaQuery.matches);
    };

    prefersDark.addEventListener('change', setDarkThemeFromMediaQuery);
    return () => {
      prefersDark.removeEventListener('change', setDarkThemeFromMediaQuery);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('jwt_token');
    history.push('/login');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          history.push('/login');
          return;
        }
        const response = await fetch('https://grown-evidently-chimp.ngrok-free.app/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data.');
        }

        const result = await response.json();

        setUserData({
          first_name: result.first_name,
          last_name: result.last_name,
          avatar: result.avatar || 'https://ionicframework.com/docs/img/demos/avatar.svg',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = (updatedData: { first_name: string; last_name: string }) => {
    setUserData({
      ...userData,
      ...updatedData,
    });
    setIsModalOpen(false);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding profile-content">
        <div className="profile-box">
          <div className="profile-header">
            <IonAvatar className="profile-avatar">
              <img alt="User's avatar" src={userData.avatar} />
            </IonAvatar>
            <h2>{userData.first_name}</h2>
            <p>{userData.last_name}</p>
          </div>

          <div className="profile-buttons">
            <IonToggle checked={themeToggle} onIonChange={toggleChange}>
              Dark Mode
            </IonToggle>
            <IonButton expand="block" color="primary" className="profile-button" onClick={() => setIsModalOpen(true)}>
              <IonIcon icon={pencil} slot="start" />
              Edit Profile
            </IonButton>
            <IonButton
              expand="block"
              color="tertiary"
              className="profile-button"
              onClick={() => setIsShoppingListModalOpen(true)}
            >
              <IonIcon icon={list} slot="start" />
              Shopping List
            </IonButton>
            <IonButton expand="block" color="medium" className="profile-button">
              <IonIcon icon={settings} slot="start" />
              Settings
            </IonButton>
            <IonButton expand="block" color="danger" className="profile-button" onClick={logout}>
              <IonIcon icon={logOut} slot="start" />
              Logout
            </IonButton>
          </div>
        </div>
      </IonContent>

      <EditProfileModal isOpen={isModalOpen} onDismiss={() => setIsModalOpen(false)} userData={userData} onSave={handleSaveChanges} />

      <ShoppingListModal isOpen={isShoppingListModalOpen} onDismiss={() => setIsShoppingListModalOpen(false)} />
    </IonPage>
  );
};

export default MyProfile;
