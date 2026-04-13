import AppButton from "@/components/appButton";
import BackButton from "@/components/backButton";
import { appointments } from "@/data/appointments";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function AppointmentDetail() {
  const { id } = useLocalSearchParams();

  const appointment = appointments.find(
    (a) => a.id === Number(id)
  );

  const [status, setStatus] = useState(appointment?.status);
  const [showModal, setShowModal] = useState(false);

  if (!appointment) return <Text>ไม่พบข้อมูล</Text>;

  const getStatusStyle = () => {
    if (status === "กำลังพิจารณา") return styles.pendingBadge;
    if (status === "ถูกยกเลิก") return styles.cancelBadge;
    return null;
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        <View>

          <View style={styles.header}>
            <View style={styles.backWrapper}>
              <BackButton />
            </View>

            <Text style={styles.title}>ใบนัดแพทย์</Text>
          </View>

          <View style={[styles.card, styles.cardShadow]}>
            <View style={styles.rowBetween}>
              <Text style={styles.textMedium}>
                ชื่อ : {appointment.name}
              </Text>
              <Text style={styles.textMedium}>
                HN {appointment.hn}
              </Text>
            </View>

            <Text style={styles.textMedium}>
              อายุ {appointment.age}
            </Text>
          </View>

          <View style={[styles.card, styles.cardShadow]}>
            <View style={styles.rowBetween}>
              <Text style={styles.titleLarge}>
                วันที่นัด {appointment.date}
              </Text>

              {status && (
                <View style={[styles.statusBadge, getStatusStyle()]}>
                  <Text style={styles.statusText}>{status}</Text>
                </View>
              )}
            </View>

            <Text style={styles.textMedium}>เวลา : {appointment.time}</Text>
            <Text style={styles.textMedium}>นัดเพื่อ : {appointment.department}</Text>
            <Text style={styles.textMedium}>โรค : {appointment.disease}</Text>
            <Text style={styles.textMedium}>สถานที่ : {appointment.location}</Text>
            <Text style={styles.textMedium}>นัดพบแพทย์ : {appointment.doctor}</Text>
            <Text style={styles.textMedium}>ผู้นัด : {appointment.createBy}</Text>
            <Text style={styles.textMedium}>
              วันที่ออกใบนัด : {appointment.appointmentDate}
            </Text>
          </View>

          {status === "กำลังพิจารณา" && (
            <View style={styles.pendingBox}>
              <Text style={styles.pendingText}>
                เจ้าหน้าที่กำลังพิจารณาคำขอเลื่อนนัด
              </Text>
            </View>
          )}

        </View>
      </ScrollView>
      <View style={styles.bottomButton}>
        <AppButton
          title={
            status === "กำลังพิจารณา"
              ? "ยกเลิกการเลื่อนนัด"
              : "เลื่อนนัด"
          }
          type={
            status === "กำลังพิจารณา"
              ? "danger"
              : "secondary"
          }
          onPress={() => {
            if (status === "กำลังพิจารณา") {
              setShowModal(true);

              setTimeout(() => {
                setShowModal(false);
                setStatus("ถูกยกเลิก");
              }, 3000);
            } else {
              router.push("/(tab)/reSchedule");
            }
          }}
        />
      </View>
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <View style={styles.iconOuter}>
              <View style={styles.iconInner}>
                <Ionicons name="close" size={24} color="white" />
              </View>
            </View>

            <Text style={styles.modalTitle}>
              ระบบได้ทำการยกเลิกการเลื่อนนัดเรียบร้อยแล้ว
            </Text>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#EBF7FF",
  },

  container: {
    flex: 1,
    backgroundColor: "#EBF7FF",
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  header: {
    backgroundColor: "#EBF7FF",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  backWrapper: {
    position: "absolute",
    left: 0,
    zIndex: 1,
  },

  title: {
    fontSize: 24,
    fontFamily: "IBMPlexSansThai_700Bold",
  },

  titleLarge: {
    fontSize: 20,
    fontFamily: "IBMPlexSansThai_600SemiBold",
    marginBottom: 4,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginBottom: 16,
  },

  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    alignItems: "center",
  },

  textMedium: {
    fontSize: 14,
    fontFamily: "IBMPlexSansThai_500Medium",
    marginBottom: 2,
  },

  bottomButton: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: "#EBF7FF",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  pendingBadge: {
    backgroundColor: "#FFF3CD",
  },

  cancelBadge: {
    backgroundColor: "rgba(251, 76, 76, 0.3)"
  },

  statusText: {
    fontSize: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },

  iconOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  iconInner: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#FB4C4C",
    justifyContent: "center",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 6,
  },
  pendingBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },


  pendingText: {
    fontSize: 18,
  },

});