import { Modal, View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MenuPath } from "@/types/navigation";
import { useEffect } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedDisease: string | null;
  setSelectedDisease: (val: string | null) => void;
  targetPath: MenuPath | null;
};

const diseases = [
  "โรคความดันโลหิตสูง",
  "โรคเบาหวาน",
  "วัคซีนเด็ก",
  "วัณโรค",
];

export default function DiseaseModal({
  visible,
  onClose,
  selectedDisease,
  setSelectedDisease,
  targetPath,
}: Props) {
  const handleConfirm = () => {
    if (!selectedDisease || !targetPath) return;

    onClose();

    router.push({
      pathname: targetPath,
      params: { disease: selectedDisease },
    });

    setSelectedDisease(null);
  };

  const handleClose = () => {
    setSelectedDisease(null);
    onClose();
  };

  useEffect(() => {
    if (!visible) {
      setSelectedDisease(null);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center">
        
        <View className="w-[85%] bg-white rounded-2xl p-6">

          <TouchableOpacity
            onPress={handleClose}
            className="absolute top-3 right-3 z-10"
          >
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>

          <Text className="text-xl font-bold mb-3">
            กรุณาเลือกโรคที่ต้องการ
          </Text>

          {diseases.map((item) => {
            const isActive = selectedDisease === item;

            return (
              <TouchableOpacity
                key={item}
                onPress={() =>
                  setSelectedDisease(selectedDisease === item ? null : item)
                }
                className={`flex-row items-center p-3 rounded-xl mb-2 border border-navy
                  ${
                    isActive
                      ? "border-navy bg-blue-50"
                      : "border-gray-300"
                  }`}
              >
                {/* radio */}
                <View
                  className={`w-5 h-5 rounded-full border justify-center items-center mr-3
                    ${
                      isActive
                        ? "bg-[#58AD46] border border-[#58AD46]"
                        : "border-navy"
                    }`}
                >
                  {isActive && (
                    <Ionicons key={item} name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </View>

                <Text className="text-base font-medium justify-center items-center">{item}</Text>
              </TouchableOpacity>
            );
          })}

          {/* confirm */}
          <TouchableOpacity
            disabled={!selectedDisease}
            onPress={handleConfirm}
            className={`mt-3 p-3 rounded-xl items-center ${
              selectedDisease ? "bg-navy" : "bg-gray-300"
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              ยืนยันการเลือก
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}