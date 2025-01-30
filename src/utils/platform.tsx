export const getPlatform = (): 'web' | 'ios'| 'android'=> {
  const userAgent = navigator.userAgent || navigator.vendor;

  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'ios';
  }
  if (/Android/.test(userAgent)) {
    return 'android';
  }
  return 'web';
};
