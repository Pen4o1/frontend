import React from 'react';
import { IonTabBar, IonTabButton, IonButton } from '@ionic/react';

const TopTabBarIncomplete: React.FC = () => (
  <IonTabBar slot="top">
    <IonTabButton tab="Complete registration" href="/complete-registaration">
      <IonButton color="primary" expand="full">Complete registration</IonButton>
    </IonTabButton>
  </IonTabBar>
);

export default TopTabBarIncomplete;
