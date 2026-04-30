import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "@/components/backButton";

type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: "medical" | "normal";
};

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "ใบรับรองแพทย์",
      description: "ระบบได้ยื่นคำขอใบรับรองแพทย์ไปแล้ว",
      time: "5 นาทีที่ผ่านมา",
      isRead: false,
      type: "medical",
    },
    {
      id: 2,
      title: "เอกสารรับรอง",
      description: "ระบบได้ยื่นคำขอเอกสารไปแล้ว",
      time: "10 ชั่วโมงก่อน",
      isRead: true,
      type: "normal",
    },
    {
      id: 3,
      title: "การเลื่อนนัด",
      description: "ระบบได้ยืนยันการเลื่อนนัดของคุณแล้ว",
      time: "18 ชั่วโมงก่อน",
      isRead: true,
      type: "normal",
    },
    {
      id: 4,
      title: "คุณมีนัดในอีก 2 วันข้างหน้า",
      description: "มะรืนคุณมีนัดกับนพ. สมชาย เวลา 13:00 น.",
      time: "2 วันที่แล้ว",
      isRead: true,
      type: "normal",
    },
    {
      id: 5,
      title: "การเลื่อนนัด",
      description: "ระบบได้ปฏิเสธการเลื่อนนัดของคุณ กรุณาเลื่อนนัดใหม่อีกครั้ง",
      time: "5 วันที่แล้ว",
      isRead: false,
      type: "normal",
    },
    {
      id: 6,
      title: "เอกสารรับรอง",
      description: "โรงพยาบาลได้เตรียมเอกสารของคุณเเล้ว",
      time: "6 วันที่แล้ว",
      isRead: true,
      type: "normal",
    },
  ]);

  const handlePress = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((noti) =>
        noti.id === item.id ? { ...noti, isRead: true } : noti
      )
    );

    if (item.type === "medical") {
      router.push("/document");
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
              targetPath={`/(tab)/home`}
            />
          </View>

          <Text style={styles.title}>
            การแจ้งเตือน
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {notifications.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                {
                  backgroundColor: item.isRead ? "#EDEDED" : "#FFFFFF",
                },
              ]}
              activeOpacity={0.8}
              onPress={() => handlePress(item)}
            >
              <View style={styles.leftSection}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="bag-add-outline"
                    size={22}
                    color="#0B5EA8"
                  />
                </View>

                <View style={styles.textSection}>
                  <Text style={styles.titleNoti}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </View>

              <View style={styles.rightSection}>
                <Text style={styles.time}>{item.time}</Text>
              </View>

            </TouchableOpacity>
            {!item.isRead && <View style={styles.redDot} />}
            </View>
          ))}
        </ScrollView>
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

  scrollContent: {
    paddingBottom: 30,
    paddingTop: 6,
    paddingHorizontal: 2,
  },

  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  leftSection: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    alignSelf: "center",
  },

  textSection: {
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontFamily: "IBMPlexSansThai_700Bold",
    textAlign: "center",
    marginLeft: 24,
    marginTop: 6,
  },

  description: {
    fontSize: 13,
    fontFamily: "IBMPlexSansThai_400Regular",
    color: "#666",
    lineHeight: 18,
  },

  rightSection: {
    alignItems: "flex-end",
    marginLeft: 10,
  },

  time: {
    fontFamily: "IBMPlexSansThai_400Regular",
    fontSize: 13,
    color: "#999",
    marginBottom: 6,
  },

  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    position: "absolute",
    top: -4,
    right: 3,
  },

  titleNoti: {
    fontSize: 18,
    fontFamily: "IBMPlexSansThai_600SemiBold",
  },

  cardWrapper: {
    marginBottom: 12,
    position: "relative",
  },
});