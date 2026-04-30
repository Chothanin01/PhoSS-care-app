import AppButton from "@/components/appButton";
import BackButton from "@/components/backButton";
import { api } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AppointmentDetailData = {
  appoint_id: string;
  disease_id: string;
  fullname: string;
  hn_number: string;
  age_years: number;
  age_months: number;
  age_days: number;
  date: string;
  delay_date: string;
  start_time: string;
  end_time: string;
  delay_end_time: string;
  delay_start_time: string;
  purpose: string;
  disease_name: string;
  place: string;
  doctor: string;
  created_by: string;
  appointment_date: string;
  status: string;
  created_at: string;
};

type BasicInfoData = {
  patient_id: string;
  fullname: string;
  hn_number: string;
  age_years: number;
  age_months: number;
  age_days: number;
};

const formatThaiDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;

  return `${day} ${month} ${year}`;
};

export default function AppointmentDetail() {
  const { id } = useLocalSearchParams();

  const [appointment, setAppointment] =
    useState<AppointmentDetailData | null>(null);
  const [basicInfo, setBasicInfo] =
    useState<BasicInfoData | null>(null);

  const [status, setStatus] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBasicInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await api.get(
        "/v1/patient/basicinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.log("Fetch basic info error:", error);
      return null;
    }
  };

  const fetchAppointmentDetail = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await api.get(
        `/v1/patient/appointments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointment(response.data.data);
      setStatus(response.data.data.status);

    } catch (error) {
      console.log("Fetch appointment detail error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        await fetchAppointmentDetail();
      }

      const basicInfo = await fetchBasicInfo();

      if (basicInfo) {
        setBasicInfo(basicInfo);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!appointment) {
    return <Text>ไม่พบข้อมูล</Text>;
  }

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "delay":
        return styles.pendingBadge;

      case "cancelled":
        return styles.cancelBadge;

      default:
        return null;
    }
  };

  const getStatusTextStyle = (status?: string) => {
    switch (status) {
      case "delay":
        return styles.pendingTextColor;

      case "cancelled":
        return styles.cancelTextColor;

      default:
        return null;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "delay":
        return "กำลังพิจารณา";

      case "cancelled":
        return "ถูกยกเลิก";

      case "ongoing":
        return "";

      default:
        return "";
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        <View>

          <View style={styles.header}>
            <View style={styles.backWrapper}>
              <BackButton targetPath={`/(tab)/home`}/>
            </View>

            <Text style={styles.title}>ใบนัดแพทย์</Text>
          </View>

          {/* Patient Card */}
          <View style={[styles.card, styles.cardShadow]}>
            <View style={styles.rowBetween}>
              <Text style={styles.textMedium}>
                {basicInfo?.fullname || "-"}
              </Text>

              <Text style={styles.textMedium}>
                HN {basicInfo?.hn_number || "-"}
              </Text>
            </View>

            <Text style={styles.textMedium}>
              อายุ {basicInfo?.age_years || 0} ปี{" "}
              {basicInfo?.age_months || 0} เดือน{" "}
              {basicInfo?.age_days || 0} วัน
            </Text>
          </View>

          {/* Appointment Detail Card */}
          <View style={[styles.card, styles.cardShadow]}>
            <View style={styles.rowBetween}>
              {status === "delay" ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.oldDateAndTime}>
                    {formatThaiDate(appointment.date)}
                  </Text>
                  <Text style={styles.newDateAndTime}>
                    {"  "} {formatThaiDate(appointment.delay_date)}
                  </Text>
                </View>
              ) : (
                <Text style={styles.titleLarge}>
                  วันที่นัด {formatThaiDate(appointment.date)}
                </Text>
              )}
              {status !== "ongoing" && (
                <View
                  style={[
                    styles.statusBadge,
                    getStatusStyle(status),
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      getStatusTextStyle(status),
                    ]}
                  >
                    {getStatusText(status)}
                  </Text>
                </View>
              )}
            </View>

            {status === "delay" ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.oldDateAndTime}>
                  {appointment.start_time} - {appointment.end_time} น.
                </Text>
                <Text style={styles.newDateAndTime}>
                  {"  "} {appointment.delay_start_time} - {appointment.delay_end_time} น.
                </Text>
              </View>
            ) : (
              <Text style={styles.textMedium}>
                เวลา : {appointment.start_time} - {appointment.end_time} น.
              </Text>
            )}

            <Text style={styles.textMedium}>นัดมาเพื่อ : {appointment.purpose}</Text>
            <Text style={styles.textMedium}>โรค : {appointment.disease_name}</Text>
            <Text style={styles.textMedium}>สถานที่ : {appointment.place}</Text>
            <Text style={styles.textMedium}>นัดพบแพทย์ : {appointment.doctor}</Text>
            <Text style={styles.textMedium}>ผู้นัด : {appointment.created_by}</Text>

            <Text style={styles.textMedium}>
              วันที่ออกใบนัด :{" "}{formatThaiDate(appointment.created_at)}
            </Text>
          </View>

          {status === "delay" && (
            <View style={styles.pendingBox}>
              <Text style={styles.pendingText}>
                เจ้าหน้าที่กำลังพิจารณาคำขอเลื่อนนัด
              </Text>
            </View>
          )}

        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButton}>
        <AppButton
          title={
            status === "delay"
              ? "ยกเลิกการเลื่อนนัด"
              : "เลื่อนนัด"
          }
          type={
            status === "delay"
              ? "danger"
              : "secondary"
          }
          onPress={() => {
            if (status === "delay") {
              setShowModal(true);

              setTimeout(() => {
                setShowModal(false);
                setStatus("cancelled");
              }, 3000);
            } else {
              router.push("/(tab)/reSchedule");
            }
          }}
        />
      </View>

      {/* Modal */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <View style={styles.iconOuter}>
              <View style={styles.iconInner}>
                <Ionicons name="close" size={32} color="white" />
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
  pendingTextColor: {
    color: "#856404",
  },

  cancelTextColor: {
    color: "#D32F2F",
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
    backgroundColor: "rgba(251, 76, 76, 0.15)",
  },

  statusText: {
    fontSize: 12,
    fontFamily: "IBMPlexSansThai_500Medium",
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
    fontFamily: "IBMPlexSansThai_600SemiBold",
    color: "#7A7A7A",
  },

  oldDateAndTime: {
    fontSize: 14,
    fontFamily: "IBMPlexSansThai_500Medium",
    textDecorationLine: "line-through",
    color: "#000",
    marginRight: 4,
  },

  newDateAndTime: {
    fontSize: 14,
    fontFamily: "IBMPlexSansThai_500Medium",
    color: "#7A7A7A",
  },

});