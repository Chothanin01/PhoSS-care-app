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

export default function MedicalHisPage() {
  const { disease_id, disease_name } = useLocalSearchParams<{
    disease_id: string;
    disease_name: string;
  }>();
  const isVaccine = disease_name === "วัคซีน";
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [filter, setFilter] = useState("ทั้งหมด");
  const [open, setOpen] = useState(false);
  const [vaccineData, setVaccineData] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (isVaccine) fetchVaccine(1);
    else if (disease_id) fetchHistory();
  }, [disease_id]);

  const getToken = async () => {
    return await AsyncStorage.getItem("token");
  };

  /* ---------------- VACCINE API ---------------- */
  const fetchVaccine = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const token = await getToken();

      const res = await api.get("/v1/patient/vaccine", {
        params: {
          page: pageNumber,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { vaccines, total_pages } = res.data.data;

      const formatted = vaccines.map((item: any) => ({
        id: item.vaccine_id,
        vaccineType: item.type,
        vaccineName: item.name,
        receiveDate: item.vaccinated_date
          ? formatDateThai(item.vaccinated_date)
          : "ยังไม่กำหนด",
        recommendedAge: item.age,

        status:
          item.vaccinated_status === "completed"
            ? "ได้รับวัคซีนเเล้ว"
            : item.vaccinated_status === "pending"
              ? "รอรับวัคซีน"
              : "ยังไม่ได้รับวัคซีน",

        ColorStatus:
          item.vaccinated_status === "completed"
            ? "#58AD46"
            : item.vaccinated_status === "pending"
              ? "#FFD57B"
              : "#FF0505",
      }));

      setVaccineData(formatted);
      setTotalPage(total_pages);
      setPage(pageNumber);
    } catch (err) {
      console.log("vaccine error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HISTORY API ---------------- */
  const fetchHistory = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!disease_id) {
        console.log("ไม่พบ disease_id");
        return;
      }

      const res = await api.get(
        `/v1/patient/appointments/history/${disease_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formatted = res.data.data.appointments.map((item: any) => ({
        id: item.appoint_id,
        no: item.no,
        date:
          item.date === "0001-01-01"
            ? "ไม่ระบุวันที่"
            : item.date,
        Note: item.note || "-",
        DoctorName: item.doctor,
        status:
          item.color_status === "dark_green"
            ? "สีเขียวเข้ม"
            : item.color_status === "yellow"
              ? "สีเหลือง"
              : item.color_status === "orange"
                ? "สีส้ม"
                : item.color_status === "red"
                  ? "สีแดง"
                  : "ไม่ระบุ",


        ColorStatus:
          item.color_status === "dark_green"
            ? "#2E7D32"
            : item.color_status === "yellow"
              ? "#FFD57B"
              : item.color_status === "orange"
                ? "#FF9800"
                : item.color_status === "red"
                  ? "#FF0505"
                  : "#E5E7EB",
      }));

      setHistoryData(formatted);
    } catch (error) {
      console.log("fetch history error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredVaccine = vaccineData.filter((item) => {
    if (filter === "ทั้งหมด") return true;
    return item.status === filter;
  });

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.backWrapper}>
            <BackButton targetPath={`/(tab)/home`} />
          </View>
          <Text style={styles.title}>
            {isVaccine ? "วัคซีน" : disease_name || "ไม่พบข้อมูลโรค"}
          </Text>
        </View>
        {isVaccine && (
          <View style={{ marginBottom: 12, zIndex: 10 }}>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setOpen(!open)}
            >
              <Text style={styles.dropdownText}>{filter}</Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="#05548D"
                style={{
                  transform: [{ rotate: open ? "180deg" : "0deg" }],
                }}
              />
            </TouchableOpacity>
            {open && (
              <View style={styles.dropdownMenu}>
                {[
                  "ทั้งหมด",
                  "ได้รับวัคซีนเเล้ว",
                  "รอรับวัคซีน",
                  "ยังไม่ได้รับวัคซีน",
                ].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setFilter(item);
                      fetchVaccine(1);
                      setOpen(false);
                    }}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {isVaccine &&
          filteredVaccine.map((item) => (
            <View key={item.id} style={styles.card}>
              <View
                style={[
                  styles.statusBadge,
                  styles.statusTopRight,
                  { backgroundColor: item.ColorStatus },
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>

              <Text style={styles.visitTitle}>{item.vaccineType}</Text>
              <Text style={styles.text}>
                ชื่อวัคซีน : {item.vaccineName}
              </Text>
              <Text style={styles.text}>
                อายุที่ควรได้รับ : {item.recommendedAge}
              </Text>

              <View style={styles.bottomRow}>
                <Text style={styles.text}>
                  วันที่ได้รับ : {item.receiveDate}
                </Text>

                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={() =>
                    router.push({
                      pathname: "/(tab)/medicalHis/detail/[id]",
                      params: {
                        id: String(item.id),
                        disease_id: String(disease_id),
                        disease_name: String(disease_name),
                      }
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
        {!isVaccine &&
          historyData.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.visitTitle}>
                  ครั้งที่ {item.no}
                </Text>
                <Text style={styles.date}>{formatDateThai(item.date)}</Text>
              </View>

              <Text style={styles.text}>
                การรักษา : {item.Note}
              </Text>

              {disease_name !== "วัณโรค" && (
                <View style={styles.statusRow}>
                  <Text style={styles.text}>สถานะ : </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: item.ColorStatus },
                    ]}
                  >
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>
              )}

              <View style={styles.bottomRow}>
                <Text style={styles.text}>
                  ผู้ตรวจ : {item.DoctorName}
                </Text>

                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={() =>
                    router.push({
                      pathname: "/(tab)/medicalHis/detail/[id]",
                      params: {
                        id: String(item.id),
                        disease_id: String(disease_id),
                        disease_name: String(disease_name),
                      }
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
        <View style={styles.pagination}>
          <TouchableOpacity
            disabled={page === 1}
            onPress={() => fetchVaccine(page - 1)}
            style={[styles.pageButton, page === 1 && { opacity: 0.4 }]}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="caret-back-outline" size={22} color="#05548D" />
              <Text style={styles.navText}>ย้อนกลับ</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.text}>
            {page} / {totalPage}
          </Text>

          <TouchableOpacity
            disabled={page >= totalPage}
            onPress={() => fetchVaccine(page + 1)}
            style={[
              styles.pageButton,
              page >= totalPage && { opacity: 0.4 },
            ]}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.navText}>ต่อไป</Text>
              <Ionicons name="caret-forward-outline" size={22} color="#05548D" />
            </View>

          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------ STYLE ------------------ */
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#EBF7FF",
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
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
    fontSize: 24,
    fontFamily: "IBMPlexSansThai_600Semibold",
  },

  subTitle: {
    fontSize: 22,
    fontFamily: "IBMPlexSansThai_700Bold",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    position: "relative",
  },

  visitTitle: {
    fontSize: 20,
    fontFamily: "IBMPlexSansThai_600SemiBold",
  },

  text: {
    fontSize: 16,
    fontFamily: "IBMPlexSansThai_500Medium",
    marginTop: 8,
  },

  date: {
    fontSize: 14,
    fontFamily: "IBMPlexSansThai_500Medium",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusTopRight: {
    position: "absolute",
    top: 12,
    right: 10,
  },

  statusText: {
    color: "#000000",
    fontSize: 14,
    fontFamily: "IBMPlexSansThai_600SemiBold",
  },


  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    alignItems: "center",
  },

  dropdown: {
    alignSelf: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#05548D",
    marginBottom: 8,
  },

  dropdownText: {
    fontSize: 16,
    fontFamily: "IBMPlexSansThai_500Medium",
  },

  dropdownMenu: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    fontFamily: "IBMPlexSansThai_500Medium",
  },
  arrowButton: {
    marginLeft: 8,
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },

  pageButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
  },
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