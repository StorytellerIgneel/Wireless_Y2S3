import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export function useCustomFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      Arial: require('../assets/fonts/Arimo-VariableFont_wght.ttf'),
      SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
      Courier: require('../assets/fonts/CourierPrime-Regular.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  return fontsLoaded;
}
