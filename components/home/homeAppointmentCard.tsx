import { Text, View } from "react-native";

type Props = {
  name: string;
  age: string;
  date: string;
  time: string;
  disease: string;
  department: string;
  doctor: string;
  location: string;
  index: number;
  total: number; 
};

export default function AppointmentCard({
  name,
  age,
  date,
  time,
  disease,
  department,
  doctor,
  location,
  index,
  total,
}: Props) {
  return (
    <View className="bg-white rounded-2xl p-4 w-full shadow-black">
      <Text className="font-semibold text-lg mb-2">ใบนัดแพทย์</Text>

      <View className="flex-row justify-between mb-1">
        <Text className="font-medium">ชื่อ : {name}</Text>
        <Text className="font-medium">อายุ : {age}</Text>
      </View>
      <Text className="font-medium">นัดวันที่ : {date}</Text>
      <Text className="font-medium">เวลา : {time}</Text>

      <Text className="font-medium">โรค : {disease}</Text>
      <Text className="font-medium">นัดเพื่อ : {department}</Text>
      <Text className="font-medium">สถานที่ : {location}</Text>
      <Text className="font-medium">นัดแพทย์ : {doctor}</Text>

      <View className="flex-row justify-center mt-3">
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            className={`w-2 h-2 rounded-full mx-1 ${
              i === index ? "bg-[#58AD46]" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
}