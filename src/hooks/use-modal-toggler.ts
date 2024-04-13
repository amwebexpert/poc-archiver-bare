import { useState } from "react";

type ModalToggler = [boolean, () => void, () => void];

export const useModalToggler = (): ModalToggler => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return [isModalVisible, () => setIsModalVisible(false), () => setIsModalVisible(true)];
};
