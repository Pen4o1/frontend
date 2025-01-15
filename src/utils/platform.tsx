export const getPlatform = (): 'web' | 'ios' => {
  const userAgent = navigator.userAgent || navigator.vendor;

  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'ios';
  }
  return 'web';
};

export const getClientId = (): string => {
  const platform = getPlatform();
  switch (platform) {
    case 'ios':
      return import.meta.env.VITE_IOS_CLIENT_ID; 
    default:
      return import.meta.env.VITE_WEB_CLIENT_ID;
  }
};
