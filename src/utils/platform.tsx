import { Capacitor } from '@capacitor/core';

export const getPlatform = (): 'web' | 'ios' | 'android' => {
  if (Capacitor.getPlatform() === 'android') return 'android';
  if (Capacitor.getPlatform() === 'ios') return 'ios';
  return 'web';
};