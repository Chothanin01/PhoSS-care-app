import DiseaseModal from "@/components/home/diseaseModal";
import GridMenu from "@/components/home/gridMenu";
import AppointmentCard from "@/components/home/homeAppointmentCard";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/services/api";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

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
    const needDisease = ["/(tab)/reSchedule", "/(tab)/medicalHis"];

    if (needDisease.includes(path)) {
      setTargetPath(path);
      setModalVisible(true);
    } else {
      router.push(path);
    }
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

  const [hasUnreadNoti, setHasUnreadNoti] = useState(false);

  const fetchUnreadStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) return;

      const res = await api.get("/v1/patient/noti/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHasUnreadNoti(res.data.has_unread);
    } catch (err) {
      console.log("fetch unread error:", err);
    }
  };

  const [hasUnreadNoti, setHasUnreadNoti] = useState(false);

  const fetchUnreadStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) return;

      const res = await api.get("/v1/patient/noti/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHasUnreadNoti(res.data.has_unread);
    } catch (err) {
      console.log("fetch unread error:", err);
    }
  };

  useEffect(() => {
    fetchPatientAppointments();
    fetchUnreadStatus();
  }, []);

  const notificationCount = hasUnreadNoti ? 1 : 0;
  
  useFocusEffect(
    useCallback(() => {
      fetchUnreadStatus();
    }, [])
  );

  return ( 
    <>
      <ScrollView style={styles.container}>

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

      </ScrollView>

      <DiseaseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedDisease={selectedDisease}
        setSelectedDisease={setSelectedDisease}
        targetPath={targetPath}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF7FF",
    padding: 16,
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
    fontFamily: "IBMPlexSansThai_600SemiBold",
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
    fontFamily: "IBMPlexSansThai_500Medium",
    textAlign: "right",
    marginRight: 20,
  },

  cardWrapper: {
    marginBottom: 16,
    marginHorizontal: -16,
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
    fontFamily: "IBMPlexSansThai_500Medium",
    color: "#7A7A7A",
    marginTop: 8,
  },
});