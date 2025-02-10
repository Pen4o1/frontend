import React, { useState } from 'react';
import { IonButton } from '@ionic/react';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

interface BarcodeScannerComponentProps {
  setBarcode: (barcode: string) => void;
  setFoodDetails: (foodDetails: any) => void;
  setShowBarcodeModal: (show: boolean) => void;
}

const BarcodeScannerComponent: React.FC<BarcodeScannerComponentProps> = ({ setBarcode, setFoodDetails, setShowBarcodeModal }) => {
  const [loading, setLoading] = useState(false);

  const scanBarcode = async () => {
    try {
      const data = await BarcodeScanner.scan();
      if (data.cancelled) {
        console.log('Barcode scan was cancelled');
      } else {
        setBarcode(data.text);
        console.log('Scanned Barcode:', data.text);

        const payload = { barcode: data.text };

        const response = await fetch(
          `https://grown-evidently-chimp.ngrok-free.app/api/foods/barcode`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          const item = await response.json();
          console.log('Fetched item from barcode:', item);
          setFoodDetails(item.food.food);
          setShowBarcodeModal(true);
        }
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
    }
  };

  return (
    <IonButton expand="block" color="primary" onClick={scanBarcode} disabled={loading}>
      {loading ? 'Scanning...' : 'Scan Barcode'}
    </IonButton>
  );
};

export default BarcodeScannerComponent;
