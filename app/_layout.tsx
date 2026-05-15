import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import {
  Sarabun_300Light,
  Sarabun_400Regular,
  Sarabun_500Medium,
  Sarabun_600SemiBold,
  Sarabun_700Bold,
} from "@expo-google-fonts/sarabun";

export default function RootLayout() {
  const [loaded] = useFonts({
    Sarabun_300Light,
    Sarabun_400Regular,
    Sarabun_500Medium,
    Sarabun_600SemiBold,
    Sarabun_700Bold,
  });

  if (!loaded) return null;

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});