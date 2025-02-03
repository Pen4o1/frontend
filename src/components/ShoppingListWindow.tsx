import React, { useState, useEffect } from 'react';
import { 
  IonModal, 
  IonButton, 
  IonItem, 
  IonLabel, 
  IonCheckbox, 
  IonLoading 
} from '@ionic/react';

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
      console.log('Fetched Shopping List:', data); // Debugging log

      // Directly use the `id` from the backend response
      setShoppingList(data.shopping_list);
    } catch (error) {
      console.error('Error fetching shopping list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBoughtStatus = async (itemId: number, currentStatus: boolean) => {
    const token = localStorage.getItem('jwt_token');
    
    if (itemId === undefined) {
      console.error('Error: itemId is undefined');
      return;
    }

    const payload = { id: itemId, bought: !currentStatus };
    console.log('Updating item:', payload); // Debugging log

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

      // Update UI immediately
      setShoppingList((prevList) => {
        const updatedList = prevList.map(item => 
          item.id === itemId ? { ...item, bought: !currentStatus } : item
        );
        return updatedList.sort((a, b) => Number(a.bought) - Number(b.bought));
      });
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <div className="shopping-list-modal">
        <h2>Your Shopping List</h2>

        <IonLoading isOpen={isLoading} />

        {!isLoading && shoppingList.length > 0 && (
          <div className="shopping-list-content">
            {shoppingList.map((item) => (
              <IonItem key={item.id}>
                <IonCheckbox 
                  slot="start" 
                  checked={item.bought} 
                  onIonChange={() => toggleBoughtStatus(item.id, item.bought)}
                />
                <IonLabel style={{ textDecoration: item.bought ? 'line-through' : 'none' }}>
                  {item.quantity === 0 ? (
                    item.name
                  ) : (
                    `${item.name} (${item.quantity} ${item.unit})`
                  )}
                </IonLabel>
              </IonItem>
            ))}
          </div>
        )}

        <IonButton expand="full" color="primary" onClick={onDismiss}>
          Close
        </IonButton>
      </div>
    </IonModal>
  );
};

export default ShoppingListModal;
