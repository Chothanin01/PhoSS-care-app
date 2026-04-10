import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { appointments } from "@/data/appointments";
import BackButton from "@/components/backButton";
import AppButton from "@/components/appButton";

export default function AppointmentDetail() {
  const { id } = useLocalSearchParams();

  const appointment = appointments.find(
    a => a.id === Number(id)
  );

  if (!appointment) return <Text>ไม่พบข้อมูล</Text>;

  return (
    <>
      <ScrollView style={styles.container}>
        <View>
          <View className="flex-row items-center justify-between mb-4">
            <BackButton />

            <Text className="text-2xl font-bold flex-1 text-center mr-10 mt-1" style={{ lineHeight: 40 }} >
              ใบนัดแพทย์
            </Text>
          </View>
          <View className="bg-white rounded-2xl p-4 w-full shadow-black mb-4" style={styles.card}>
            <View className="flex-row justify-between mb-1">
              <Text className="font-medium">ชื่อ : {appointment.name}</Text>
              <Text className="font-medium">HN {appointment.hn}</Text>
            </View>
            <Text className="font-medium">อายุ {appointment.age}</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 w-full shadow-black">
            <Text className="font-semibold text-xl mb-1">วันที่นัด {appointment.date}</Text>

            <Text className="font-medium">เวลา : {appointment.time}</Text>
            <Text className="font-medium">นัดเพื่อ : {appointment.department}</Text>
            <Text className="font-medium">โรค : {appointment.disease}</Text>
            <Text className="font-medium">สถานที่ : {appointment.location}</Text>
            <Text className="font-medium">นัดพบแพทย์ : {appointment.doctor}</Text>
            <Text className="font-medium">ผู้นัด : {appointment.createBy}</Text>
            <Text className="font-medium">วันที่ออกใบนัด : {appointment.appointmentDate}</Text>
          </View>

        </View>
      </ScrollView>

      <View style={styles.bottomButton}>
        <AppButton
          title="เลื่อนนัด"
          type="secondary"
          onPress={() => {}}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF7FF",
    padding: 16,
  },

  bottomButton: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
  },

  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});