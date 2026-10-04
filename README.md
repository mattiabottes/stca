# Sveltekit + Taiwind CSS + Capacitor App

### Clone Project

`git clone "https://github.com/mattiabottes/stca.git" your-app-name`\
`cd your-app-name`\
`npm install && npm run build`

### Install Capacitor

`npm install @capacitor/core @capacitor/cli`\
`npx cap init --web-dir=build`\
`npm install @capacitor/android`\
`npx cap add android`\
`npx cap open android`

### Live Reload

`npx cap run android -l --host localhost --port 5173 --forwardPorts 5173:5173`
