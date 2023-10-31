import styled from "styled-components/native";

export const RootContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ScreenTitle = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-size: ${(props: any) => props.fontSize ?? "24px"};
  font-weight: bold;
  margin-bottom: 24px;
`;
