import { DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE } from "../../lib/constants.ts";

export interface AxisOptions {
  fontWeight: number;
  fontSize: number;
  fontFamily: string;
  pointerEvents: boolean;
  color: string;
  strokeWidth: number;
  tickLength: number;
  tickOffset: number;
  tickLabelOffset: number;
  labelPosition: number;
}

export const xAxisOptionsDefaults: AxisOptions = {
  fontWeight: 700,
  fontSize: DEFAULT_FONT_SIZE,
  fontFamily: DEFAULT_FONT_FAMILY,
  pointerEvents: true,
  color: "#666",
  strokeWidth: 2,
  tickLength: 10,
  tickOffset: 0,
  tickLabelOffset: 2,
  labelPosition: 46,
};

export const yAxisOptionsDefaults: AxisOptions = {
  ...xAxisOptionsDefaults,
  labelPosition: -60,
};

export const tickIsShown = (index: number, modulus: number): boolean =>
  !(index % modulus);

export const tickPos = (tick: number | [number, string]): number => {
  if (Array.isArray(tick)) {
    return tick[0];
  }
  return tick;
};

export const defaultGetTickLabel = (value: number) => value.toString();
