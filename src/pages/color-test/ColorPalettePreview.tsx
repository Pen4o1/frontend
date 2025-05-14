import React from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/react';

const ColorPalettePreview: React.FC = () => {
  const colors = ['primary', 'secondary', 'tertiary', 'light', 'medium', 'dark', 'success', 'warning', 'danger'];

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Color Palette Preview</h2>
        {colors.map((color) => (
          <IonCard key={color}>
            <IonCardHeader>
              <IonCardTitle>{color.toUpperCase()}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonButton expand="block" color={color}>
                {color} Button
              </IonButton>
              <div style={{
                height: '40px',
                backgroundColor: `var(--ion-color-${color})`,
                borderRadius: '4px',
                marginTop: '10px',
              }} />
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default ColorPalettePreview;
