import "../global.css";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useFonts } from "expo-font";
import {
  IBMPlexSansThai_300Light,
  IBMPlexSansThai_400Regular,
  IBMPlexSansThai_500Medium,
  IBMPlexSansThai_600SemiBold,
  IBMPlexSansThai_700Bold,
} from "@expo-google-fonts/ibm-plex-sans-thai";

export default function RootLayout() {
  const [loaded] = useFonts({
    IBMPlexSansThai_300Light,
    IBMPlexSansThai_400Regular,
    IBMPlexSansThai_500Medium,
    IBMPlexSansThai_600SemiBold,
    IBMPlexSansThai_700Bold,
  });

  if (!loaded) return null;

  return (
    <View className="flex-1 font-regular">
      <Stack />
    </View>
  );
}