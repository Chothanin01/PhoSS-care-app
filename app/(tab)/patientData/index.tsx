import AppButton from "@/components/appButton";
import BackButton from "@/components/backButton";
import { api } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type PatientFullInfo = {
  patient: {
    fullname: string;
    age_years: number;
    age_months: number;
    age_days: number;
    sex: string;
    idcard: string;
    rights: string;
    nationality: string;
    ethnicity: string;
    phone_number: string;
    address: string;
    allergy: string;
    weight: number;
    height: number;
    bmi: number;
  };
  relative: {
    caretaker?: Relative;
    kin?: Relative;
    medicine?: Relative;
  };
  officer: {
    house?: Officer;
    nurse?: Officer;
  }
};

type Relative = {
  fullname: string;
  phonenumber: string;
  address: string;
  role: string;
};

type Officer = {
  fullname: string;
  role: string;
}

export default function PatientDataPage() {
  const { id } = useLocalSearchParams();
  const [fullInfo, setFullInfo] = useState<PatientFullInfo | null>(null);
  const [diseases, setDiseases] = useState<string[]>([]);

  const getSexText = (sex?: string) => {
    switch (sex?.toLowerCase()) {
      case "male":
        return "ชาย";
      case "female":
        return "หญิง";
      default:
        return "-";
    }
  };

  const fetchFullInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await api.get(
        "/v1/patient/fullinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.log("Fetch full info error:", error);
      return null;
    }
  };

  const fetchDiseases = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await api.get("/v1/patient/diseases", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const list = response.data.data.map(
        (d: any) => d.name
      );

      setDiseases(list);
    } catch (error) {
      console.log("Fetch diseases error:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const fullInfo = await fetchFullInfo();
      if (fullInfo) setFullInfo(fullInfo);

      await fetchDiseases();
    };

    loadData();
  }, [id]);

  const isTB = diseases.includes("วัณโรค");

  return (
    <ScrollView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.backWrapper}>
          <BackButton targetPath={`/(tab)/home`}/>
        </View>

        <Text style={styles.title}>
          ข้อมูลผู้ป่วย
        </Text>
      </View>

      {/* Patient Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ข้อมูลผู้ป่วย</Text>

        <Text style={styles.text}>{fullInfo?.patient.fullname}</Text>
        <Text style={styles.text}>
          อายุ : {fullInfo?.patient.age_years} ปี {fullInfo?.patient.age_months} เดือน {fullInfo?.patient.age_days} วัน
          {"    "}เพศ : {getSexText(fullInfo?.patient.sex)}
        </Text>
        <Text style={styles.text}>เลขบัตรประชาชน : {fullInfo?.patient.idcard}</Text>
        <Text style={styles.text}>สิทธิการรักษา : {fullInfo?.patient.rights}</Text>
        <Text style={styles.text}>
          สัญชาติ : {fullInfo?.patient.nationality}    เชื้อชาติ : {fullInfo?.patient.ethnicity}
        </Text>
        <Text style={styles.text}>
          น้ำหนัก : {fullInfo?.patient.weight} กก.    ส่วนสูง : {fullInfo?.patient.height} ซม.
        </Text>
        <Text style={styles.text}>ดัชนีมวลกาย : {fullInfo?.patient.bmi?.toFixed(2)} กก./ม²</Text>
        <Text style={styles.text}>การแพ้ยา : {fullInfo?.patient.allergy || "-"}</Text>
        <Text style={styles.text}>เบอร์โทรศัพท์ : {fullInfo?.patient.phone_number}</Text>
        <Text style={styles.text}>ที่อยู่ : {fullInfo?.patient.address}</Text>
      </View>

      {/* Relative */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ข้อมูลญาติผู้ป่วย</Text>

        {fullInfo?.relative.kin && (
          <>
            <Text style={styles.text}>
              {fullInfo.relative.kin.fullname}
            </Text>
            <Text style={styles.text}>
              เบอร์โทรศัพท์ : {fullInfo.relative.kin.phonenumber}
            </Text>
            <Text style={styles.text}>
              ที่อยู่ : {fullInfo.relative.kin.address}
            </Text>
          </>
        )}

        {isTB &&
          fullInfo?.relative.caretaker && (
            <View>
              <View style={styles.divider} />
              <Text style={styles.specialTitle}>ผู้ดูแลกำกับการกินยา</Text>

              <Text style={styles.text}>{fullInfo.relative.caretaker.fullname}</Text>
              <Text style={styles.text}>เบอร์โทรศัพท์ : {fullInfo.relative.caretaker.phonenumber}</Text>
              <Text style={styles.text}>ที่อยู่ : {fullInfo.relative.caretaker.address}</Text>
            </View>
          )
        }

        {isTB &&
          fullInfo?.relative.medicine && (
            <View>
              <View style={styles.divider} />
              <Text style={styles.specialTitle}>ผู้ป้อนยาผู้ป่วย</Text>

              <Text style={styles.text}>{fullInfo.relative.medicine.fullname}</Text>
              <Text style={styles.text}>เบอร์โทรศัพท์ : {fullInfo.relative.medicine.phonenumber}</Text>
              <Text style={styles.text}>ที่อยู่ : {fullInfo.relative.medicine.address}</Text>
            </View>
          )
        }
      </View>

      {/* Hospital */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ข้อมูลโรงพยาบาล</Text>

        <Text style={styles.text}>โรงพยาบาลโพธิ์ศรีสุวรรณ</Text>
        <Text style={styles.text}>ที่อยู่ : 58 หมู่ 5 ตำบลเสียว อำเภอโพธิ์ศรีสุวรรณ จังหวัดศรีสะเกษ 33120</Text>
        <Text style={styles.text}>เบอร์โทรศัพท์ : 045-826341</Text>

        {isTB &&
          fullInfo?.officer.house && (
          <View style={styles.staffBox}>
            <Text style={styles.staffTitle}>
              เจ้าหน้าที่ที่เยี่ยมบ้าน : {fullInfo.officer.house.fullname}
            </Text>
          </View>
          )
        }
        {isTB &&
          fullInfo?.officer.nurse && (
          <View style={styles.staffBox}>
            <Text style={styles.staffTitle}>
              เจ้าหน้าที่ : {fullInfo.officer.nurse.fullname}
            </Text>
          </View>
          )
        }
      </View>

      <View style={styles.bottomButton}>
        <AppButton
          title="ขอเอกสาร"
          type="secondary"
          onPress={() => router.push("/(tab)/document")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF7FF",
    padding: 16,
  },

  backWrapper: {
    position: "absolute",
    left: 0,
    zIndex: 1,
  },

  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontFamily: "IBMPlexSansThai_700Bold",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontFamily: "IBMPlexSansThai_600SemiBold",
    marginBottom: 8,
  },

  text: {
    fontSize: 14,
    fontFamily: "IBMPlexSansThai_500Medium",
    marginBottom: 4,
  },

  specialTitle: {
    fontSize: 14,
    fontFamily: "IBMPlexSansThai_600SemiBold",
    color: "#05548D",
    marginTop: 8,
    marginBottom: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#B0C4DE",
    marginVertical: 10,
  },

  staffBox: {
    borderWidth: 1,
    borderColor: "#B0C4DE",
    borderRadius: 7,
    padding: 10,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
  },

  staffTitle: {
    fontSize: 14,
    fontFamily: "IBMPlexSansThai_600SemiBold",
    marginBottom: 2,
  },

  bottomButton: {
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: "#EBF7FF",
    overflow: "visible",
  },
});