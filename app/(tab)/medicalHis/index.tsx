import { useLocalSearchParams, router } from "expo-router";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "@/components/backButton";

const historyData = [
  {
    id: 10,
    No: 10,
    date: "3 ตุลาคม 2568",
    Note: "ผลตรวจ HbA1c ลดลงและอยู่ในเกณฑ์ที่ดี",
    status: "สีเขียว",
    DoctorName: "นางจิต ใจดี",
    ColorStatus: "#58AD46",
  },
  {
    id: 9,
    No: 9,
    date: "3 กันยายน 2568",
    Note: "แนะนำให้ปรับพฤติกรรมการรับประทานอาหาร",
    status: "สีเหลือง",
    DoctorName: "นางจิต ใจดี",
    ColorStatus: "#FFD57B",
  },
  {
    id: 8,
    No: 8,
    date: "3 กรกฎาคม 2568",
    Note: "เพิ่มการออกกำลังกายโดยผู้ป่วยตอบรับดี",
    status: "สีเหลือง",
    DoctorName: "นางจิต ใจดี",
    ColorStatus: "#FFD57B",
  },
  {
    id: 7,
    No: 7,
    date: "3 มิถุนายน 2568",
    Note: "ระดับน้ำตาลในเลือดยังสูงเกินเกณฑ์",
    status: "สีแดง",
    DoctorName: "นางจิต ใจดี",
    ColorStatus: "#FF0505",
  },
];

export default function MedicalHisPage() {
  const { disease } = useLocalSearchParams<{ disease: string }>();

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.backWrapper}>
            <BackButton targetPath={`/(tab)/home`} />
          </View>

          <Text style={styles.title}>รายการประวัติการรักษา</Text>
          <Text style={styles.subTitle}>
            {disease || "ไม่พบข้อมูลโรค"}
          </Text>
        </View>

        {/* Cards */}
        {historyData.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.visitTitle}>ครั้งที่ {item.id}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>

            <Text style={styles.text}>
              การรักษา : {item.Note}
            </Text>

            <View style={styles.statusRow}>
              <Text style={styles.text}>สถานะ : </Text>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: item.ColorStatus },
                ]}
              >
                <Text style={styles.statusText}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.bottomRow}>
              <Text style={styles.text}>
                ผู้ตรวจ : {item.DoctorName}
              </Text>

              <TouchableOpacity
                style={styles.arrowBtn}
                onPress={() =>
                  router.push({
                    pathname: "/(tab)/medicalHis/detail/[id]",
                    params: {
                      id: String(item.id),
                      disease: String(disease),
                    },
                  })
                }
              >
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={24}
                  color="#05548D"
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
    paddingTop: 16,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  backWrapper: {
    position: "absolute",
    left: 0,
    top: 18,
    zIndex: 10,
  },

  title: {
    fontSize: 22,
    fontFamily: "IBMPlexSansThai_700Bold",
    textAlign: "center",
  },

  subTitle: {
    fontSize: 22,
    fontFamily: "IBMPlexSansThai_700Bold",
    textAlign: "center",
    marginTop: 2,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  visitTitle: {
    fontSize: 18,
    fontFamily: "IBMPlexSansThai_700Bold",
  },

  date: {
    fontSize: 14,
    fontFamily: "IBMPlexSansThai_500Medium",
  },

  text: {
    fontSize: 15,
    fontFamily: "IBMPlexSansThai_500Medium",
    marginTop: 8,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
  },

  statusText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "IBMPlexSansThai_600SemiBold",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  arrowBtn: {
    marginLeft: 8,
  },
});