import { api } from "@/services/api";
import { MenuPath } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedDisease: string | null;
  setSelectedDisease: (val: string | null) => void;
  targetPath: MenuPath | null;
  mode: "appoint" | "history"; 
};

type DiseaseItem = {
  disease_id: string;
  name: string;
};

export default function DiseaseModal({
  visible,
  onClose,
  selectedDisease,
  setSelectedDisease,
  targetPath,
  mode, 
}: Props) {
  const [diseases, setDiseases] = useState<DiseaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchDiseases = async () => {
    try {
      setLoading(true);
      setChecked(false);

      const url =
        mode === "appoint"
          ? "/v1/patient/diseases"
          : "/v1/patient/diseases";

      const res = await api.get(url, {
        params:
          mode === "appoint"
            ? { type: "appoint" }
            : {},
      });

      const list = res.data?.data || [];

      if (mode === "appoint" && list.length === 0) {
        onClose();
        setShowSuccessModal(true);
        return;
      }

      setDiseases(list);
    } catch (err) {
      console.log("fetch diseases error:", err);
    } finally {
      setLoading(false);
      setChecked(true);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchDiseases();
    }
  }, [visible, mode]); 

  const handleConfirm = () => {
    if (!selectedDisease || !targetPath) return;

    const selected = diseases.find(
      (d) => d.disease_id === selectedDisease
    );

    onClose();

    router.push({
      pathname: targetPath,
      params: {
        disease_id: selectedDisease,
        disease_name: selected?.name,
      },
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

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  return (
    <>
      <Modal
        visible={visible && checked && diseases.length > 0}
        transparent
        animationType="fade"
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>

            <Text style={styles.title}>
              {mode === "appoint"
                ? "เลือกโรคเพื่อเลื่อนนัด"
                : "เลือกโรคเพื่อดูประวัติ"}
            </Text>

            {diseases.map((item) => {
              const isActive = selectedDisease === item.disease_id;

              return (
                <TouchableOpacity
                  key={item.disease_id}
                  onPress={() =>
                    setSelectedDisease(
                      isActive ? null : item.disease_id
                    )
                  }
                  style={[
                    styles.option,
                    isActive
                      ? styles.optionActive
                      : styles.optionInactive,
                  ]}
                >
                  <View
                    style={[
                      styles.radio,
                      isActive
                        ? styles.radioActive
                        : styles.radioInactive,
                    ]}
                  >
                    {isActive && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color="#FFFFFF"
                      />
                    )}
                  </View>

                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}

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

      <Modal transparent visible={showSuccessModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.iconOuter}>
              <View style={styles.iconInner}>
                <Ionicons name="close" size={32} color="white" />
              </View>
            </View>

            <Text style={styles.modalTitle}>
              ไม่มีโรคที่สามารถเลื่อนนัดได้
            </Text>
            <Text style={styles.modalDesc}>
              ใบนัดอยู่ในขั้นตอนพิจารณาจากทางเจ้าหน้าที่
            </Text>
          </View>
        </View>
      </Modal>
    </>
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
    fontFamily: "Sarabun_700Bold",
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
    fontFamily: "Sarabun_500Medium",
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
    fontFamily: "Sarabun_600SemiBold",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Sarabun_500Medium",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },

  iconOuter: {
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },


  iconInner: {
    width: 70,
    height: 70,
    borderRadius: 999,
    backgroundColor: "#FB4C4C",
    justifyContent: "center",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Sarabun_600Semibold",
  },

  modalDesc: {
    marginTop: 8,
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    fontFamily: "Sarabun_500Medium",
  },
});