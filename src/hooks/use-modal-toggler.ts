import { useState } from "react";

export const useModalToggler = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return [isModalVisible, () => setIsModalVisible(false), () => setIsModalVisible(true)];
};
