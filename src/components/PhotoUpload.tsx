import React, { useState } from 'react';
import { IonButton, IonImg, IonIcon } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { camera } from 'ionicons/icons'; // Import camera icon

interface PhotoUploadProps {
    onImageUpload: (imageUrl: string) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onImageUpload }) => {
    const [photo, setPhoto] = useState<string | null>(null);

    const takePhoto = async () => {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Prompt, 
            });

            const imageUrl = image.webPath || null;
            setPhoto(imageUrl);

            if (imageUrl) {
                onImageUpload(imageUrl);
            }
        } catch (error) {
            console.error("Camera error:", error);
        }
    };

    return (
        <div className="photo-upload-container">
            {photo && <IonImg src={photo} className="profile-image" />}
            <IonButton fill="clear" onClick={takePhoto} className="camera-button">
                <IonIcon icon={camera} className="camera-icon" />
            </IonButton>
        </div>
    );
};

export default PhotoUpload;
