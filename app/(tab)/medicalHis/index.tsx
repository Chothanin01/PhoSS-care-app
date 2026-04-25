import BackButton from "@/components/backButton";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/* ------------------ MOCK โรค ------------------ */
const historyData = [
  {
    id: 10,
    date: "3 ตุลาคม 2568",
    Note: "ผลตรวจ HbA1c ลดลงและอยู่ในเกณฑ์ที่ดี",
    status: "สีเขียว",
    DoctorName: "นางจิต ใจดี",
    ColorStatus: "#58AD46",
  },
  {
    id: 9,
    date: "3 กันยายน 2568",
    Note: "แนะนำให้ปรับพฤติกรรมการรับประทานอาหาร",
    status: "สีเหลือง",
    DoctorName: "นางจิต ใจดี",
    ColorStatus: "#FFD57B",
  },
  {
    id: 8,
    date: "3 มิถุนายน 2568",
    Note: "แนะนำให้ปรับพฤติกรรมการรับประทานอาหาร",
    status: "สีเหลือง",
    DoctorName: "นางจิต ใจดี",
    ColorStatus: "#FFD57B",
  },
];

/* ------------------ MOCK วัคซีน ------------------ */
const vaccineData = [
  {
    id: 1,
    vaccineType: "วัคซีนไข้หวัดใหญ่",
    vaccineName: "Influenza Vaccine",
    receiveDate: "1 มกราคม 2568",
    recommendedAge: "6 เดือนขึ้นไป",
    status: "ได้รับวัคซีนเเล้ว",
    ColorStatus: "#58AD46",
  },
  {
    id: 2,
    vaccineType: "วัคซีนโควิด-19",
    vaccineName: "Pfizer",
    receiveDate: "10 กุมภาพันธ์ 2568",
    recommendedAge: "12 ปีขึ้นไป",
    status: "รอรับวัคซีน",
    ColorStatus: "#FFD57B",
  },
  {
    id: 3,
    vaccineType: "วัคซีนตับอักเสบ B",
    vaccineName: "Hepatitis B",
    receiveDate: "เลยกำหนด",
    recommendedAge: "แรกเกิด",
    status: "ยังไม่ได้รับวัคซีน",
    ColorStatus: "#FF0505",
  },
  {
    id: 4,
    vaccineType: "วัคซีนไข้หวัดใหญ่",
    vaccineName: "Influenza Vaccine",
    receiveDate: "1 มกราคม 2568",
    recommendedAge: "6 เดือนขึ้นไป",
    status: "ได้รับวัคซีนเเล้ว",
    ColorStatus: "#58AD46",
  },
];

export default function MedicalHisPage() {
  const { disease } = useLocalSearchParams<{ disease: string }>();
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;
  const isVaccine = disease === "วัคซีนเด็ก";
  const [filter, setFilter] = useState("ทั้งหมด");
  const [open, setOpen] = useState(false);
  const filteredVaccine = vaccineData.filter((item) => {
    if (filter === "ทั้งหมด") return true;
    return item.status === filter;
  });
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageData = filteredVaccine.slice(start, end);
  const maxPage = Math.ceil(filteredVaccine.length / PAGE_SIZE);
  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.backWrapper}>
            <BackButton targetPath={`/(tab)/home`} />
          </View>
          <Text style={styles.title}>
            {isVaccine ? "วัคซีน" : disease || "ไม่พบข้อมูลโรค"}
          </Text>
        </View>

        {isVaccine && (
          <View style={{ marginBottom: 12, position: "relative", zIndex: 10 }}>
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
          pageData.map((item) => (
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
                        disease: String(disease),
                      },
                    })} >
                  <Ionicons name="arrow-forward-circle-outline" size={24} color="#05548D" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        {!isVaccine &&
          historyData.map((item) => (
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
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <View style={styles.bottomRow}>
                <Text style={styles.text}> ผู้ตรวจ : {item.DoctorName} </Text>
                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={() =>
                    router.push({
                      pathname: "/(tab)/medicalHis/detail/[id]",
                      params: {
                        id: String(item.id),
                        disease: String(disease),
                      },
                    })} >
                  <Ionicons name="arrow-forward-circle-outline" size={24} color="#05548D" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        {isVaccine && (
          <View style={styles.pagination}>
            <TouchableOpacity
              disabled={page === 0}
              onPress={() => setPage(page - 1)}
              style={[styles.pageButton, page === 0 && { opacity: 0.4 }]}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="caret-back-outline" size={22} color="#05548D" />
                <Text style={styles.navText}>ย้อนกลับ</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.text}>
              {page + 1} / {maxPage}
            </Text>

            <TouchableOpacity
              disabled={page + 1 >= maxPage}
              onPress={() => setPage(page + 1)}
              style={[
                styles.pageButton,
                page + 1 >= maxPage && { opacity: 0.4 },
              ]}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.navText}>ต่อไป</Text>
                <Ionicons name="caret-forward-outline" size={22} color="#05548D" />
              </View>
            </TouchableOpacity>
          </View>
        )}
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
    color: "#fff",
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
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    zIndex: 999,
    elevation: 5,
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