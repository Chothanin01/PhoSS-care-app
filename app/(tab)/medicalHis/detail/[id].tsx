import BackButton from "@/components/backButton";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/* ------------------ MOCK  โรค ------------------ */
const historyData = [
  {
    id: 10,
    no: 10,
    date: "3 ตุลาคม 2568",
    doctor: "นางจิต ใจดี",
    disease: "โรคเบาหวาน",
    treatment: "HbA1c ดีขึ้น อยู่ในเกณฑ์ควบคุมได้",
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
    treatment: "HbA1c ดีขึ้น อยู่ในเกณฑ์ควบคุมได้",
    pulse: "83",
    weight: "50",
    pressure: "91/53",
    height: "179",
    bmi: "22.8",
    symptom: "ปกติ",
    sugar: "126",
    status: "สีเหลือง",
    statusColor: "#FFD57B",
  },
  {
    id: 8,
    no: 8,
    date: "3 มิถุนายน 2568",
    doctor: "นางจิต ใจดี",
    disease: "โรคเบาหวาน",
    treatment: "HbA1c ดีขึ้น อยู่ในเกณฑ์ควบคุมได้",
    pulse: "83",
    weight: "50",
    pressure: "91/53",
    height: "179",
    bmi: "22.8",
    symptom: "ปกติ",
    sugar: "126",
    status: "สีเเดง",
    statusColor: "#FF0505",
  },
];

/* ------------------ MOCK วัคซีน ------------------ */
const vaccineData = [
  {
    id: 1,
    vaccineType: "วัคซีน BCG",
    vaccineName: "ป้องกันวัณโรค",
    recommendedAge: "แรกเกิด",
    receiveDate: "1 ม.ค. 2568",
    status: "ได้รับวัคซีนเเล้ว",
    statusColor: "#58AD46",
    sideEffect: "อาจมีตุ่มหนองเล็กน้อย",
    recommendation: "หลีกเลี่ยงการเกา",
  },
  {
    id: 2,
    vaccineType: "วัคซีน DTP",
    vaccineName: "คอตีบ-บาดทะยัก-ไอกรน",
    recommendedAge: "2 เดือน",
    receiveDate: "ยังไม่ได้รับ",
    status: "รอรับวัคซีน",
    statusColor: "#FFD57B",
    sideEffect: "มีไข้ต่ำ ปวดบริเวณฉีด",
    recommendation: "เช็ดตัวลดไข้",
  },
  {
    id: 3,
    vaccineType: "วัคซีน OTP",
    vaccineName: "คอตีบ-บาดทะยัก-ไอกรน",
    recommendedAge: "2 เดือน",
    receiveDate: "ยังไม่ได้รับ",
    status: "ยังไม่ได้รับวัคซีน",
    statusColor: "#FF0505",
    sideEffect: "มีไข้ต่ำ ปวดบริเวณฉีด",
    recommendation: "เช็ดตัวลดไข้",
  },
];

export default function MedicalHistoryDetailPage() {
  const { id, disease } = useLocalSearchParams<{
    id: string;
    disease: string;
  }>();

  const isVaccine = disease?.includes("วัคซีน");

  const medicalItem = historyData.find(
    (item) => item.id === Number(id)
  );
  const vaccineItem = vaccineData.find(
    (item) => item.id === Number(id)
  );
  const currentItem = isVaccine ? vaccineItem : medicalItem;

  if (!currentItem) {
    return (
      <View style={styles.wrapper}>
        <Text>ไม่พบข้อมูล</Text>
      </View>
    );
  }
  const dataList = historyData; 
  const currentIndex = dataList.findIndex(
    (item) => item.id === Number(id)
  );
  const previousItem =
    currentIndex >= 0 ? dataList[currentIndex + 1] : undefined;
  const nextItem =
    currentIndex >= 0 ? dataList[currentIndex - 1] : undefined;
  const goToPrevious = () => {
    if (!previousItem) return;

    router.push({
      pathname: "/(tab)/medicalHis/detail/[id]",
      params: {
        id: String(previousItem.id),
        disease: String(disease ?? ""),
      },
    });
  };

  const goToNext = () => {
    if (!nextItem) return;

    router.push({
      pathname: "/(tab)/medicalHis/detail/[id]",
      params: {
        id: String(nextItem.id),
        disease: String(disease ?? ""),
      },
    });
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.backWrapper}>
            <BackButton
              targetPath={`/(tab)/medicalHis?disease=${disease}`}
            />
          </View>
          <Text style={styles.title}>
            {isVaccine ? "รายละเอียดวัคซีน" : "ประวัติการรักษา"}
          </Text>
        </View>
        {isVaccine ? (
          <>
            <View style={styles.card}>
              <View
                style={[
                  styles.statusBadge,
                  styles.statusTopRight,
                  { backgroundColor: vaccineItem!.statusColor },
                ]}
              >
                <Text style={styles.statusText}>
                  {vaccineItem!.status}
                </Text>
              </View>
              <Text style={styles.cardTitle}>
                {vaccineItem!.vaccineType}
              </Text>
              <Text style={styles.text}>
                ชื่อวัคซีน : {vaccineItem!.vaccineName}
              </Text>
              <Text style={styles.text}>
                อายุที่ควรได้รับ : {vaccineItem!.recommendedAge}
              </Text>
              <Text style={styles.text}>
                วันที่ได้รับ : {vaccineItem!.receiveDate}
              </Text>
              <Text style={styles.text}>
                ผลข้างเคียง : {vaccineItem!.sideEffect}
              </Text>
              <Text style={styles.text}>
                คำแนะนำ : {vaccineItem!.recommendation}
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                ครั้งที่ {medicalItem!.no}
              </Text>
              <Text style={styles.text}>
                วันที่ตรวจ : {medicalItem!.date}
              </Text>
              <Text style={styles.text}>
                ผู้ตรวจ : {medicalItem!.doctor}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                ตรวจร่างกายทั่วไป
              </Text>
              <Text style={styles.text}>
                ชีพจร : {medicalItem!.pulse} ครั้ง/นาที   น้ำหนัก : {medicalItem!.weight} กก.
              </Text>
              <Text style={styles.text}>
                ความดัน : {medicalItem!.pressure}
              </Text>
              <Text style={styles.text}>
                ความสูง : {medicalItem!.height}
              </Text>
              <Text style={styles.text}>
                BMI : {medicalItem!.bmi}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>การรักษา</Text>
              <Text style={styles.text}>
                {medicalItem!.treatment}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.text}>
                อาการ : {medicalItem!.symptom}
              </Text>
              <Text style={styles.text}>
                น้ำตาล : {medicalItem!.sugar}
              </Text>
              <View style={styles.statusRow}>
                <Text style={styles.text}>สถานะ : </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: medicalItem!.statusColor },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {medicalItem!.status}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {!isVaccine && (
        <View style={styles.bottomButton}>
          <TouchableOpacity
            style={[styles.navButton, !previousItem && styles.disabledButton]}
            disabled={!previousItem}
            onPress={goToPrevious}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="caret-back-outline" size={22} color="#05548D" />
              <Text style={styles.navText}>นัดครั้งก่อน</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, !nextItem && styles.disabledButton]}
            disabled={!nextItem}
            onPress={goToNext}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.navText}>นัดถัดไป</Text>
              <Ionicons name="caret-forward-outline" size={22} color="#05548D" />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/* ------------------ STYLE ------------------ */
const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#EBF7FF" },
  container: { flex: 1, paddingHorizontal: 16 },

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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    position: "relative",
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

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusTopRight: {
    position: "absolute",
    top: 12,
    right: 12,
  },

  statusText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "IBMPlexSansThai_600SemiBold",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
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

  disabledButton: { opacity: 0.4 },

  navText: {
    fontSize: 18,
    color: "#05548D",
    fontFamily: "IBMPlexSansThai_700Bold",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6, 
  },
});