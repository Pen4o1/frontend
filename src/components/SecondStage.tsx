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
import { arrowBackCircle } from 'ionicons/icons';
import './styles/register-style.css';
import PhotoUpload from './PhotoUpload';

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
  const [profileImage, setProfileImage] = useState<string | null>(
    formData.profileImage || null
  );

  const handleCompleteRegistration = async () => {
    const parsedHeight = parseFloat(formData.height);
    const parsedKilos = parseFloat(formData.kilos);
    const data = { ...formData, kilos: parsedKilos, height: parsedHeight };
    console.log(data);

    setLoading(true);

    try {
      const response = await fetch('https://grown-evidently-chimp.ngrok-free.app/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || 'Registration failed');
        return;
      }

      if (result.token) {
        localStorage.setItem('jwt_token', result.token);
        console.log('Token saved to local storage');
      }

      setMessage(result.message || 'Registration complete');
      window.location.href = '/home';
    } catch (error) {
      setMessage('Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (imageUrl: string) => {
    setProfileImage(imageUrl);
    updateFormData("profileImage", imageUrl); // Update form data with image URL
    console.log("Captured image URL:", imageUrl);
    await uploadImage(imageUrl);
  };

  const uploadImage = async (imageUrl: string) => {
    setLoading(true);

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const mimeType = blob.type;
      const fileExtension = mimeType.split("/")[1]; // Get correct file extension

      if (!fileExtension) {
        throw new Error("Could not determine file extension.");
      }

      const formData = new FormData();
      formData.append("profile_picture", blob, `profile_${Date.now()}.${fileExtension}`);

      const token = localStorage.getItem("jwt_token");
      if (!token) {
        alert("User not authenticated");
        return;
      }

      const uploadResponse = await fetch("https://grown-evidently-chimp.ngrok-free.app/api/upload-profile-picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await uploadResponse.json();
      if (uploadResponse.ok) {
        setProfileImage(data.profile_picture_url);
        updateFormData("profileImage", data.profile_picture_url); // Store the uploaded image
        console.log("Uploaded image URL:", data.profile_picture_url);
      } else {
        alert(data.error || "Image upload failed.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
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
      <IonContent className="register-content">
        <IonGrid className="ion-justify-content-center ion-align-items-center">
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="1" className="ion-align-self-center">
              <IonButton onClick={handleBack} fill="clear" disabled={loading}>
                <IonIcon icon={arrowBackCircle} slot="icon-only" color="black" />
              </IonButton>
            </IonCol>
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <div className="form-box">
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

                <div className="photo-upload-container">
                  <h3>Upload Profile Picture</h3>
                  <PhotoUpload onImageUpload={handleImageUpload} />
                  {profileImage && (
                    <img
                      src={profileImage}
                      alt="Profile Preview"
                      className="profile-image"
                      style={{ width: 100, height: 100, marginTop: 10, borderRadius: '50%' }}
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
