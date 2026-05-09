import { MenuPath } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type MenuItem = {
  label: string;
  icon: any;
  path: MenuPath;
};

type Props = {
  items: readonly MenuItem[];
  onPressItem: (path: MenuPath) => void;
  notificationCount?: number;
};

export default function GridMenu({ items, onPressItem, notificationCount = 0 }: Props) {
  const openPDF = () => {
    const url =
      "https://drive.google.com/file/d/1Ugdtu-fcUPo6KCI6kgtMLE_CqJczL03-/preview";
    Linking.openURL(url);
  };

  return (
    <View style={styles.grid}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.box}
          onPress={() => {
            if (item.path === "/(tab)/guide") {
              openPDF(); 
            } else {
              onPressItem(item.path); 
            }
          }}
        >
          <View>
            <Ionicons name={item.icon} size={28} color="#05548D" />
            {item.path === "/(tab)/notification" && notificationCount > 0 && (
              <View style={styles.redDot} />
            )}
          </View>
          <Text style={styles.boxText}>{item.label}</Text>
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
    fontFamily: "Sarabun_600SemiBold",
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    position: "absolute",
    top: -2,
    right: 2,
  },
});