import React, { useState } from 'react';
import { IonButton, IonImg } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface PhotoUploadProps {
    onImageUpload: (imageUrl: string) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onImageUpload }) => {
    const [photo, setPhoto] = useState<string | null>(null);

    const takePhoto = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera, // Can use CameraSource.Photos to select from gallery
        });

        const imageUrl = image.webPath || null;
        setPhoto(imageUrl);

        if (imageUrl) {
            onImageUpload(imageUrl); // Pass image URL to parent component
        }
    };

    return (
        <div>
            {photo && <IonImg src={photo} />}
            <IonButton onClick={takePhoto}>Take Photo</IonButton>
        </div>
    );
};

export default PhotoUpload;
