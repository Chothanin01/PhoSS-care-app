import { View, Text, ScrollView, StyleSheet } from "react-native";
import BackButton from "@/components/backButton";
import AppButton from "@/components/appButton";
import { router } from "expo-router";

export default function PatientDataPage() {
  const patient = {
    name: "นายสิริชัย ทักจิวศ์",
    disease: "วัณโรค",
    age: "20 ปี 3 เดือน 2 วัน",
    gender: "ชาย",
    idCard: "1-1111-11111-11-1",
    rights: "บัตรทอง",
    nationality: "ไทย",
    ethnicity: "ไทย",
    weight: "50 กก.",
    height: "179 ซม.",
    bmi: "22.8 กก./ม²",
    allergy: "-",
    phone: "123-456-7890",
    address: "123/45 ตำบล หนองนา อำเภอ หนองนา จังหวัด นครปฐม 77770",
  };

  const relative = {
    name: "นางอารี บุญรอด",
    phone: "123-456-7890",
    address: "123/45 ตำบล หนองนา อำเภอ หนองนา จังหวัด นครปฐม 77770",
  };

  const hospital = {
    name: "โรงพยาบาลโพธิ์ศรีสุวรรณ",
    address: "123/45 ตำบล หนองนา อำเภอ หนองนา จังหวัด ศรีสะเกษ 77770",
  };

  const tbData = {
    caregivers: [
      {
        role: "ผู้ดูแลทำการกินยา",
        name: "นางสมรัก มั่นคง",
        phone: "123-456-7890",
        address: "123/45 ตำบล หนองนา อำเภอ หนองนา จังหวัด นครปฐม 77770",
      },
      {
        role: "ผู้ป้อนยา",
        name: "นายชัย เจริญ",
        phone: "123-456-7890",
        address: "123/45 ตำบล หนองนา อำเภอ หนองนา จังหวัด นครปฐม 77770",
      },
    ],
    hospitalStaff: [
      {
        role: "เจ้าหน้าที่เยี่ยมบ้าน",
        name: "นางสม ฤดน",
        phone: "123-456-7890",
      },
      {
        role: "เจ้าหน้าที่",
        name: "xxx xxx",
        phone: "123-456-7890",
      },
    ],
  };

  const isTB = patient.disease === "วัณโรค";

  return (
    <ScrollView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.backWrapper}>
          <BackButton />
        </View>

        <Text style={styles.title}>
          ข้อมูลผู้ป่วย
        </Text>
      </View>

      {/* Patient Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ข้อมูลผู้ป่วย</Text>

        <Text style={styles.text}>{patient.name}</Text>
        <Text style={styles.text}>
          อายุ : {patient.age}    เพศ : {patient.gender}
        </Text>
        <Text style={styles.text}>เลขบัตรประชาชน : {patient.idCard}</Text>
        <Text style={styles.text}>สิทธิการรักษา : {patient.rights}</Text>
        <Text style={styles.text}>
          สัญชาติ : {patient.nationality}    เชื้อชาติ : {patient.ethnicity}
        </Text>
        <Text style={styles.text}>
          น้ำหนัก : {patient.weight}    ส่วนสูง : {patient.height}
        </Text>
        <Text style={styles.text}>ดัชนีมวลกาย : {patient.bmi}</Text>
        <Text style={styles.text}>การแพ้ยา : {patient.allergy}</Text>
        <Text style={styles.text}>เบอร์โทรศัพท์ : {patient.phone}</Text>
        <Text style={styles.text}>ที่อยู่ : {patient.address}</Text>
      </View>

      {/* Relative */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ข้อมูลญาติผู้ป่วย</Text>

        <Text style={styles.text}>{relative.name}</Text>
        <Text style={styles.text}>เบอร์โทรศัพท์ : {relative.phone}</Text>
        <Text style={styles.text}>ที่อยู่ : {relative.address}</Text>

        {isTB &&
          tbData.caregivers.map((item, i) => (
            <View key={i}>
              <View style={styles.divider} />
              <Text style={styles.specialTitle}>{item.role}</Text>

              <Text style={styles.text}>{item.name}</Text>
              <Text style={styles.text}>เบอร์โทรศัพท์ : {item.phone}</Text>
              <Text style={styles.text}>ที่อยู่ : {item.address}</Text>
            </View>
          ))}
      </View>

      {/* Hospital */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ข้อมูลโรงพยาบาล</Text>

        <Text style={styles.text}>{hospital.name}</Text>
        <Text style={styles.text}>ที่อยู่ : {hospital.address}</Text>

        {isTB &&
          tbData.hospitalStaff.map((item, i) => (
            <View key={i} style={styles.staffBox}>
              <Text style={styles.staffTitle}>
                {item.role} : {item.name}
              </Text>
              <Text style={styles.text}>เบอร์ : {item.phone}</Text>
            </View>
          ))}
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