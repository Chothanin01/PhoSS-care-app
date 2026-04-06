import { Text, View, StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

type Props = {
  name: string;
  age: string;
  date: string;
  time: string;
  department: string;
  doctor: string;
  location: string;
};

export default function AppointmentCard({
  name,
  age,
  date,
  time,
  department,
  doctor,
  location,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        width: screenWidth * 0.9,
        marginRight: 16,
      }}
    >
      <Text className="font-bold mb-2">ใบนัดแพทย์</Text>

      <Text>ชื่อ : {name} อายุ : {age}</Text>
      <Text>นัดวันที่ : {date}</Text>
      <Text>เวลา : {time}</Text>

      <Text className="mt-2">โรค : เบาหวาน</Text>
      <Text>นัดเพื่อ : {department}</Text>
      <Text>สถานที่ : {location}</Text>
      <Text>นัดแพทย์ : {doctor}</Text>

    </View>
  );
}