import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonInput,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
  IonModal,
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../../components/styles/add-food-style.css';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

const AddFood: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [fetchedItems, setFetchedItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [foodDetails, setFoodDetails] = useState<any | null>(null);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  // Fetch items for the search query
  const fetchItems = async () => {
    if (!inputValue.trim()) {
      setErrorMessage('Please enter a valid input.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `https://grown-evidently-chimp.ngrok-free.app/api/foods/search?query=${encodeURIComponent(inputValue)}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch items.');
      }

      const data = await response.json();
      const foods = data.foods_search?.results?.food || [];
      if (foods.length === 0) {
        setErrorMessage('No items found for your query.');
      } else {
        const formattedItems = foods.map((food: any) => ({
          id: food.food_id,
          name: food.food_name,
          calories: parseInt(food.servings?.serving[0]?.calories, 10) || 0,
          carbohydrate: parseFloat(food.servings?.serving[0]?.carbohydrate) || 0,
          protein: parseFloat(food.servings?.serving[0]?.protein) || 0,
          fat: parseFloat(food.servings?.serving[0]?.fat) || 0,
          servingDescription: food.servings?.serving[0]?.serving_description || 'Unknown',
          servingMultiplier: 1,
        }));
        setFetchedItems(formattedItems);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setErrorMessage('Error fetching items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleServingChange = (itemId: string, multiplier: number) => {
    setFetchedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, servingMultiplier: multiplier } : item
      )
    );

    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, servingMultiplier: multiplier } : item
      )
    );
  };

  const toggleSelection = (item: any) => {
    const isSelected = selectedItems.some((selected) => selected.id === item.id);
    if (isSelected) {
      setSelectedItems((prev) =>
        prev.filter((selected) => selected.id !== item.id)
      );
    } else {
      const currentItem = fetchedItems.find((fetched) => fetched.id === item.id);
      setSelectedItems((prev) => [...prev, { ...currentItem }]);
    }
  };

  const saveFoodToDailyCalories = async (payload: any) => {
    try {
      const token = localStorage.getItem('jwt_token');

      const response = await fetch(
        'https://grown-evidently-chimp.ngrok-free.app/api/save/daily/macros',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save food.');
      }

      console.log('Food saved successfully.');
      setSelectedItems([]);
      setShowModal(false);
      setFoodDetails(null);
    } catch (error) {
      console.error('Error saving food:', error);
      setErrorMessage('Error saving food. Please try again.');
    }
  };

  const handleSaveSelectedItems = () => {
    if (selectedItems.length === 0) {
      setErrorMessage('No items selected.');
      return;
    }

    const payload = selectedItems.map((item) => ({
      carbohydrate: item.carbohydrate * item.servingMultiplier,
      protein: item.protein * item.servingMultiplier,
      fat: item.fat * item.servingMultiplier,
      consumed_cal: item.calories * item.servingMultiplier,
    }));

    saveFoodToDailyCalories(payload);
  };

  const handleSaveBarcodeFood = () => {
    if (!foodDetails) return;

    const payload = [
      {
        food_id: foodDetails.food_id,
        consumed_cal: parseFloat(foodDetails.servings.serving[0].calories),
        carbohydrate: parseFloat(foodDetails.servings.serving[0].carbohydrate),
        protein: parseFloat(foodDetails.servings.serving[0].protein),
        fat: parseFloat(foodDetails.servings.serving[0].fat),
      },
    ];

    saveFoodToDailyCalories(payload);
  };

  const scanBarcode = async () => {
    try {
      const data = await BarcodeScanner.scan();
      if (data.cancelled) {
        console.log('Barcode scan was cancelled');
      } else {
        setBarcode(data.text);
        console.log('Scanned Barcode:', data.text);

        const response = await fetch(
          `https://grown-evidently-chimp.ngrok-free.app/api/foods/barcode?query=${data.text}`,
          {
            method: 'POST',
          }
        );

        if (response.ok) {
          const item = await response.json();
          console.log('Fetched item from barcode:', item);
          setFoodDetails(item.food);
          setShowBarcodeModal(true);
        }
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
    }
  };

  return (
    <IonPage>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <Swiper spaceBetween={50} slidesPerView={1} loop={true} pagination={{ clickable: true }}>
                <SwiperSlide>
                  <IonItem>
                    <IonInput
                      placeholder="Enter a food or recipe"
                      value={inputValue}
                      onIonChange={(e) => setInputValue(e.detail.value!)}
                    />
                  </IonItem>
                  <IonButton expand="block" color="primary" onClick={fetchItems} disabled={loading}>
                    {loading ? 'Fetching...' : 'Find Items'}
                  </IonButton>
                </SwiperSlide>

                <SwiperSlide>
                  <IonButton expand="block" color="primary" onClick={scanBarcode}>
                    Scan Barcode
                  </IonButton>
                  {barcode && <IonText>Scanned Barcode: {barcode}</IonText>}
                </SwiperSlide>
              </Swiper>
            </IonCol>
          </IonRow>
        </IonGrid>

        {errorMessage && (
          <IonText color="danger">
            <p>{errorMessage}</p>
          </IonText>
        )}

        {/* Manual Selection Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Select Items</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonGrid>
              {fetchedItems.map((item) => (
                <IonRow key={item.id}>
                  <IonCol>
                    <IonItem>
                      <IonLabel>
                        <h2>{item.name}</h2>
                        <p>
                          <strong>Calories:</strong> {item.calories}
                        </p>
                        <p>
                          <strong>Serving:</strong> {item.servingDescription}
                        </p>
                      </IonLabel>
                      <IonSelect
                        placeholder="Servings"
                        onIonChange={(e) =>
                          handleServingChange(item.id, e.detail.value)
                        }
                      >
                        <IonSelectOption value={0.25}>1/4</IonSelectOption>
                        <IonSelectOption value={0.5}>1/2</IonSelectOption>
                        <IonSelectOption value={1}>1</IonSelectOption>
                        <IonSelectOption value={2}>2</IonSelectOption>
                        <IonSelectOption value={3}>3</IonSelectOption>
                      </IonSelect>
                      <IonCheckbox
                        slot="start"
                        checked={selectedItems.some(
                          (selected) => selected.id === item.id
                        )}
                        onIonChange={() => toggleSelection(item)}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
              ))}
            </IonGrid>

            <IonButton expand="block" color="success" onClick={handleSaveSelectedItems}>
              Save Selected Items
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Barcode Modal */}
        <IonModal isOpen={showBarcodeModal} onDidDismiss={() => setShowBarcodeModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Food Details</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {foodDetails && (
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <h2>{foodDetails.food_name}</h2>
                    <p><strong>Brand:</strong> {foodDetails.brand_name}</p>
                    <p><strong>Calories:</strong> {foodDetails.servings.serving[0].calories}</p>
                    <p><strong>Carbs:</strong> {foodDetails.servings.serving[0].carbohydrate}</p>
                    <p><strong>Protein:</strong> {foodDetails.servings.serving[0].protein}</p>
                    <p><strong>Fat:</strong> {foodDetails.servings.serving[0].fat}</p>
                  </IonCol>
                </IonRow>
              </IonGrid>
            )}
            <IonButton expand="block" color="success" onClick={handleSaveBarcodeFood}>
              Save Food
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default AddFood;
