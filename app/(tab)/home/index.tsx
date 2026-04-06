import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from "react-native";
import AppointmentCard from "@/components/home/homeAppointmentCard";
import { appointments } from "@/data/appointments";
import { useState } from "react";

export default function Page() {

  const [index, setIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;

  return ( 
    <ScrollView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/PhossLogo.png")}
          style={styles.logo}
        />

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.title}>โรงพยาบาลโพธิ์ศรีสุวรรณ</Text>

          <View style={styles.underline} />

          <Text style={styles.hn}>HN 0012843</Text>
        </View>
      </View>

      {/* AppointmentCard */}
      <View>
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
            <View key={item.id} style={{ width: screenWidth, alignItems: "center" }}>
              <AppointmentCard
                key={item.id}
                name={item.name}
                age={item.age}
                date={item.date}
                time={item.time}
                department={item.department}
                location={item.location}
                doctor={item.doctor}
              />
            </View>
          ))}
        </ScrollView>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 8 }}>
          {appointments.map((_, i) => (
            <View
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 4,
                backgroundColor: i === index ? "#58AD46" : "#D9D9D9",
              }}
            />
          ))}
        </View>
      </View>

      {/* Grid Menu */}
      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.box}>
            <Ionicons name={item.icon as any} size={28} color="#05548D" />
            <Text style={styles.boxText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView>
  );
}

const menuItems = [
  { label: "เลื่อนนัด", icon: "calendar-outline" },
  { label: "ข้อมูลผู้ป่วย", icon: "person-outline" },
  { label: "การรักษา", icon: "medkit-outline" },
  { label: "ขอเอกสาร", icon: "cloud-download-outline" },
  { label: "แจ้งเตือน", icon: "notifications-outline" },
  { label: "คู่มือการใช้งาน", icon: "settings-outline" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6edf5",
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
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },

  cardTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },

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
  },

  logo: {
  width: 60,
  height: 60,
  resizeMode: "contain",
  },

  underline: {
    height: 1,
    backgroundColor: "#05548D",
    marginVertical: 4,
    width: "90%",
  },

  hn: {
    fontSize: 14,
    color: "#374151",
  },
});