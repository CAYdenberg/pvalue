import { FunctionComponent } from "preact";
import { Fragment } from "preact/jsx-runtime";

import { list } from "../ext/numty.ts";
import { Line, useChartState } from "../mod.ts";
import { XAxis, YAxis } from "../ext/Axis/mod.ts";

export const GraphPaper: FunctionComponent = () => {
  const { cartesianBox: view } = useChartState();

  const xTicks = list(
    Math.ceil(view.width) + 1,
    (i) => i + Math.floor(view.xMin),
  );
  const yTicks = list(
    Math.ceil(view.height) + 1,
    (i) => i + Math.floor(view.yMin),
  );

  return (
    <Fragment>
      <XAxis intercept={0} tickPositions={xTicks} />
      <YAxis intercept={0} tickPositions={yTicks} />
      {xTicks.map((tick) => (
        <Line
          path={[
            [tick, view.yMin],
            [tick, view.yMax],
          ]}
          stroke="#666"
          strokeWidth={1}
          dash="dashed"
        />
      ))}
      {yTicks.map((tick) => (
        <Line
          path={[
            [view.xMin, tick],
            [view.xMax, tick],
          ]}
          stroke="#666"
          strokeWidth={1}
          dash="dashed"
        />
      ))}
    </Fragment>
  );
};
