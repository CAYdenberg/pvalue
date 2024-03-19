import { Fragment, FunctionComponent } from "../../imports.ts";

import { normalize } from "../../lib/normalize.ts";
import { Point } from "../../lib/types.ts";
import { TranslatedLine } from "../../components/Line.tsx";
import Text from "../../components/Text.tsx";
import { AxisOptions } from "./utils.ts";

export interface TickMarkProps {
  options: AxisOptions;
  position: Point;
  label?: string;
}

export const XTickMark: FunctionComponent<TickMarkProps> = (props) => {
  const position = props.position;
  const label = normalize(props.label, "");
  const {
    tickOffset,
    tickLength,
    tickLabelOffset,
    fontWeight,
    fontFamily,
    fontSize,
    strokeWidth,
    pointerEvents,
    color,
  } = props.options;

  const labelAbsoluteOffset = tickLength + tickLabelOffset + fontSize;

  return (
    <Fragment>
      <TranslatedLine
        position={position}
        path={[
          [0, tickOffset],
          [0, tickOffset + tickLength],
        ]}
        strokeWidth={strokeWidth}
        stroke={color}
        svgPointerEvents={pointerEvents}
      />
      {label
        ? (
          <Text
            position={position}
            pxOffset={[0, labelAbsoluteOffset]}
            text={label}
            color={color}
            align="center"
            font={fontFamily}
            fontSize={fontSize}
            fontWeight={fontWeight}
            svgPointerEvents={pointerEvents}
          />
        )
        : null}
    </Fragment>
  );
};

export const YTickMark: FunctionComponent<TickMarkProps> = (props) => {
  const position = props.position;
  const label = normalize(props.label, "");

  const {
    tickOffset,
    tickLength,
    tickLabelOffset,
    fontFamily,
    fontSize,
    fontWeight,
    strokeWidth,
    pointerEvents,
    color,
  } = props.options;

  const labelAbsoluteOffset = 0 - tickLength - tickLabelOffset;

  return (
    <Fragment>
      <TranslatedLine
        position={position}
        path={[
          [0 - tickOffset, 0],
          [0 - tickLength - tickOffset, 0],
        ]}
        strokeWidth={strokeWidth}
        stroke={color}
        svgPointerEvents={pointerEvents}
      />
      <Text
        position={position}
        pxOffset={[labelAbsoluteOffset, fontSize / 2 - strokeWidth]}
        text={label}
        color={color}
        align="right"
        font={fontFamily}
        fontSize={fontSize}
        fontWeight={fontWeight}
        svgPointerEvents={pointerEvents}
      />
    </Fragment>
  );
};
