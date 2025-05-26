import React from 'react';
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { add, home, person } from 'ionicons/icons';
import { useLocation } from 'react-router-dom';

const BottomTabBar: React.FC = () => {
  const location = useLocation();

  return (
    <IonTabBar slot="bottom">
      <IonTabButton tab="add-food" href="/add-food" selected={location.pathname === '/add-food'}>
        <IonIcon icon={add} color="primary" />
        <IonLabel>Add Food</IonLabel>
      </IonTabButton>
      <IonTabButton tab="home" href="/home" selected={location.pathname === '/home'}>
        <IonIcon icon={home} color="primary" />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab="my-profile" href="/my-profile" selected={location.pathname === '/my-profile'}>
        <IonIcon icon={person} color="primary" />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default BottomTabBar;
