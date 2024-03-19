type City = "Vancouver" | "Victoria" | "Kelowna";

const SERIES = {
  Vancouver: "#003f5c",
  Victoria: "#bc5090",
  Kelowna: "#ff6361",
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

const INITIAL_VIEW = createViewbox([201, 0, 50, 250]);
const OUTER_VIEW = createViewbox([0, 0, 251, 250]);

const App: preact.FunctionComponent<Props> = (props) => {
  const { data, width } = props;

  const [view, updateView, isAnimating] = useStateTransition(INITIAL_VIEW);
  const zoomTo = (final: Viewbox) => {
    updateView({
      duration: 600,
      step: (progress) => {
        return view.interpolate(final, progress);
      },
    });
  };

  const events = useGesture({
    onDrag: (ev) => {
      updateView((init) => init.panX(-1 * ev.delta[0]).bound(OUTER_VIEW));
    },
    onSwipe: (ev) => {
      const final = view.panX(-1 * ev.delta[0] * view.width).bound(OUTER_VIEW);
      zoomTo(final);
    },
  });

  return (
    <Chart
      height={435}
      ssWidth={width}
      view={view}
      gutter={[5, 20, 50, 60]}
      isCanvas={isAnimating}
      {...events}
    >
      <Clip path={view.toPath()}>
        {Object.keys(SERIES).map((city) => {
          const _city = city as City;
          return (
            <>
              <Line
                path={data.map((row, i) => [i, row[_city]])}
                strokeWidth={2}
                stroke={SERIES[_city]}
                curveType="natural"
              />
              {data.map((row, i) => (
                <Dot
                  symbol="circle"
                  point={[i, row[_city]]}
                  strokeWidth={0}
                  fill={SERIES[_city]}
                />
              ))}
            </>
          );
        })}
      </Clip>

      <Axes {...props} />
    </Chart>
  );
};

const Axes: preact.FunctionComponent<Props> = ({ data }) => {
  const { cartesianBox, pxBox } = useChartState();

  const ticks = data
    .map((_, i) => (i % 12 === 0 ? i : null))
    .filter((tick) => typeof tick === "number") as number[];

  const getTickLabel = (pos: number) => {
    const year = data[pos].date.split("-")[0];
    return pxBox.width > 500 ? `Jan ${year}` : `'${year.slice(2)}/1`;
  };

  return (
    <>
      <axes.XAxis tickPositions={ticks} getTickLabel={getTickLabel} />
      <axes.YAxis
        tickPositions={[0, 100, 200]}
        intercept={cartesianBox.xMin}
        axisLabel="Precipitation (mm)"
      />
    </>
  );
};
