import React, { useState, useEffect } from 'react';
import { 
  IonModal, 
  IonButton, 
  IonItem, 
  IonLabel, 
  IonLoading 
} from '@ionic/react';

interface ShoppingListModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

const ShoppingListModal: React.FC<ShoppingListModalProps> = ({ isOpen, onDismiss }) => {
  const [shoppingList, setShoppingList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  

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

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss} backdropDismiss={false}>
      <div className="shopping-list-modal">
        <h2>Your Shopping List</h2>

        <IonLoading isOpen={isLoading}/>

        {!isLoading && shoppingList.length > 0 && (
          <div className="shopping-list-content">
            {shoppingList.map((item, index) => (
              <IonItem key={index}>
                <IonLabel>
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
