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
    <View className="bg-white rounded-2xl">
      <Text className="font-bold mb-2">ใบนัดแพทย์</Text>

      <Text>ชื่อ : {name} อายุ : {age}</Text>
      <Text>นัดวันที่ : {date}</Text>
      <Text>เวลา : {time}</Text>

      <Text>โรค : เบาหวาน</Text>
      <Text>นัดเพื่อ : {department}</Text>
      <Text>สถานที่ : {location}</Text>
      <Text>นัดแพทย์ : {doctor}</Text>
    </View>
  );
}