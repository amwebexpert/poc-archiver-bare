import { FunctionComponent } from "react";

type Props = {
  rowValue: number;
  rowReverseValue?: number;
  isReverseVisible?: boolean;
};

export const AppProgressBar: FunctionComponent<Props> = ({ rowValue, rowReverseValue, isReverseVisible }) => {
  console.info("====>>> info", { rowValue, rowReverseValue, isReverseVisible });
  return null;
};

// -------------------------
// elsewhere in the codebase...

type PropsFrom<TComponent> = TComponent extends FunctionComponent<infer P> ? P : never;

const myProps: PropsFrom<typeof AppProgressBar> = {
  rowValue: 1,
  rowReverseValue: 2,
  isReverseVisible: true,
};
