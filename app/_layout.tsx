import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <Stack />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});