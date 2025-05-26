import React, { useState } from "react";
import PhotoUpload from "../../components/PhotoUpload";
import config from "../../utils/config";

const ImageUp: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleImageUpload = async (imageUrl: string) => {
    setProfileImage(imageUrl);
    console.log("Captured image URL:", imageUrl);
    await uploadImage(imageUrl);
  };

  const uploadImage = async (imageUrl: string) => {
    setUploading(true);
    
    try {
      const blob = await fetch(imageUrl).then(res => res.blob());
      const formData = new FormData();
      formData.append("profile_picture", blob, `profile_${Date.now()}.jpg`);

      const token = localStorage.getItem("jwt_token");
      if (!token) {
        alert("User not authenticated. Please log in.");
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/upload-profile-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setProfileImage(data.profile_picture_url);
        console.log("Uploaded image URL:", data.profile_picture_url);
      } else {
        alert(data.error || "Image upload failed.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Profile</h1>
      <PhotoUpload onImageUpload={handleImageUpload} />
      {uploading && <p>Uploading...</p>}
      {profileImage && (
        <img src={profileImage} alt="Profile" style={{ width: 100, height: 100, borderRadius: "50%" }} />
      )}
    </div>
  );
};

export default ImageUp;
