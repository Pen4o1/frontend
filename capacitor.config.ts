import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.macro.genie",
	appName: "Macro Genie",
	webDir: "www",
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email', 'https://www.googleapis.com/auth/user.birthday.read', 'https://www.googleapis.com/auth/user.gender.read'],
      serverClientId: '918043959140-c0c6cur70js4ubt6hsb4seik2l90jf26.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  }
};

export default config;
