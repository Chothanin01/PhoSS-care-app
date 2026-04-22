import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BackButton from "@/components/backButton";
import { Ionicons } from "@expo/vector-icons";

const historyData = [
  {
    id: 10,
    no: 10,
    date: "3 ตุลาคม 2568",
    doctor: "นางจิต ใจดี",
    disease: "โรคเบาหวาน",
    treatment: "ผลตรวจ HbA1c ลดลงและอยู่ในเกณฑ์ควบคุมได้ รับประทานยาและปฏิบัติตามคำแนะนำของแพทย์ได้อย่างสม่ำเสมอ",
    pulse: "83",
    weight: "50",
    pressure: "91/53",
    height: "179",
    bmi: "22.8",
    symptom: "ปกติ",
    sugar: "126",
    status: "สีเขียว",
    statusColor: "#58AD46",
  },
  {
    id: 9,
    no: 9,
    date: "3 กันยายน 2568",
    doctor: "นางจิต ใจดี",
    disease: "โรคเบาหวาน",
    treatment: "แนะนำให้ปรับพฤติกรรมการรับประทานอาหาร",
    pulse: "80",
    weight: "51",
    pressure: "95/60",
    height: "179",
    bmi: "23.1",
    symptom: "ปกติ",
    sugar: "135",
    status: "สีเหลือง",
    statusColor: "#FFD57B",
  },
  {
    id: 8,
    no: 8,
    date: "3 กันยายน 2568",
    doctor: "นางจิต ใจดี",
    disease: "โรคเบาหวาน",
    treatment: "แนะนำให้ปรับพฤติกรรมการรับประทานอาหาร",
    pulse: "80",
    weight: "51",
    pressure: "95/60",
    height: "179",
    bmi: "23.1",
    symptom: "ปกติ",
    sugar: "135.",
    status: "สีเหลือง",
    statusColor: "#FFD57B",
  },
];

export default function MedicalHistoryDetailPage() {
  const { id, disease } = useLocalSearchParams<{
    id: string;
    disease: string;
  }>();

  const currentId = Number(id);

  const currentIndex = historyData.findIndex(
    (item) => item.id === currentId
  );

  const currentItem = historyData[currentIndex];

  const previousItem = historyData[currentIndex + 1];
  const nextItem = historyData[currentIndex - 1];

  if (!currentItem) {
    return (
      <View style={styles.wrapper}>
        <Text>ไม่พบข้อมูล</Text>
      </View>
    );
  }

  const goToPrevious = () => {
    if (previousItem) {
      router.push({
        pathname: "/(tab)/medicalHis/detail/[id]",
        params: {
          id: String(previousItem.id),
          disease: String(disease),
        },
      });
    }
  };

  const goToNext = () => {
    if (nextItem) {
      router.push({
        pathname: "/(tab)/medicalHis/detail/[id]",
        params: {
          id: String(nextItem.id),
          disease: String(disease),
        },
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.backWrapper}>
            <BackButton
              targetPath={`/(tab)/medicalHis?disease=${disease}`}
            />
          </View>

          <Text style={styles.title}>
            ประวัติการรักษา{currentItem.disease}
          </Text>
        </View>

        {/* Card 1 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            ครั้งที่ {currentItem.no}
          </Text>

          <Text style={styles.text}>
            วันที่ตรวจ : {currentItem.date}
          </Text>

          <Text style={styles.text}>
            ผู้ตรวจ : {currentItem.doctor}
          </Text>
        </View>

        {/* Card 2 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ตรวจร่างกายทั่วไป</Text>

          <Text style={styles.text}>
            ชีพจร : {currentItem.pulse} ครั้ง/นาที   น้ำหนัก : {currentItem.weight} กก.
          </Text>

          <Text style={styles.text}>
            ความดัน : {currentItem.pressure} มม./ปรอท
          </Text>

          <Text style={styles.text}>
            ความสูง : {currentItem.height} ซม.
          </Text>

          <Text style={styles.text}>
            ดัชนีมวลกาย : {currentItem.bmi} กก./ม²
          </Text>
        </View>

        {/* Card 3 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>การรักษา</Text>

          <Text style={styles.text}>
            {currentItem.treatment}
          </Text>
        </View>

        {/* Card 4 */}
        <View style={styles.card}>
          <Text style={styles.text}>
            อาการ : {currentItem.symptom}
          </Text>

          <Text style={styles.text}>
            ระดับน้ำตาล : {currentItem.sugar} มก./ดล.
          </Text>

          <View style={styles.statusRow}>
            <Text style={styles.text}>สถานะ : </Text>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: currentItem.statusColor },
              ]}
            >
              <Text style={styles.statusText}>
                {currentItem.status}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButton}>
        <TouchableOpacity
          style={[
            styles.navButton,
            !previousItem && styles.disabledButton,
          ]}
          disabled={!previousItem}
          onPress={goToPrevious}
        >
          <Text style={styles.navText}>
            <Ionicons 
              name="caret-back-outline"
              size={24}
              color="#05548D"
            />
              นัดครั้งก่อน
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            !nextItem && styles.disabledButton,
          ]}
          disabled={!nextItem}
          onPress={goToNext}
        >
          <Text style={styles.navText}>
            นัดถัดไป
            <Ionicons 
              name="caret-forward-outline"
              size={24}
              color="#05548D"
            />
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 16,
    backgroundColor: "#EBF7FF",
  },

  header: {
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: "center",
    position: "relative",
  },

  backWrapper: {
    position: "absolute",
    left: 0,
    top: 18,
  },

  title: {
    fontSize: 22,
    fontFamily: "IBMPlexSansThai_700Bold",
    textAlign: "center",
    marginLeft: 24,
    marginTop: 6,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 20,
    fontFamily: "IBMPlexSansThai_700Bold",
    marginBottom: 8,
  },

  text: {
    fontSize: 15,
    fontFamily: "IBMPlexSansThai_500Medium",
    marginBottom: 6,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
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

  bottomButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#EBF7FF",
  },

  navButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#05548D",
  },

  disabledButton: {
    opacity: 0.4,
  },

  navText: {
    fontSize: 18,
    color: "#05548D",
    fontFamily: "IBMPlexSansThai_700Bold",
  },
});