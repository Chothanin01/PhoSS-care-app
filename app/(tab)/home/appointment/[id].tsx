import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { appointments } from "@/data/appointments";
import BackButton from "@/components/backButton";
import AppButton from "@/components/appButton";

export default function AppointmentDetail() {
  const { id } = useLocalSearchParams();

  const appointment = appointments.find(
    (a) => a.id === Number(id)
  );

  if (!appointment) return <Text>ไม่พบข้อมูล</Text>;

  return (

    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        <View>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.backWrapper}>
              <BackButton />
            </View>

            <Text style={styles.title}>
              ใบนัดแพทย์
            </Text>
          </View>
        
          {/* Card 1 */}
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

          {/* Card 2 */}
          <View style={[styles.card, styles.cardShadow]}>
            <Text style={styles.titleLarge}>วันที่นัด {appointment.date}</Text>

            <Text style={styles.textMedium}>เวลา : {appointment.time}</Text>
            <Text style={styles.textMedium}>นัดเพื่อ : {appointment.department}</Text>
            <Text style={styles.textMedium}>โรค : {appointment.disease}</Text>
            <Text style={styles.textMedium}>สถานที่ : {appointment.location}</Text>
            <Text style={styles.textMedium}>นัดพบแพทย์ : {appointment.doctor}</Text>
            <Text style={styles.textMedium}>ผู้นัด : {appointment.createBy}</Text>
            <Text style={styles.textMedium}>วันที่ออกใบนัด : {appointment.appointmentDate}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButton}>
        <AppButton
          title="เลื่อนนัด"
          type="secondary"
          onPress={() => {}}
        />
      </View>
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
    overflow: "visible",
  },
});