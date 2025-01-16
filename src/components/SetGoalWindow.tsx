import React, { useState } from 'react'
import {
  IonModal,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonFooter,
} from '@ionic/react'
import { useHistory } from 'react-router-dom';

const SetGoalModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [activityLevel, setActivityLevel] = useState('')
  const [goal, setGoal] = useState('')
  const history = useHistory();
  const handleSave = async () => {
    const token = localStorage.getItem('jwt_token');
      if (!token) {
        history.push('/login');
        return;
      }
    const payload = { goal, activityLevel }
    try {
      const response = await fetch('https://grown-evidently-chimp.ngrok-free.app/api/save/goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (response.ok) {
        alert(`Goal saved! Your daily calories: ${data.calories}`)
        onClose()
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      console.error('Failed to save goal', error)
    }
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Set Your Goal</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="stacked">Activity Level</IonLabel>
          <IonSelect
            value={activityLevel}
            onIonChange={(e) => setActivityLevel(e.detail.value)}
          >
            <IonSelectOption value="sedentary">Sedentary</IonSelectOption>
            <IonSelectOption value="lightly_active">
              Lightly Active
            </IonSelectOption>
            <IonSelectOption value="moderately_active">
              Moderately Active
            </IonSelectOption>
            <IonSelectOption value="very_active">Very Active</IonSelectOption>
            <IonSelectOption value="extra_active">Extra Active</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Goal</IonLabel>
          <IonSelect value={goal} onIonChange={(e) => setGoal(e.detail.value)}>
            <IonSelectOption value="lose">Lose Weight</IonSelectOption>
            <IonSelectOption value="maintain">Maintain Weight</IonSelectOption>
            <IonSelectOption value="gain">Gain Weight</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton expand="full" onClick={handleSave}>
            Save Goal
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  )
}

export default SetGoalModal
