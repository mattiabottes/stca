import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.gamlab.ospiti',
  appName: 'Ospiti',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
