import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { MenuPath } from "@/types/navigation";

type MenuItem = {
  label: string;
  icon: any;
  path: MenuPath;
};

type Props = {
  items: readonly MenuItem[];
  onPressItem: (path: MenuPath) => void;
};

export default function GridMenu({ items, onPressItem }: Props) {
  return (
    <View style={styles.grid}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.box}
          onPress={() => onPressItem(item.path)}
        >
          <Ionicons name={item.icon} size={28} color="#05548D" />
          <Text style={styles.boxText}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  box: {
    width: "30%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
  },
  boxText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
    fontFamily: "IBMPlexSansThai_600SemiBold",
  },
});