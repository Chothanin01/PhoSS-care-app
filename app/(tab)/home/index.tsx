import DiseaseModal from "@/components/home/diseaseModal";
import GridMenu from "@/components/home/gridMenu";
import AppointmentCard from "@/components/home/homeAppointmentCard";
import { hasUnread } from "@/data/notification";
import { api } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Appointment = {
  appoint_id: string;
  no: number;
  date: string;
  delay_date: string;
  start_time: string;
  end_time: string;
  delay_end_time: string;
  delay_start_time: string;
  symptom: string;
  note: string;
  place: string;
  purpose: string;
  doctor: string;
  status: string;
  delay: boolean;
  disease_id: string;
  disease_name: string;
};

type PatientData = {
  patient_id: string;
  fullname: string;
  hn_number: string;
  age_years: number;
  age_months: number;
  age_days: number;
  appoint: Appointment[];
};

export default function Page() {

  const [index, setIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [targetPath, setTargetPath] = useState<MenuPath | null>(null);

  const [patientInfo, setPatientInfo] = useState<PatientData | null>(null);

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [mode, setMode] = useState<"appoint" | "history">("appoint");
  const [loading, setLoading] = useState(true);

  const notificationCount = hasUnread() ? 1 : 0;
  const formatThaiDate = (dateString: string) => {
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

  const menuItems = [
    { label: "เลื่อนนัด", icon: "calendar-outline", path: "/(tab)/reSchedule", needDisease: true },
    { label: "ข้อมูลผู้ป่วย", icon: "person-outline", path: "/(tab)/patientData" },
    { label: "การรักษา", icon: "medkit-outline", path: "/(tab)/medicalHis", needDisease: true },
    { label: "ขอเอกสาร", icon: "cloud-download-outline", path: "/(tab)/document" },
    { label: "แจ้งเตือน", icon: "notifications-outline", path: "/(tab)/notification" },
    { label: "คู่มือการใช้งาน", icon: "settings-outline", path: "/(tab)/guide" },
  ] as const;

  type MenuPath = (typeof menuItems)[number]["path"];

  const handleMenuPress = (path: MenuPath) => {
  if (path === "/(tab)/reSchedule") {
    setMode("appoint");
    setTargetPath(path);
    setModalVisible(true);
    return;
  }

  if (path === "/(tab)/medicalHis") {
    setMode("history");
    setTargetPath(path);
    setModalVisible(true);
    return;
  }

  router.push(path);
};

  const fetchPatientAppointments = async () => {
    try {

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await api.get("/v1/patient/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPatientInfo(response.data.data);
    } catch (error) {
      console.log("Fetch patient appointments error:", error);
    } finally {
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await api.get("/v1/auth/patient/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await AsyncStorage.removeItem("token");

      router.replace("/");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  useEffect(() => {
    fetchPatientAppointments();
  }, []);

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

        <View>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require("@/assets/images/PhossLogo-removebg-preview.png")}
              style={styles.logo}
            />

            <View style={styles.headerText}>
              <Text style={styles.title}>โรงพยาบาลโพธิ์ศรีสุวรรณ</Text>

              <View style={styles.underline} />

              <Text style={styles.hn}>
                HN {patientInfo?.hn_number}
              </Text>
            </View>
          </View>

          {/* AppointmentCard */}
          <View style={styles.cardWrapper}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const x = event.nativeEvent.contentOffset.x;
                const current = Math.round(x / screenWidth);
                setIndex(current);
              }}
              scrollEventThrottle={16}
            >
              {!patientInfo?.appoint || patientInfo.appoint.length === 0 ? (
                <View
                  style={{
                    width: screenWidth - 32,
                    marginHorizontal: 16,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    padding: 16,
                    elevation: 3,
                  }}
                >
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>
                      คุณยังไม่มีนัดหมาย
                    </Text>
                  </View>
                </View>
              ) : (
                patientInfo.appoint.map((item) => (
                  <View
                    key={item.appoint_id}
                    style={{
                      width: screenWidth,
                      paddingHorizontal: 16,
                    }}
                  >
                    <AppointmentCard
                      id={item.disease_id}
                      key={item.appoint_id}
                      name={patientInfo.fullname}
                      age_years={String(patientInfo.age_years)}
                      age_months={String(patientInfo.age_months)}
                      age_days={String(patientInfo.age_days)}
                      date={formatThaiDate(item.date)}
                      delay_date={formatThaiDate(item.delay_date)}
                      disease={item.disease_name}
                      time={`${item.start_time} - ${item.end_time}`}
                      delay_time={`${item.delay_start_time} - ${item.delay_end_time}`}
                      department={item.purpose}
                      location={item.place}
                      doctor={item.doctor}
                      index={index}
                      total={patientInfo.appoint.length}
                      status={item.status}
                    />
                  </View>
                ))
              )}
            </ScrollView>
          </View>

          {/* Grid Menu */}
          <GridMenu
            items={menuItems}
            onPressItem={handleMenuPress}
            notificationCount={notificationCount}
          />
        </View>

        <View style={styles.logoutWrapper}>
          <Text
            style={styles.logoutText}
            onPress={() => setLogoutModalVisible(true)}
          >
            ออกจากระบบ
          </Text>
        </View>

      </ScrollView>

      <DiseaseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedDisease={selectedDisease}
        setSelectedDisease={setSelectedDisease}
        targetPath={targetPath}
        mode={mode} // 👈 ต้องส่ง
      />

      {logoutModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>ยืนยันการออกจากระบบ</Text>
            <Text style={styles.modalDesc}>
              คุณต้องการออกจากระบบใช่หรือไม่?
            </Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelText}>ยกเลิก</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleLogout}
              >
                <Text style={styles.confirmText}>ยืนยัน</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF7FF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  headerText: {
    flex: 1,
    marginLeft: 10,
  },

  title: {
    fontSize: 18,
    fontFamily: "Sarabun_600SemiBold",
    textAlign: "right",
    marginRight: 20,
  },

  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },

  underline: {
    height: 0.5,
    backgroundColor: "#05548D",
    marginVertical: 4,
    width: "100%",
  },

  hn: {
    fontSize: 14,
    fontFamily: "Sarabun_500Medium",
    textAlign: "right",
    marginRight: 20,
  },

  cardWrapper: {
    marginHorizontal: -16,
    marginBottom: 16,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  emptyText: {
    fontSize: 16,
    fontFamily: "Sarabun_500Medium",
    color: "#7A7A7A",
    marginTop: 8,
  },

  contentContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 30,
  },

  logoutWrapper: {
    alignItems: "center",
    marginTop: 20,
  },

  logoutText: {
    fontSize: 20,
    color: "#05548D",
    fontFamily: "Sarabun_600SemiBold",
    textDecorationLine: "underline",
  },

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontFamily: "Sarabun_700Bold",
    marginBottom: 10,
    textAlign: "center",
  },

  modalDesc: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Sarabun_600Semibold",
  },

  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelButton: {
    marginRight: 12,
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#FB4C4C",
    borderRadius: 8,
  },

  confirmButton: {
    backgroundColor: "#05548D",
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 12,
  },

  cancelText: {
    color: "#fff",
  },

  confirmText: {
    color: "#fff",
  },
});