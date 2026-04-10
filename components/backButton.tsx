import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function BackButton() {
  return (
    <Pressable
      onPress={() => router.back()}
      className="w-10 h-10 rounded-full bg-navy items-center justify-center"
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <Ionicons name="arrow-back" size={20} color="white" />
    </Pressable>
  );
}