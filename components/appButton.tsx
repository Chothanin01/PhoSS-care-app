import { Pressable, StyleSheet, Text, View } from "react-native";

type ButtonType = "primary" | "secondary" | "danger";

type Props = {
  title: string;
  onPress: () => void;
  type?: ButtonType;
};

export default function AppButton({ title, onPress, type = "primary" }: Props) {
  
  const buttonStyle = type === "primary" ? styles.primary
    : type === "secondary" ? styles.secondary
    : styles.danger;

  const textStyle = type === "primary" ? styles.primaryText
    : type === "secondary" ? styles.secondaryText
    : styles.dangerText;

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={[styles.button, buttonStyle, pressed && styles.pressed]}>
          <Text style={[styles.text, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  primary: {
    backgroundColor: "#05548D",
  },
  
  secondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#05548D",
  },

  danger: {
    backgroundColor: "#FB4C4C",
  },

  text: {
    fontSize: 18,
    fontFamily: "Sarabun_700Bold",
  },

  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#05548D",
  },
  dangerText: {
    color: "#FFFFFF",
  },

  pressed: {
    opacity: 0.8,
  },
});