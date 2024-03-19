import { FunctionComponent } from "../imports.ts";

import { Point } from "../lib/types.ts";
import { Line } from "../mod.ts";
import useChartState from "../lib/ChartState.tsx";
import Clip from "../components/Clip.tsx";
import { closeLineToEdge } from "../lib/geometry.ts";

interface LineSeriesProps {
  topLine: Point[];
  bottomLine?: Point[];
  fill?: string;
}

export const AreaSeries: FunctionComponent<LineSeriesProps> = (props) => {
  const state = useChartState();
  const { cartesianBox: view } = state;

  const areaUnder = closeLineToEdge(props.topLine, view.yMin);
  const areaOver = props.bottomLine
    ? closeLineToEdge(props.bottomLine, view.yMax)
    : null;

  return (
    areaUnder
      ? (
        <Clip path={areaOver}>
          <Line
            path={areaUnder}
            strokeWidth={0}
            fill={props.fill}
          />
        </Clip>
      )
      : null
  );
};
