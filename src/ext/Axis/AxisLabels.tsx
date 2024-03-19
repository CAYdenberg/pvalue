import { FunctionComponent } from "../../imports.ts";

import { Point } from "../../lib/types.ts";
import Text from "../../components/Text.tsx";
import { AxisOptions } from "./utils.ts";

export interface AxisLabelProps {
  position: Point;
  label: string;
  options: AxisOptions;
}

export const XAxisLabel: FunctionComponent<AxisLabelProps> = ({
  label,
  position,
  options,
}) => {
  const {
    fontFamily,
    fontWeight,
    fontSize,
    color,
    labelPosition,
    pointerEvents,
  } = options;

  return (
    <Text
      position={position}
      pxOffset={[0, labelPosition]}
      text={label}
      color={color}
      align="center"
      font={fontFamily}
      fontWeight={fontWeight}
      fontSize={fontSize}
      svgPointerEvents={pointerEvents}
    />
  );
};

export const YAxisLabel: FunctionComponent<AxisLabelProps> = ({
  label,
  position,
  options,
}) => {
  const {
    fontWeight,
    fontFamily,
    fontSize,
    color,
    labelPosition,
    pointerEvents,
  } = options;

  return (
    <Text
      position={position}
      pxOffset={[labelPosition + fontSize, 0]}
      text={label}
      color={color}
      align="center"
      font={fontFamily}
      fontWeight={fontWeight}
      fontSize={fontSize}
      rotation={labelPosition < 0 ? 1.5 * Math.PI : 0.5 * Math.PI}
      svgPointerEvents={pointerEvents}
    />
  );
};
