import React, { useState } from 'react';
import { IonButton } from '@ionic/react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import config from '../utils/config';

interface BarcodeScannerComponentProps {
  setBarcode: (barcode: string) => void;
  setFoodDetails: (foodDetails: any) => void;
  setShowBarcodeModal: (show: boolean) => void;
}

const BarcodeScannerComponent: React.FC<BarcodeScannerComponentProps> = ({
  setBarcode,
  setFoodDetails,
  setShowBarcodeModal,
}) => {
  const [loading, setLoading] = useState(false);

  const scanBarcode = async () => {
    setLoading(true);
    try {
      const result = await BarcodeScanner.scan();

      if (!result.barcodes || result.barcodes.length === 0) {
        console.warn('No barcode detected');
        return;
      }

      const scannedValue = result.barcodes[0].rawValue;
      if (!scannedValue) {
        console.warn('No rawValue found in barcode');
        return;
      }

      setBarcode(scannedValue);
      console.log('Scanned Barcode:', scannedValue);

      const response = await fetch(`${config.BASE_URL}/api/foods/barcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcode: scannedValue }),
      });

      if (response.ok) {
        const item = await response.json();
        console.log('Fetched item from barcode:', item);
        setFoodDetails(item.food.food);
        setShowBarcodeModal(true);
      } else {
        console.error('Failed to fetch food details');
      }
    } catch (error) {
      console.error('Barcode scanning error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonButton expand="block" color="primary" onClick={scanBarcode} disabled={loading}>
      {loading ? 'Scanning...' : 'Scan Barcode'}
    </IonButton>
  );
};

export default BarcodeScannerComponent;
