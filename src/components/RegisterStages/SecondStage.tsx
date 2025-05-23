import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonInput,
  IonButton,
  IonItem,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { camera } from 'ionicons/icons'; 
import '../styles/register-style.css';
import PhotoUpload from '../PhotoUpload';
import config from '../../config';

interface SecondStageProps {
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    birthdate: string;
    kilos: string;
    height: string;
    gender: string;
    profileImage?: string;
  };
  updateFormData: (field: string, value: string) => void;
  handleBack: () => void;
}

const SecondStage: React.FC<SecondStageProps> = ({
  formData,
  updateFormData,
  handleBack,
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>(formData.profileImage || null);

  const handleCompleteRegistration = async () => {
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      if (profileImage && profileImage.startsWith("blob:")) {
        const blob = await fetch(profileImage).then(res => res.blob());
        formDataToSend.append("profile_picture", blob, `profile_${Date.now()}.jpg`);
      }

      formDataToSend.append("first_name", formData.first_name);
      formDataToSend.append("last_name", formData.last_name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("birthdate", formData.birthdate);
      formDataToSend.append("kilos", formData.kilos);
      formDataToSend.append("height", formData.height);
      formDataToSend.append("gender", formData.gender);

      const response = await fetch(`${config.BASE_URL}/api/register`, {
        method: 'POST',
        body: formDataToSend, 
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Registration failed");
        return;
      }

      if (result.token) {
        localStorage.setItem("jwt_token", result.token);
      }

      setMessage(result.message || "Registration complete");
      window.location.href = "/home";
    } catch (error) {
      setMessage("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setProfileImage(imageUrl);
    updateFormData("profileImage", imageUrl); // Store the photo URL in form data
    console.log("Captured image URL:", imageUrl);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>MacroGenie</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="register-content">
        <IonGrid className="ion-justify-content-center ion-align-items-center">
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <div className="form-box">
                <IonCol size="1" className="ion-align-self-center">
                  <IonButton onClick={handleBack} fill="clear" disabled={loading}>
                    BACK
                  </IonButton>
                </IonCol>

                <IonItem>
                  <IonInput
                    type="date"
                    value={formData.birthdate}
                    onIonChange={(e) => updateFormData('birthdate', e.detail.value!)}
                    placeholder="Birthdate"
                    required
                    disabled={loading}
                  />
                </IonItem>

                <IonItem>
                  <IonInput
                    type="number"
                    value={formData.height}
                    onIonChange={(e) => updateFormData('height', e.detail.value!)}
                    placeholder="Height (cm)"
                    required
                    disabled={loading}
                  />
                </IonItem>

                <IonItem>
                  <IonInput
                    type="number"
                    value={formData.kilos}
                    onIonChange={(e) => updateFormData('kilos', e.detail.value!)}
                    placeholder="Weight (kg)"
                    required
                    disabled={loading}
                  />
                </IonItem>

                <IonItem>
                  <IonSelect
                    value={formData.gender}
                    placeholder="Select Gender"
                    onIonChange={(e) => updateFormData('gender', e.detail.value!)}
                    disabled={loading}
                  >
                    <IonSelectOption value="male">Male</IonSelectOption>
                    <IonSelectOption value="female">Female</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <div color="primary" className="photo-upload-container">
                <h3>Upload Profile Picture</h3>
                <PhotoUpload onImageUpload={handleImageUpload} /> 
                {profileImage && (
                  <img
                    src={profileImage}
                    alt="Profile Preview"
                    className="profile-image"
                  />
                )}
              </div>


                <IonButton expand="block" onClick={handleCompleteRegistration} disabled={loading}>
                  {loading ? 'Submitting...' : 'Complete Registration'}
                </IonButton>

                <IonLoading isOpen={loading} />

                {message && (
                  <IonText color="medium" className="error-message">
                    <div>{message}</div>
                  </IonText>
                )}
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SecondStage;
