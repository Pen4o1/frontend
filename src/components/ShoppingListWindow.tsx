import React, { useState, useEffect } from 'react';
import {
  IonModal,
  IonButton,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonLoading,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonList,
  IonText
} from '@ionic/react';
import '../components/styles/shoppping-list-style.css'

interface ShoppingListModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  bought: boolean;
}

const ShoppingListModal: React.FC<ShoppingListModalProps> = ({ isOpen, onDismiss }) => {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchShoppingList();
    }
  }, [isOpen]);

  const fetchShoppingList = async () => {
    const token = localStorage.getItem('jwt_token');
    try {
      setIsLoading(true);
      const response = await fetch('https://grown-evidently-chimp.ngrok-free.app/api/get/shopping/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shopping list.');
      }

      const data = await response.json();
      setShoppingList(data.shopping_list);
    } catch (error) {
      console.error('Error fetching shopping list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBoughtStatus = async (itemId: number, currentStatus: boolean) => {
    const token = localStorage.getItem('jwt_token');
    const payload = { id: itemId, bought: !currentStatus };

    try {
      const response = await fetch(`https://grown-evidently-chimp.ngrok-free.app/api/update/shopping/item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update item status.');
      }

      setShoppingList(prevList =>
        prevList
          .map(item => (item.id === itemId ? { ...item, bought: !currentStatus } : item))
          .sort((a, b) => Number(a.bought) - Number(b.bought))
      );
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const clearBoughtItems = async () => {
    const token = localStorage.getItem('jwt_token');
    try {
      const response = await fetch('https://grown-evidently-chimp.ngrok-free.app/api/clear/bought/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to clear bought items.');
      }

      setShoppingList(prevList => prevList.filter(item => !item.bought));
    } catch (error) {
      console.error('Error clearing bought items:', error);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Shopping List</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {isLoading ? (
          <IonLoading isOpen={true} />
        ) : shoppingList.length === 0 ? (
          <IonText color="medium">
            <p>No items in your shopping list.</p>
          </IonText>
        ) : (
          <IonList>
            {shoppingList.map((item) => (
              <IonItem key={item.id}>
                <IonCheckbox
                  slot="start"
                  checked={item.bought}
                  onIonChange={() => toggleBoughtStatus(item.id, item.bought)}
                />
                <IonLabel
                  style={{
                    textDecoration: item.bought ? 'line-through' : 'none',
                    color: item.bought ? 'gray' : undefined,
                  }}
                >
                  {item.quantity === 0
                    ? item.name
                    : `${item.name} (${item.quantity} ${item.unit})`}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <div className="ion-padding" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <IonButton
              expand="block"
              color="danger"
              onClick={clearBoughtItems}
              disabled={shoppingList.filter(item => item.bought).length === 0}
            >
              Clear Bought Items
            </IonButton>
            <IonButton expand="block" onClick={onDismiss}>
              Close
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default ShoppingListModal;
