import BackButton from "@/components/backButton";
import { api } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RescheduleScreen() {
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentApiDate, setCurrentApiDate] = useState<Date | null>(null);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [diseaseId, setDiseaseId] = useState<string | null>(null);
  const [appointId, setAppointId] = useState<string | null>(null);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const { disease_id, appoint_id } = useLocalSearchParams();
  useEffect(() => {
    if (disease_id) {
      setDiseaseId(disease_id as string);
    }
  }, [disease_id, appoint_id]);

  const daysArray = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!disease_id) return;

        const appointmentRes = await api.get("/v1/patient/appointments");

        const appointList = appointmentRes.data?.data?.appoint;
        if (!appointList || appointList.length === 0) return;

        const selected = appointList.find(
          (a: any) => a.disease_id === disease_id
        );

        if (!selected) {
          console.log("ไม่เจอ disease_id ที่ตรง");
          return;
        }

        setDiseaseId(selected.disease_id);
        setAppointId(selected.appoint_id);

        const scheduleRes = await api.get(
          `/v1/patient/appointments/schedule/${selected.disease_id}`
        );

        const currentDateStr = scheduleRes.data?.data?.current_date;
        const available = scheduleRes.data?.data?.available_days || [];

        setAvailableDays(available);

        if (currentDateStr) {
          const date = new Date(currentDateStr);
          setCurrentApiDate(date);
          setCurrentDate(date);
        }

      } catch (err) {
        console.log("fetch error:", err);
      }
    };

    fetchData();
  }, [disease_id]);

  const dayMap: Record<string, string> = {
    Sunday: "อา",
    Monday: "จ",
    Tuesday: "อ",
    Wednesday: "พ",
    Thursday: "พฤ",
    Friday: "ศ",
    Saturday: "ส",
  };

  const isAvailableDay = (day: number) => {
    const date = new Date(year, month, day);

    const thaiDays = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
    const thaiDay = thaiDays[date.getDay()];

    const allowedThaiDays = availableDays.map((d) => dayMap[d]);

    return allowedThaiDays.includes(thaiDay);
  };

  const changeMonth = (diff: number) => {
    const newDate = new Date(year, month + diff, 1);
    setCurrentDate(newDate);
    setSelectedDate(null);
    setSelectedTime(null);
  };
  const formatThaiDate = (date: Date) => {
    const months = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];

    return `${date.getDate()} ${months[date.getMonth()]
      } ${date.getFullYear() + 543}`;
  };

  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const timeSlots = [
    { start: "08:30", end: "09:30" },
    { start: "09:30", end: "10:30" },
    { start: "10:30", end: "11:30" },
    { start: "13:30", end: "14:30" },
  ];

  const toggleTime = (slot: { start: string; end: string }) => {
    if (
      selectedTime?.start === slot.start &&
      selectedTime?.end === slot.end
    ) {
      setSelectedTime(null);
    } else {
      setSelectedTime(slot);
    }
  };

  const hasSelectedTime = selectedTime !== null;
  const isDisabled = !selectedDate || !selectedTime;

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
        router.replace("/home");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);
  const handleSubmit = async () => {
    try {

      if (!selectedTime || !selectedDate) return;

      await api.post("/v1/patient/appointments/delay", {
        disease_id: diseaseId,
        date: formatDateForAPI(selectedDate),
        start_time: selectedTime.start,
        end_time: selectedTime.end,
      });

      setShowModal(true);
    } catch (err) {
      console.log("delay error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.headerBar}>
          <BackButton />
          <Text style={styles.title}>เลื่อนนัด</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.calendar}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <Text style={styles.font}>{"<"}</Text>
              </TouchableOpacity>

              <View style={styles.headerCenter}>
                <Text style={styles.monthText}>
                  {currentDate.toLocaleString("th-TH", {
                    month: "long",
                    year: "numeric",
                  })}
                </Text>

                {selectedDate && (
                  <Text style={styles.selectedDateText}>
                    {formatThaiDate(selectedDate)}
                  </Text>
                )}
              </View>

              <TouchableOpacity onPress={() => changeMonth(1)}>
                <Text style={styles.font}>{">"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.grid}>
              {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => (
                <Text key={d} style={styles.dayLabel}>{d}</Text>
              ))}

              {daysArray.map((day, index) => {
                const isSelected =
                  day !== null &&
                  selectedDate &&
                  day === selectedDate.getDate() &&
                  month === selectedDate.getMonth() &&
                  year === selectedDate.getFullYear();

                const isCurrentApiDate =
                  day !== null &&
                  currentApiDate &&
                  day === currentApiDate.getDate() &&
                  month === currentApiDate.getMonth() &&
                  year === currentApiDate.getFullYear();

                const isAvailable =
                  day !== null &&
                  (isAvailableDay(day) || isCurrentApiDate);

                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.dayBox}
                    disabled={!day || !isAvailable}
                    onPress={() => {
                      setSelectedDate(new Date(year, month, day!));
                      setSelectedTime(null);
                    }}
                  >
                    <View
                      style={[
                        styles.dayInner,
                        isSelected && styles.daySelected,
                        isCurrentApiDate && styles.dayCurrent,
                        !isAvailable && styles.dayDisabled
                      ]}
                    >
                      <Text
                        style={[
                          styles.font,
                          isSelected && { color: "white" },
                          !isAvailable && { color: "#ccc" },
                        ]}
                      >
                        {day || ""}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Text style={styles.sectionTitle}>เลือกช่วงเวลา</Text>

          {timeSlots.map((slot) => {
            const label = `${slot.start} - ${slot.end}`;

            const selected =
              selectedTime?.start === slot.start &&
              selectedTime?.end === slot.end;

            return (
              <TouchableOpacity
                key={label}
                disabled={hasSelectedTime && !selected}
                style={[
                  styles.timeItem,
                  hasSelectedTime && !selected && styles.timeDisabled,
                ]}
                onPress={() => toggleTime(slot)}
              >
                <View style={styles.timeRow}>
                  <View
                    style={[
                      styles.circle,
                      selected && styles.circleSelected,
                    ]}
                  >
                    {selected && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>

                  <Text style={styles.timeText}>{label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          disabled={isDisabled}
          onPress={handleSubmit}
          style={[
            styles.button,
            isDisabled && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>ยืนยันการเลื่อนนัด</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.iconOuter}>
              <View style={styles.iconInner}>
                <Ionicons name="checkmark" size={32} color="white" />
              </View>
            </View>

            <Text style={styles.modalTitle}>ระบบได้ส่งคำขอ</Text>
            <Text style={styles.modalTitle}>
              การเลื่อนนัดเรียบร้อยแล้ว
            </Text>

            <Text style={styles.modalDesc}>
              ระบบจะทำการแจ้งเตือนเมื่อคำขอได้รับอนุมัติแล้ว
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------- STYLE ---------- */
const styles = StyleSheet.create({
  font: {
    fontFamily: "IBMPlexSansThai_500Medium",
  },

  container: {
    flex: 1,
    backgroundColor: "#EBF7FF",
  },

  wrapper: {
    flex: 1,
    justifyContent: "space-between",
  },

  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 20,
  },

  title: {
    fontSize: 24,
    fontFamily: "IBMPlexSansThai_600Semibold",
  },

  content: {
    padding: 16,
  },

  calendar: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  headerCenter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 12,
  },

  monthText: {
    fontSize: 16,
    fontFamily: "IBMPlexSansThai_500Medium",
  },

  selectedDateText: {
    fontSize: 14,
    color: "#05548D",
    textAlign: "right",
    fontFamily: "IBMPlexSansThai_500Medium",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dayLabel: {
    width: "14.28%",
    textAlign: "center",
    marginBottom: 5,
    fontFamily: "IBMPlexSansThai_500Medium",
  },

  dayBox: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  dayInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  daySelected: {
    backgroundColor: "#58AD46",
  },

  sectionTitle: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: "IBMPlexSansThai_600Semibold",
  },

  timeItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
  },

  timeDisabled: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBCBCB",
  },
  circleDisabled: {
    borderColor: "#CBCBCB",
  },

  textDisabled: {
    color: "#CBCBCB",
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#05548D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  circleSelected: {
    backgroundColor: "#58AD46",
    borderColor: "#58AD46",
  },

  timeText: {
    fontSize: 15,
    fontFamily: "IBMPlexSansThai_500Medium",
  },

  button: {
    backgroundColor: "#1E5B89",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    margin: 16,
  },

  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "IBMPlexSansThai_600Semibold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    alignItems: "center",
  },

  iconOuter: {
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: "#C8E6C9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  iconInner: {
    width: 70,
    height: 70,
    borderRadius: 999,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "IBMPlexSansThai_600Semibold",
  },

  modalDesc: {
    marginTop: 8,
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    fontFamily: "IBMPlexSansThai_500Medium",
  },
  dayCurrent: {
    backgroundColor: "#CBCBCB",
  },
  dayDisabled: {
    backgroundColor: "#F3F4F6",
  },
});