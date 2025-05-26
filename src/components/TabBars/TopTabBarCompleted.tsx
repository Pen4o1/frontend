import React from 'react';
import { IonTabBar, IonTabButton, IonButton, IonIcon } from '@ionic/react';
import { settings } from 'ionicons/icons';

interface Props {
  onShowGoal: () => void;
  onShowMeal: () => void;
  onOpenSettings: () => void;
}

const TopTabBarCompleted: React.FC<Props> = ({ onShowGoal, onShowMeal, onOpenSettings }) => (
  <IonTabBar slot="top">
    <IonTabButton tab="Set Goal" onClick={onShowGoal}>
      <IonButton color="secondary" expand="full">Set Goal</IonButton>
    </IonTabButton>
    <IonTabButton tab="Set Meal Plan" onClick={onShowMeal}>
      <IonButton color="secondary" expand="full">Set Meal Plan</IonButton>
    </IonTabButton>
    <IonTabButton tab="Settings" onClick={onOpenSettings}>
      <IonButton fill="clear" className="icon-button">
        <IonIcon icon={settings} slot="start" color="secondary" />
      </IonButton>
    </IonTabButton>
  </IonTabBar>
);

export default TopTabBarCompleted;
