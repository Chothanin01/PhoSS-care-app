import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MenuPath } from "@/types/navigation";
import { useEffect } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedDisease: string | null;
  setSelectedDisease: (val: string | null) => void;
  targetPath: MenuPath | null;
};

const diseases = [
  "โรคความดันโลหิตสูง",
  "โรคเบาหวาน",
  "วัคซีนเด็ก",
  "วัณโรค",
];

export default function DiseaseModal({
  visible,
  onClose,
  selectedDisease,
  setSelectedDisease,
  targetPath,
}: Props) {
  const handleConfirm = () => {
    if (!selectedDisease || !targetPath) return;

    onClose();

    router.push({
      pathname: targetPath,
      params: { disease: selectedDisease },
    });

    setSelectedDisease(null);
  };

  const handleClose = () => {
    setSelectedDisease(null);
    onClose();
  };

  useEffect(() => {
    if (!visible) {
      setSelectedDisease(null);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>

          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>

          <Text style={styles.title}>กรุณาเลือกโรคที่ต้องการ</Text>

          {diseases.map((item) => {
            const isActive = selectedDisease === item;

            return (
              <TouchableOpacity
                key={item}
                onPress={() =>
                  setSelectedDisease(selectedDisease === item ? null : item)
                }
                style={[
                  styles.option,
                  isActive ? styles.optionActive : styles.optionInactive,
                ]}
              >
                {/* radio */}
                <View
                  style={[
                    styles.radio,
                    isActive ? styles.radioActive : styles.radioInactive,
                  ]}
                >
                  {isActive && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </View>

                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            );
          })}

          {/* confirm */}
          <TouchableOpacity
            disabled={!selectedDisease}
            onPress={handleConfirm}
            style={[
              styles.confirmBtn,
              selectedDisease
                ? styles.confirmActive
                : styles.confirmInactive,
            ]}
          >
            <Text style={styles.confirmText}>ยืนยันการเลือก</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
  },

  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },

  title: {
    fontSize: 20,
    fontFamily: "IBMPlexSansThai_700Bold",
    marginBottom: 12,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },

  optionActive: {
    borderColor: "#05548D",
    backgroundColor: "#EFF6FF",
  },

  optionInactive: {
    borderColor: "#D1D5DB",
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
  },

  radioActive: {
    backgroundColor: "#58AD46",
    borderColor: "#58AD46",
  },

  radioInactive: {
    borderColor: "#05548D",
  },

  optionText: {
    fontSize: 16,
    fontFamily: "IBMPlexSansThai_500Medium",
  },

  confirmBtn: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  confirmActive: {
    backgroundColor: "#05548D",
  },

  confirmInactive: {
    backgroundColor: "#D1D5DB",
  },
  
  confirmText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "IBMPlexSansThai_600SemiBold",
  },
});