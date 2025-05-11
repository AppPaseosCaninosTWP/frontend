# Frontend - React Native

## Instalación

```bash
npm install --force
```

## Iniciar proyecto en Expo

```bash
npx expo start
```

## Variables de entorno

Crear archivo `.env` con el siguiente contenido:

```env
API_URL=http://localhost:7070/api
```

## Dependencias necesarias

```bash
npm install --force /para instalar todo
npm install axios react-navigation react-navigation/native react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context react-native-vector-icons
npm install @react-navigation/bottom-tabs
npm install @react-navigation/native-stack
npm install react-native-dotenv
npm install nativewind tailwindcss
npm install formik yup
npm install react-native-maps
npm install @react-native-async-storage/async-storage
```


## Estructura del frontend

- `screens/` → Pantallas principales
- `components/` → Componentes reutilizables
- `services/` → Lógica de conexión con backend
- `navigation/` → Rutas y navegación
- `assets/` → Imágenes y recursos
- `utils/` → Funciones auxiliares
- `context/` → Contextos globales (auth, user, etc.)


## Buenas prácticas

- Commits con convención: `feat:`, `fix:`, `chore:`, etc.
- Variables y rutas en snake_case
- Componentes desacoplados
- Manejo de estado con Context API
- Validaciones con Yup y manejo de formularios con Formik
