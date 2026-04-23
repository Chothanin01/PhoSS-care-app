import BackButton from "@/components/backButton";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const documentsList = [
  "ข้อมูลผู้ป่วย",
  "ประวัติการรักษา",
  "ประวัติการฉีดวัคซีน",
  "ใบรับรองแพทย์",
];

type StatusType = "idle" | "selected";

type DocItem = {
  name: string;
  status: StatusType;
};

export default function DocumentRequestScreen() {
  const [documents, setDocuments] = useState<DocItem[]>(
    documentsList.map((doc) => ({
      name: doc,
      status: "idle",
    }))
  );

  const [showSuccess, setShowSuccess] = useState(false);

  const toggleItem = (item: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.name !== item) return doc;

        return {
          ...doc,
          status:
            doc.status === "selected" ? "idle" : "selected",
        };
      })
    );
  };

  const isAllSelected = documents.every(
    (doc) => doc.status === "selected"
  );

  const toggleSelectAll = () => {
    setDocuments((prev) =>
      prev.map((doc) => ({
        ...doc,
        status: isAllSelected ? "idle" : "selected",
      }))
    );
  };

  const handleRequest = () => {
    const hasSelected = documents.some(
      (doc) => doc.status === "selected"
    );

    if (!hasSelected) return;

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>เอกสารที่ต้องการขอ</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text style={styles.title}>
            กรุณาเลือกเอกสารที่ต้องการขอ
          </Text>

          <TouchableOpacity
            style={styles.selectAll}
            onPress={toggleSelectAll}
          >
            <View style={styles.checkbox}>
              {isAllSelected && (
                <View style={styles.checkboxActive} />
              )}
            </View>
            <Text style={styles.selectAllText}>
              เลือกทั้งหมด
            </Text>
          </TouchableOpacity>
        </View>

        {documents.map((item) => {
          const isSelected = item.status === "selected";

          return (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.option,
                isSelected && styles.optionActive,
              ]}
              onPress={() => toggleItem(item.name)}
            >
              <View
                style={[
                  styles.radio,
                  isSelected && styles.radioActive,
                ]}
              >
                {isSelected && (
                  <Text style={styles.check}>✓</Text>
                )}
              </View>

              <Text style={styles.optionText}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.button}
          onPress={handleRequest}
        >
          <Text style={styles.buttonText}>
            ขอเอกสารรับรอง
          </Text>
        </TouchableOpacity>
      </View>

      {showSuccess && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.iconOuter}>
              <View style={styles.iconInner}>
                <Ionicons
                  name="checkmark"
                  size={32}
                  color="white"
                />
              </View>
            </View>

            <Text style={styles.modalTitle}>
              ระบบได้ส่งคำขอ
            </Text>
            <Text style={styles.modalTitle}>
              เอกสารรับรองเรียบร้อยแล้ว
            </Text>

            <Text style={styles.modalDesc}>
              ระบบจะทำการแจ้งเตือนเมื่อคำขอได้รับอนุมัติแล้ว
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF7FF",
    paddingTop: 30,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 24,
    marginLeft: 46,
    fontFamily: "IBMPlexSansThai_700bold",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },

  title: {
    fontSize: 18,
    fontFamily: "IBMPlexSansThai_600Semibold",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  selectAll: {
    flexDirection: "row",
    alignItems: "center",
  },

  selectAllText: {
    marginLeft: 6,
    fontSize: 12,
    fontFamily: "IBMPlexSansThai_500Medium", 
  },

  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.25)",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxActive: {
    width: 10,
    height: 10,
    backgroundColor: "#4CAF50",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.25)",
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
  },

  optionActive: {
    borderColor: "#05548D",
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderColor: "rgba(0,0,0,0.25)",
  },

  radioActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },

  check: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "IBMPlexSansThai_500Medium",
  },

  optionText: {
    fontSize: 14,
    fontFamily: "IBMPlexSansThai_500Medium",
  },

  button: {
    marginTop: 12,
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "#05548D",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  buttonText: {
    color: "#05548D",
    fontSize: 16,
    fontFamily: "IBMPlexSansThai_500Medium",
  },

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },

  iconOuter: {
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: "#C8E6C9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  iconInner: {
    width: 70,
    height: 70,
    borderRadius: 999,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "IBMPlexSansThai_700bold",
  },

  modalDesc: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "IBMPlexSansThai_500Medium",
  },
});