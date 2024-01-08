import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.gamlab.mensanfc',
  appName: 'Mensa',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
