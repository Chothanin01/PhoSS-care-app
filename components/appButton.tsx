import { Pressable, Text } from "react-native";

type ButtonType = "primary" | "secondary" | "danger";

type Props = {
  title: string;
  onPress: () => void;
  type?: ButtonType;
};

export default function AppButton({
  title,
  onPress,
  type = "primary",
}: Props) {
  const getStyle = () => {
    switch (type) {
      case "primary":
        return "bg-navy";
      case "secondary":
        return "bg-white border border-navy";
      case "danger":
        return "bg-red-500";
      default:
        return "bg-[#1E5F8A]";
    }
  };

  const getTextColor = () => {
    return type === "secondary" ? "text-navy" : "text-white";
  };

  return (
    <Pressable
      onPress={onPress}
      className={`w-full py-4 rounded-xl items-center ${getStyle()}`}
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
    >
      <Text className={`font-bold text-lg ${getTextColor()}`}>
        {title}
      </Text>
    </Pressable>
  );
}