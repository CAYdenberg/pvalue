type City = 'Vancouver' | 'Victoria' | 'Kelowna';

const SERIES = {
  Vancouver: '#003f5c',
  Victoria: '#bc5090',
  Kelowna: '#ff6361',
} as Record<City, string>;

interface Props {
  data: Array<{
    date: string;
    Vancouver: number;
    Victoria: number;
    Kelowna: number;
  }>;
  width: number;
}

const barWidth = (w: number) => (w < 600 ? 6 : 10);
const capWidth = (w: number) => (w < 600 ? 0 : 6);
const fontSize = (w: number) => (w < 600 ? 12 : 16);

const App: preact.FunctionComponent<Props> = ({ data, width }) => {
  const reshapedData = hooks.useMemo(() => reshapeData(data), []);

  const [tooltip, setTooltip] = hooks.useState<number | null>(null);

  return (
    <Chart
      height={435}
      ssWidth={width}
      view={[-0.5, 0, 12, 250]}
      gutter={[5, 20, 50, 60]}
      isCanvas={false}
      htmlLayer={
        tooltip !== null && tooltip > -1 && tooltip < 12
          ? {
              position: [tooltip, 225],
              render: (
                <Tooltip reshapedData={reshapedData} monthIdx={tooltip} />
              ),
            }
          : null
      }
      onPointerMove={(ev) => setTooltip(Math.round(ev.pointerPosition[0]))}
      onPointerLeave={() => setTooltip(null)}
    >
      {reshapedData.map(({ city, months }, seriesIdx) =>
        months.map(({ avg, dev }, monthIdx) =>
          avg && dev ? (
            <>
              <Bar
                point={[monthIdx, avg]}
                fill={SERIES[city]}
                offset={seriesIdx - 1}
              />
              <ErrorBar
                anchor={[monthIdx, avg]}
                range={dev}
                offset={seriesIdx - 1}
              />
            </>
          ) : null,
        ),
      )}
      <Axes />
      <Rule tooltip={tooltip} />
    </Chart>
  );
};

const reshapeData = (data: Props['data']) =>
  Object.keys(SERIES).map((city) => {
    const _city = city as City;
    const months = Array(12)
      .fill(null)
      .map((_, monthIdx) => {
        const datapoints = data
          .filter((row) => new Date(row.date).getMonth() === monthIdx)
          .map((row) => row[_city]);
        const avg = d3.mean(datapoints);
        const dev = d3.deviation(datapoints);
        return { avg, dev };
      });

    return {
      city: _city,
      months,
    };
  });

const Bar: preact.FunctionComponent<{
  point: [number, number];
  offset: number;
  fill: string;
}> = ({ point, fill, offset }) => {
  const { scale, pxBox } = useChartState();

  const bw = barWidth(pxBox.width);
  const hW = bw / 2;
  const [x, ty] = scale(point);
  const [, by] = scale([point[0], 0]);
  const ox = x + offset * bw;

  return (
    <PxLine
      path={[
        [ox - hW, ty],
        [ox + hW, ty],
        [ox + hW, by],
        [ox - hW, by],
        [ox - hW, ty],
      ]}
      strokeWidth={0}
      fill={fill}
    />
  );
};

const ErrorBar: preact.FunctionComponent<{
  anchor: [number, number];
  range: number;
  offset: number;
}> = ({ anchor, range, offset }) => {
  const { scale, pxBox } = useChartState();

  const [x, ty] = scale([anchor[0], anchor[1] + range]);
  const [, by] = scale([anchor[0], anchor[1] - range]);

  const cw = capWidth(pxBox.width);
  const hW = cw / 2;
  const ox = x + offset * barWidth(pxBox.width);

  return (
    <>
      <PxLine
        path={[
          [ox, ty],
          [ox, by],
        ]}
        strokeWidth={2}
        stroke="#666"
      />
      <PxLine
        path={[
          [ox - hW, ty],
          [ox + hW, ty],
        ]}
        strokeWidth={2}
        stroke="#666"
      />
      <PxLine
        path={[
          [ox - hW, by],
          [ox + hW, by],
        ]}
        strokeWidth={2}
        stroke="#666"
      />
    </>
  );
};

const Axes: preact.FunctionComponent = () => {
  const { pxBox } = useChartState();

  return (
    <>
      <axes.XAxis
        tickPositions={MONTHS.map((_, i) => i)}
        getTickLabel={(pos) =>
          pxBox.width > 400 ? MONTHS[pos] : MONTHS[pos].slice(0, 1)
        }
        options={{
          fontSize: fontSize(pxBox.width),
        }}
      />
      <axes.YAxis
        tickPositions={[0, 100, 200]}
        intercept={-0.5}
        axisLabel="Precipitation (mm)"
      />
    </>
  );
};

const Rule: preact.FunctionComponent<{
  tooltip: number | null;
}> = ({ tooltip }) => {
  const { cartesianBox } = useChartState();

  if (tooltip === null || tooltip < 0 || tooltip > 12) {
    return null;
  }

  return (
    <Line
      path={[
        [tooltip, cartesianBox.yMin],
        [tooltip, cartesianBox.yMax],
      ]}
      dash="dotted"
    />
  );
};

const Tooltip: preact.FunctionComponent<{
  reshapedData: ReturnType<typeof reshapeData>;
  monthIdx: number;
}> = ({ reshapedData, monthIdx }) => {
  return (
    <div class="box">
      <p>{MONTHS[monthIdx]}</p>
      {reshapedData.map(({ city, months }) => (
        <p>
          <span>{city}</span>: <span>{months[monthIdx].avg?.toFixed(1)}</span>
        </p>
      ))}
    </div>
  );
};

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
