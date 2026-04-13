import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const daysArray = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const changeMonth = (diff: number) => {
    const newDate = new Date(year, month + diff, 1);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };
  const formatThaiDate = (day: number) => {
    const months = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];

    const date = new Date(year, month, day);
    const d = date.getDate();
    const m = months[date.getMonth()];
    const y = date.getFullYear() + 543;

    return `${d} ${m} ${y}`;
  };

  const timeSlots = [
    "08:30 - 09:30",
    "09:30 - 10:30",
    "10:30 - 11:30",
    "13:30 - 14:30",
  ];

  const toggleTime = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const isDisabled = !selectedDate || selectedTimes.length === 0;

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
        router.replace("/home");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showModal]);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <Text style={styles.title}>เลื่อนนัด</Text>
          <View style={styles.calendar}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <Text>{"<"}</Text>
              </TouchableOpacity>

              <Text style={styles.monthText}>
                {currentDate.toLocaleString("th-TH", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              {selectedDate && (
                <Text style={styles.selectedDateText}>
                  วันที่ {formatThaiDate(selectedDate)}
                </Text>
              )}
              <TouchableOpacity onPress={() => changeMonth(1)}>
                <Text>{">"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.grid}>
              {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => (
                <Text key={d} style={styles.dayLabel}>{d}</Text>
              ))}

              {daysArray.map((day, index) => {
                const isSelected = day !== null && day === selectedDate;

                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.dayBox}
                    disabled={!day}
                    onPress={() => day && setSelectedDate(day)}
                  >
                    <View
                      style={[
                        styles.dayInner,
                        isSelected && styles.daySelected,
                      ]}
                    >
                      <Text style={isSelected && { color: "white" }}>
                        {day || ""}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <Text style={styles.sectionTitle}>เลือกช่วงเวลา</Text>

          {timeSlots.map((time) => {
            const selected = selectedTimes.includes(time);

            return (
              <TouchableOpacity
                key={time}
                style={styles.timeItem}
                onPress={() => toggleTime(time)}
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
                  <Text style={styles.timeText}>{time}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          disabled={isDisabled}
          onPress={() => setShowModal(true)}
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
                <Ionicons name="checkmark" size={30} color="white" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF7FF",
  },
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    padding: 16,
  },
  title: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  calendar: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  monthText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayLabel: {
    width: "14.28%",
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
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
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  sectionTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
  },
  timeItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
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
    fontWeight: "600",
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
    backgroundColor: "#DCFCE7",
    padding: 10,
    borderRadius: 999,
    marginBottom: 16,
  },
  iconInner: {
    backgroundColor: "#58AD46",
    padding: 8,
    borderRadius: 999,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  modalDesc: {
    marginTop: 8,
    fontSize: 13,
    color: "#E1E1E1",
    textAlign: "center",
  },
  selectedDateText: {
    textAlign: "right",
    marginTop: 4,
    fontSize: 14,
    color: "#05548D",
    fontWeight: "600",
  },
});