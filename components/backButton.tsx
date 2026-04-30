import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type Props = {
  targetPath?: string;
};

export default function BackButton({ targetPath }: Props) {
  const handleBack = () => {
    if (targetPath) {
      router.push(targetPath as never);
    } else {
      router.back();
    }
  };

  return (
    <Pressable onPress={handleBack}>
      {({ pressed }) => (
        <View style={[styles.button, pressed && styles.pressed]}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#05548D",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    overflow: "hidden",
  },

  pressed: {
    opacity: 0.7,
  },
});