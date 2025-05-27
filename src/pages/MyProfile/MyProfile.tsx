import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonAvatar,
  IonButton,
  IonIcon,
  IonToggle,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonImg,
} from '@ionic/react';
import { pencil, logOut, list, menuOutline, addCircle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import EditProfileModal from '../../components/EditProfileWindow';
import ShoppingListModal from '../../components/ShoppingListWindow';
import MealPlanWindow from '../../components/GetMealPlan';
import PhotoUpload from '../../components/PhotoUpload';
import '../../components/styles/profile-style.css';
import config from '../../utils/config';

const MyProfile: React.FC = () => {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShoppingListModalOpen, setIsShoppingListModalOpen] = useState(false);
  const [isMealPlanModalOpen, setIsMealPlanModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const history = useHistory();

  const logout = () => {
    localStorage.removeItem('jwt_token');
    window.location.href = '/login';
  };

  // Fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          history.push('/login');
          return;
        }
        const response = await fetch(`${config.BASE_URL}/api/user/profile`, {
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
          avatar: result.profile_picture || 'https://ionicframework.com/docs/img/demos/avatar.svg',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleImageUpload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
  
      const file = new File([blob], 'profile_picture.jpg', { type: 'image/jpeg' });
  
      const formData = new FormData();
      formData.append('profile_picture', file);
  
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        console.error('No token found');
        return;
      }
  
      const uploadResponse = await fetch(`${config.BASE_URL}/api/upload-profile-picture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const result = await uploadResponse.json();
  
      if (uploadResponse.ok) {
        console.log('Upload success:', result);
        console.log("Updated avatar URL:", result.profile_picture_url);
        setUserData({ ...userData, avatar: result.profile_picture_url });
        setIsUploadModalOpen(false);
      } else {
        throw new Error(`Error: ${result.message || 'Upload failed'}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  

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
            <div className="avatar-container">
              <IonAvatar className="profile-avatar">
                <IonImg  alt="User's avatar" src={userData.avatar} />
              </IonAvatar>
              <div className="upload-icon" onClick={handleUploadClick}>
                <IonIcon icon={addCircle} color="primary"/>
              </div>
            </div>
            <h2>{userData.first_name}</h2>
            <p>{userData.last_name}</p>
          </div>

          <div className="profile-buttons">
            <IonButton expand="block" color="primary" className="profile-button" onClick={() => setIsModalOpen(true)}>
              <IonIcon icon={pencil} slot="start" color="dark"/>
              Edit Profile
            </IonButton>

            <IonButton expand="block" color="success" className="profile-button" onClick={() => setIsMealPlanModalOpen(true)}>
              <IonIcon icon={menuOutline} slot="start" color="dark"/>
              View Meal Plan
            </IonButton>

            <IonButton expand="block" color="tertiary" className="profile-button" onClick={() => setIsShoppingListModalOpen(true)}>
              <IonIcon icon={list} slot="start" color="dark"/>
              Shopping List
            </IonButton>

            <IonButton expand="block" color="danger" className="profile-button" onClick={logout}>
              <IonIcon icon={logOut} slot="start" color="dark"/>
              Logout
            </IonButton>
          </div>
        </div>
      </IonContent>

      <IonModal isOpen={isUploadModalOpen} onDidDismiss={() => setIsUploadModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Upload Profile Picture</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="upload-modal-content">
            <PhotoUpload onImageUpload={handleImageUpload} />
            <IonButton expand="block" color="medium" onClick={() => setIsUploadModalOpen(false)}>
              Back
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      <EditProfileModal isOpen={isModalOpen} onDismiss={() => setIsModalOpen(false)} userData={userData} onSave={handleSaveChanges} />
      <ShoppingListModal isOpen={isShoppingListModalOpen} onDismiss={() => setIsShoppingListModalOpen(false)} />
      <MealPlanWindow isOpen={isMealPlanModalOpen} onDismiss={() => setIsMealPlanModalOpen(false)} />
    </IonPage>
  );
};

export default MyProfile;
