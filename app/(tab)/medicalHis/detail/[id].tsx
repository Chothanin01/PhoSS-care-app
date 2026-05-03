import BackButton from "@/components/backButton";
import { api } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MedicalHistoryDetailPage() {
  const { id, disease_id, disease_name } = useLocalSearchParams<{
    id: string;
    disease_id: string;
    disease_name: string;
    appoint_id: string;
  }>();
  const isVaccine = disease_name?.includes("วัคซีน");
  const formatDateThai = (dateStr: string) => {
    if (!dateStr || dateStr === "0001-01-01") return "ไม่ระบุวันที่";

    const date = new Date(dateStr);

    const day = date.getDate();

    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    const month = months[date.getMonth()];
    const year = date.getFullYear() + 543;

    return `${day} ${month} ${year}`;
  };

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const getToken = async () => {
    return await AsyncStorage.getItem("token");
  };

  useEffect(() => {
    if (!id) return;

    if (isVaccine) {
      fetchVaccineDetail(id);
    } else {
      fetchMedicalDetail(id);
    }
  }, [id, disease_name]);
  const fetchVaccineDetail = async (vaccineId: string) => {
    try {
      setLoading(true);
      const token = await getToken();

      const res = await api.get(`/v1/patient/vaccine/${vaccineId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const item = res.data.data;

      setData({
        id: item.id,
        vaccineType: item.type,
        vaccineName: item.name,
        recommendedAge: item.age,
        receiveDate: item.vaccinated_date || "ยังไม่ได้รับ",
        sideEffect: item.effect,
        recommendation: item.note,

        status:
          item.vaccinated_status === "completed"
            ? "ได้รับวัคซีนเเล้ว"
            : item.vaccinated_status === "pending"
              ? "รอรับวัคซีน"
              : "ยังไม่ได้รับวัคซีน",

        statusColor:
          item.vaccinated_status === "completed"
            ? "#58AD46"
            : item.vaccinated_status === "pending"
              ? "#FFD57B"
              : "#FF0505",
      });
    } catch (err) {
      console.log("vaccine detail error:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchMedicalDetail = async (appointId: string) => {
    try {
      setLoading(true);
      const token = await getToken();

      const res = await api.get(
        `/v1/patient/appointments/history/detail/${appointId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const item = res.data.data;

      setData({
        id: item.appoint_id,
        no: item.no,
        date:
          item.date === "0001-01-01"
            ? "ไม่ระบุวันที่"
            : item.date,
        doctor: item.doctor,
        treatment: item.note || "-",
        purpose: item.purpose,
        symptom: item.symptom || "-",
        pulse: item.health?.pulse || "-",
        pressure: item.health?.pressure || "-",
        height: item.health?.height || "-",
        weight: item.health?.weight || "-",
        bmi: item.health?.bmi || "-",
        sugar: item.health?.sugar || "-",
        nextId: item.next_appoint_id,
        prevId: item.prev_appoint_id,
      });
    } catch (err) {
      console.log("medical detail error:", err);
    } finally {
      setLoading(false);
    }
  };
  const goToPrevious = () => {
    if (!data?.prevId) return;

    router.push({
      pathname: "/(tab)/medicalHis/detail/[id]",
      params: {
        id: data.prevId,
        disease_id: String(disease_id),
        disease_name: String(disease_name),
      },
    });
  };

  const goToNext = () => {
    if (!data?.nextId) return;

    router.push({
      pathname: "/(tab)/medicalHis/detail/[id]",
      params: {
        id: data.nextId,
        disease_id: String(disease_id),
        disease_name: String(disease_name),
      },
    });
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.backWrapper}>
            <BackButton
              targetPath={`/(tab)/medicalHis?disease_id=${disease_id}&disease_name=${disease_name}`}
            />
          </View>
          <Text style={styles.title}>
            {isVaccine ? "รายละเอียดวัคซีน" : "ประวัติการรักษา"}
          </Text>
        </View>
        {isVaccine ? (
          <View style={styles.card}>
            <View
              style={[
                styles.statusBadge,
                styles.statusTopRight,
                { backgroundColor: data.statusColor },
              ]}
            >
              <Text style={styles.statusText}>{data.status}</Text>
            </View>

            <Text style={styles.cardTitle}>{data.vaccineType}</Text>
            <Text style={styles.text}>
              ชื่อวัคซีน : {data.vaccineName}
            </Text>
            <Text style={styles.text}>
              อายุที่ควรได้รับ : {data.recommendedAge}
            </Text>
            <Text style={styles.text}>
              วันที่ได้รับ : {data.receiveDate}
            </Text>
            <Text style={styles.text}>
              ผลข้างเคียง : {data.sideEffect}
            </Text>
            <Text style={styles.text}>
              คำแนะนำ : {data.recommendation}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                ครั้งที่ {data.no}
              </Text>
              <Text style={styles.text}>
                วันที่ตรวจ : {formatDateThai(data.date)}
              </Text>
              <Text style={styles.text}>
                ผู้ตรวจ : {data.doctor}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                ตรวจร่างกายทั่วไป
              </Text>
              <Text style={styles.text}>
                ชีพจร : {data.pulse}  ครั้ง/นาที         น้ำหนัก : {data.weight} กก.
              </Text>
              <Text style={styles.text}>
                ความดัน : {data.pressure} มม./ปรอท
              </Text>
              <Text style={styles.text}>
                ส่วนสูง : {data.height} ซม.
              </Text>
              <Text style={styles.text}>
                ดัชนีมวลกาย : {data.bmi} กก./ม²
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>การรักษา</Text>
              <Text style={styles.text}>{data.purpose}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.text}>
                อาการ : {data.symptom}
              </Text>
              <Text style={styles.text}>
                ระดับน้ำตาล : {data.sugar} มก./ดล.
              </Text>
              <View style={styles.statusRow}>
                <Text style={styles.text}>สถานะ : </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: data.statusColor },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {data.status}
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
            style={[
              styles.navButton,
              !data.prevId && styles.disabledButton,
            ]}
            disabled={!data.prevId}
            onPress={goToPrevious}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="caret-back-outline" size={22} color="#05548D" />
              <Text style={styles.navText}>นัดครั้งก่อน</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              !data.nextId && styles.disabledButton,
            ]}
            disabled={!data.nextId}
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
    fontSize: 16,
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