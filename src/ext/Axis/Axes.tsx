import { Fragment, FunctionComponent } from "../../imports.ts";

import { normalize } from "../../lib/normalize.ts";
import useChartState from "../../lib/ChartState.tsx";
import { Line } from "../../components/Line.tsx";

import { TickMarkProps, XTickMark, YTickMark } from "./TickMarks.tsx";
import { AxisLabelProps, XAxisLabel, YAxisLabel } from "./AxisLabels.tsx";
import {
  AxisOptions,
  tickPos,
  xAxisOptionsDefaults,
  yAxisOptionsDefaults,
} from "./utils.ts";

interface AxisProps {
  range?: [number, number];
  intercept?: number;
  tickPositions?: Array<number> | ((pxSpace: number) => Array<number>);
  getTickLabel?: (value: number, pxSpace: number) => string;
  axisLabel?: string | null;
  options?: Partial<AxisOptions>;
  renderTickMark?: FunctionComponent<TickMarkProps>;
  renderAxisLabel?: FunctionComponent<AxisLabelProps>;
}

const normalizeAxisProps = (
  props: AxisProps,
  naturalRange: [number, number],
) => {
  const range = normalize(props.range, naturalRange);
  const intercept = normalize<number>(props.intercept, 0);
  const tickPositions = normalize(props.tickPositions, []);
  const axisLabel = normalize(props.axisLabel, null);
  const getTickLabel = normalize(
    props.getTickLabel,
    (value: number) => value.toString(),
  );

  return {
    range,
    intercept,
    tickPositions,
    getTickLabel,
    axisLabel,
  };
};

export const XAxis: FunctionComponent<AxisProps> = (props) => {
  const state = useChartState();
  const {
    range,
    intercept,
    tickPositions,
    getTickLabel,
    axisLabel,
  } = normalizeAxisProps(props, state.cartesianBox.x);

  const options = {
    ...xAxisOptionsDefaults,
    ...props.options,
  };

  const {
    color,
    strokeWidth,
    pointerEvents,
  } = options;

  const midPoint = (state.cartesianBox.xMin + state.cartesianBox.xMax) / 2;

  const TickMark = props.renderTickMark || XTickMark;
  const Label = props.renderAxisLabel || XAxisLabel;

  const _tickPositions = typeof tickPositions === "function"
    ? tickPositions(state.pxBox.width)
    : tickPositions;

  return (
    <Fragment>
      <Line
        path={[
          [range[0], intercept],
          [range[1], intercept],
        ]}
        strokeWidth={strokeWidth}
        stroke={color}
        svgPointerEvents={pointerEvents}
      />
      {_tickPositions.map((tick, index) => {
        const pos = tickPos(tick);
        if (pos < range[0] || pos > range[1]) {
          return null;
        }

        return (
          <TickMark
            position={[pos, intercept]}
            label={getTickLabel(tick, state.pxBox.width)}
            key={pos}
            options={options}
          />
        );
      })}
      {axisLabel && (
        <Label
          position={[midPoint, intercept]}
          label={axisLabel}
          options={options}
        />
      )}
    </Fragment>
  );
};

export const YAxis: FunctionComponent<AxisProps> = (props) => {
  const state = useChartState();
  const {
    range,
    intercept,
    tickPositions,
    getTickLabel,
    axisLabel,
  } = normalizeAxisProps(props, state.cartesianBox.y);

  const options = {
    ...yAxisOptionsDefaults,
    ...props.options,
  };

  const { strokeWidth, color, pointerEvents } = options;

  const midPoint = (state.cartesianBox.yMin + state.cartesianBox.yMax) / 2;

  const TickMark = props.renderTickMark || YTickMark;
  const Label = props.renderAxisLabel || YAxisLabel;

  const _tickPositions = typeof tickPositions === "function"
    ? tickPositions(state.pxBox.height)
    : tickPositions;

  return (
    <Fragment>
      <Line
        path={[
          [intercept, range[0]],
          [intercept, range[1]],
        ]}
        strokeWidth={strokeWidth}
        stroke={color}
        svgPointerEvents={pointerEvents}
      />
      {_tickPositions.map((tick) => {
        const pos = tickPos(tick);
        if (pos < range[0] || pos > range[1]) {
          return null;
        }

        return (
          <TickMark
            position={[intercept, pos]}
            label={getTickLabel(tick, state.pxBox.height)}
            options={options}
            key={pos}
          />
        );
      })}
      {axisLabel && (
        <Label
          position={[intercept, midPoint]}
          label={axisLabel}
          options={options}
        />
      )}
    </Fragment>
  );
};
