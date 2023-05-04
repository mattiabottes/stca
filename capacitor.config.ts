import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'it.platform.platform',
  appName: 'Platform',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
