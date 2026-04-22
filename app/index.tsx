import { api } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [citizenId, setCitizenId] = useState("");
  const [password, setPassword] = useState("");
  const [citizenError, setCitizenError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword] = useState(false);
  const [focusField, setFocusField] = useState<
    "citizen" | "password" | null
  >(null);

  const validateCitizenId = (id: string) => /^\d{13}$/.test(id);
  const handleLogin = async () => {
    let valid = true;

    setCitizenError("");
    setPasswordError("");

    if (!validateCitizenId(citizenId)) {
      setCitizenError("เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก");
      valid = false;
    }

    if (!password) {
      setPasswordError("กรุณากรอกรหัสผ่าน");
      valid = false;
    }

    if (!valid) return;

    try {
      await AsyncStorage.removeItem("token");

      console.log("LOGIN INPUT:", citizenId);

      const res = await api.post("/v1/auth/patient/login", {
        username: citizenId.trim(),
        password: password.trim(),
      });

      console.log("LOGIN SUCCESS:", res.data);

      const { token } = res.data;

      await AsyncStorage.setItem("token", token);
      const savedToken = await AsyncStorage.getItem("token");
      console.log("TOKEN SAVED:", savedToken);

      router.replace("/home");

    } catch (err: any) {
      console.log("ERROR:", err);
      console.log("ERROR RESPONSE:", err.response?.data);

      if (err.response) {
        const message = err.response.data?.message;

        if (message === "USER_NOT_FOUND") {
          setCitizenError("ไม่พบผู้ใช้");
        } else if (message === "INVALID_PASSWORD") {
          setPasswordError("รหัสผ่านไม่ถูกต้อง");
        } else {
          alert(message || "เกิดข้อผิดพลาด");
        }
      } else {
        alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("@/assets/images/PhossLogo-removebg-preview.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>โรงพยาบาลโพธิ์ศรีสุวรรณ</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>เข้าสู่ระบบ</Text>
        <Text style={styles.label}>Username (เลขบัตรประชาชน)</Text>
        <View
          style={[
            styles.inputWrapper,
            focusField === "citizen" && styles.focusBorder,
            citizenError && styles.errorBorder,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="กรุณากรอกเลขบัตรประชาชน"
            placeholderTextColor="rgba(0,0,0,0.4)"
            value={citizenId}
            onChangeText={setCitizenId}
            keyboardType="numeric"
            onFocus={() => setFocusField("citizen")}
            onBlur={() => setFocusField(null)}
          />
        </View>
        {citizenError !== "" && (
          <Text style={styles.errorText}>{citizenError}</Text>
        )}
        <Text style={styles.label}>รหัสผ่าน</Text>
        <View
          style={[
            styles.inputWrapper,
            focusField === "password" && styles.focusBorder,
            passwordError && styles.errorBorder,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="กรุณากรอกรหัสผ่าน"
            placeholderTextColor="rgba(0,0,0,0.4)"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusField("password")}
            onBlur={() => setFocusField(null)}
          />
        </View>
        {passwordError !== "" && (
          <Text style={styles.errorText}>{passwordError}</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF7FF",
    alignItems: "center",
    padding: 20,
  },

  logo: {
    width: 180,
    height: 180,
    marginBottom: 10,
    marginTop: 50,
  },

  title: {
    fontSize: 28,
    marginBottom: 20,
    marginTop: 20,
    color: "#000",
    fontFamily: "IBMPlexSansThai_700Bold",
  },

  card: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },

  cardTitle: {
    textAlign: "center",
    fontSize: 22,
    color: "#05548D",
    marginBottom: 20,
    marginTop: 20,
    fontFamily: "IBMPlexSansThai_700Bold",
  },

  label: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
    color: "#000",
    fontFamily: "IBMPlexSansThai_600Semibold",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#05548D",
    borderRadius: 5,
    backgroundColor: "#FFF",
  },

  focusBorder: {
    borderColor: "#05548D",
    borderWidth: 2,
  },

  errorBorder: {
    borderColor: "red",
  },

  input: {
    flex: 1,
    padding: 12,
    fontFamily: "IBMPlexSansThai_400Regular",
  },

  inputPassword: {
    flex: 1,
    padding: 12,
    fontFamily: "IBMPlexSansThai_400Regular",
  },

  passwordWrapper: {
    justifyContent: "space-between",
  },

  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },

  button: {
    backgroundColor: "#05548D",
    padding: 12,
    borderRadius: 9,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#05548D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "IBMPlexSansThai_700Bold",
  },
});