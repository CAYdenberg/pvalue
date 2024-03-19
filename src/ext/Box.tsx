import { FunctionComponent } from "../imports.ts";
import useChartState from "../lib/ChartState.tsx";
import { PxLine } from "../components/Line.tsx";
import { Point } from "../lib/types.ts";

interface Props {
  y1: number;
  x: number;
  width: number;
  y0?: number;
  fill?: string;
  stroke?: string;
  strokeWidth: number;
}

const Box: FunctionComponent<Props> = (
  { x, y0, y1, width, fill, stroke, strokeWidth },
) => {
  const { scale } = useChartState();

  const top = scale([x, y1]);
  const bottom = scale([x, y0 || 0]);
  const hW = width / 2;
  const tl = [top[0] - hW, top[1]] as Point;
  const tr = [top[0] + hW, top[1]] as Point;
  const br = [bottom[0] + hW, bottom[1]] as Point;
  const bl = [bottom[0] - hW, bottom[1]] as Point;

  return (
    <PxLine
      path={[tl, tr, br, bl, tl]}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
};

export default Box;
