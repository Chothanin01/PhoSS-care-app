import { ScrollView, StyleSheet, Text, View, Image, Dimensions } from "react-native";
import AppointmentCard from "@/components/home/homeAppointmentCard";
import { appointments } from "@/data/appointments";
import { useState } from "react";
import GridMenu from "@/components/home/gridMenu";
import DiseaseModal from "@/components/home/diseaseModal";
import { router } from "expo-router";

export default function Page() {

  const [index, setIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [targetPath, setTargetPath] = useState<MenuPath | null>(null);
  const menuItems = [
  { label: "เลื่อนนัด", icon: "calendar-outline", path: "/(tab)/reSchedule", needDisease: true },
  { label: "ข้อมูลผู้ป่วย", icon: "person-outline", path: "/(tab)/patientData" },
  { label: "การรักษา", icon: "medkit-outline", path: "/(tab)/home", needDisease: true },
  { label: "ขอเอกสาร", icon: "cloud-download-outline", path: "/(tab)/document" },
  { label: "แจ้งเตือน", icon: "notifications-outline", path: "/(tab)/notification" },
  { label: "คู่มือการใช้งาน", icon: "settings-outline", path: "/(tab)/guide" },
] as const;

  type MenuPath = (typeof menuItems)[number]["path"];

  const handleMenuPress = (path: MenuPath) => {
    const needDisease = ["/(tab)/reSchedule", "/(tab)/home"];

    if (needDisease.includes(path)) {
      setTargetPath(path);
      setModalVisible(true);
    } else {
      router.push(path);
    }
  };

  return ( 
    <>
      <ScrollView style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/PhossLogo-removebg-preview.png")}
            style={styles.logo}
          />

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text className="font-semibold" style={styles.title}>โรงพยาบาลโพธิ์ศรีสุวรรณ</Text>

            <View style={styles.underline} />

            <Text className="font-medium" style={styles.hn}>HN 0012843</Text>
          </View>
        </View>

        {/* AppointmentCard */}
        <View className="mb-4">
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
            {appointments.map((item) => (
              <View key={item.id} style={{ width: screenWidth, marginRight: 32 }}>
                <AppointmentCard
                  key={item.id}
                  name={item.name}
                  age={item.age}
                  date={item.date}
                  disease={item.disease}
                  time={item.time}
                  department={item.department}
                  location={item.location}
                  doctor={item.doctor}
                  index={index}
                  total={appointments.length}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Grid Menu */}
        <GridMenu items={menuItems} onPressItem={handleMenuPress} />

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

  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginRight: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
    textAlign: "right",
    marginRight: 20,
  },
});