import { useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

const BarcodeScannerInstaller: React.FC = () => {
  useEffect(() => {
    BarcodeScanner.installGoogleBarcodeScannerModule()
      .then(() => {
        console.log('✅ Barcode Scanner Module installed');
      })
      .catch((err) => {
        console.error('❌ Failed to install barcode scanner module', err);
      });
  }, []);

  return null; // doesn't render anything
};

export default BarcodeScannerInstaller;
