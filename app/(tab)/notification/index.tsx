import BackButton from "@/components/backButton";
import { api } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type NotificationItem = {
  id: string;
  header: string;
  body: string;
  created_at: string;
  is_read: boolean;
  disease_id?: string;
};

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const getNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        return;
      }

      const res = await api.get("/v1/patient/noti",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(res.data.data);

    } catch (err) {
      console.log("fetch error:", err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/v1/patient/noti/${id}/read`);
    } catch (err) {
      console.log("mark read error:", err);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const handlePress = async (item: NotificationItem) => {
    await markAsRead(item.id);

    setNotifications((prev) =>
      prev.map((noti) =>
        noti.id === item.id ? { ...noti, is_read: true } : noti
      )
    );

    if (item.header === "การเลื่อนนัด" && item.disease_id) {
      router.push(`/(tab)/home/appointment/${item.disease_id}`);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);

    const diffMs = now.getTime() - created.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "เมื่อสักครู่";
    if (diffMin < 60) return `${diffMin} นาทีที่ผ่านมา`;
    if (diffHour < 24) return `${diffHour} ชั่วโมงที่ผ่านมา`;
    if (diffDay < 7) return `${diffDay} วันที่ผ่านมา`;

    return created.toLocaleDateString("th-TH");
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
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

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {notifications.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              <TouchableOpacity
                style={[
                styles.card,
                {
                  backgroundColor: item.is_read ? "#EDEDED" : "#FFFFFF",
                },
              ]}
              activeOpacity={0.8}
              onPress={() => handlePress(item)}
              >
                <View style={styles.leftSection}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name="notifications-outline"
                      size={22}
                      color="#0B5EA8"
                    />
                  </View>

                  <View style={styles.textSection}>
                    <Text style={styles.titleNoti}>{item.header}</Text>
                    <Text style={styles.description}>{item.body}</Text>
                  </View>
                </View>

                <View style={styles.rightSection}>
                  <Text style={styles.time}>{formatTimeAgo(item.created_at)}</Text>
                </View>

              </TouchableOpacity>

              {!item.is_read && <View style={styles.redDot} />}
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
    fontFamily: "Sarabun_700Bold",
    textAlign: "center",
    marginLeft: 24,
    marginTop: 6,
  },

  description: {
    fontSize: 13,
    fontFamily: "Sarabun_400Regular",
    color: "#666",
    lineHeight: 18,
  },

  rightSection: {
    alignItems: "flex-end",
    marginLeft: 10,
  },

  time: {
    fontFamily: "Sarabun_400Regular",
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
    fontFamily: "Sarabun_600SemiBold",
  },

  cardWrapper: {
    marginBottom: 12,
    position: "relative",
  },
});