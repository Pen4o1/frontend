import React, { useState } from "react";
import PhotoUpload from "../../components/PhotoUpload";

const ImageUp: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (imageUrl: string) => {
    setProfileImage(imageUrl);
    console.log("Uploaded image URL:", imageUrl);
  };

  return (
    <div>
      <h1>Profile</h1>
      <PhotoUpload onImageUpload={handleImageUpload} />
      {profileImage && <img src={profileImage} alt="Profile" style={{ width: 100, height: 100 }} />}
    </div>
  );
};

export default ImageUp;
