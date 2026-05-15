import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  id: string;
  name: string;
  age_years: string;
  age_months: string;
  age_days: string;
  date: string;
  delay_date?: string;
  time: string;
  delay_time: string;
  disease: string;
  department: string;
  doctor: string;
  location: string;
  index: number;
  total: number;
  status?: string;
};
  const getStatusText = (status?: string) => {
    switch (status) {
      case "delay":
        return "กำลังพิจารณา";

      case "ongoing":
        return "";

      default:
        return "";
    }
  };

export default function AppointmentCard({
  id,
  name,
  age_years,
  age_months,
  age_days,
  date,
  delay_date,
  time,
  delay_time,
  disease,
  department,
  doctor,
  location,
  index,
  total,
  status,
}: Props) {
  const showDelayStatus = status === "delay";

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/(tab)/home/appointment/[id]",
          params: { id },
        } as const);
      }}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>ใบนัดแพทย์</Text>

        {showDelayStatus && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {getStatusText(status)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.text}>ชื่อ : {name}</Text>
        <Text style={styles.text}>อายุ : {age_years} ปี {age_months} เดือน {age_days} วัน</Text>
      </View>

      {showDelayStatus ? (
        <>
        <View>
          <Text style={styles.oldDateAndTime}>{date}</Text>
          <Text style={styles.newDateAndTime}>({delay_date})</Text>
        </View>
        </>
      ) : (
        <Text style={styles.text}>{date}</Text>
      )}
      
      {showDelayStatus ? (
        <>
        <View>
          <Text style={styles.oldDateAndTime}>{time} น.</Text>
          <Text style={styles.newDateAndTime}>({delay_time} น.)</Text>
        </View>
        </>
      ) : (
        <Text style={styles.text}>{time} น.</Text>
      )}

      <Text style={styles.text}>{disease}</Text>
      <Text style={styles.text}>นัดเพื่อ : {department}</Text>
      <Text style={styles.text}>สถานที่ : {location}</Text>
      <Text style={styles.text}>นัดพบแพทย์ : {doctor}</Text>

      <View style={styles.dotContainer}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    elevation: 3,
  },

  title: {
    fontSize: 20,
    fontFamily: "Sarabun_600SemiBold",
    marginBottom: 4,
  },

  text: {
    fontSize: 14,
    fontFamily: "Sarabun_500Medium",
    marginBottom: 2,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: "#58AD46",
  },

  inactiveDot: {
    backgroundColor: "#D1D5DB",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  statusBadge: {
    backgroundColor: "#FFF3CD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
    color: "#856404",
    fontSize: 12,
    fontFamily: "Sarabun_500Medium",
  },

  oldDateAndTime: {
    fontSize: 14,
    fontFamily: "Sarabun_500Medium",
    textDecorationLine: "line-through",
    color: "#000",
    marginRight: 4,
  },

  newDateAndTime: {
    fontSize: 14,
    fontFamily: "Sarabun_500Medium",
    color: "#7A7A7A",
  },
});