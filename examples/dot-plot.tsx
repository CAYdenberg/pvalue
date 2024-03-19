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

interface TooltipData {
  date: string;
  city: string;
  pos: [number, number];
}

const INITIAL_VIEW = createViewbox([-0.5, 0, 3, 250]);
const boxWidth = (w: number) => (w < 600 ? 16 : 26);

const App: preact.FunctionComponent<Props> = ({ data, width }) => {
  const reshapedData = hooks.useMemo(() => reshapeData(data), [data]);
  const [tooltip, setTooltip] = hooks.useState<TooltipData | null>(null);
  const [view, setView, isAnimating] = useStateTransition(INITIAL_VIEW);

  const isZoomedIn = view.width < 3;

  const handleClick = hooks.useCallback(
    (tooltip: TooltipData, nInBin: number) => {
      if (nInBin === 1 || isZoomedIn) {
        setTooltip(tooltip);
        return;
      }

      const final = createViewbox([
        Math.round(tooltip.pos[0]) - 0.5,
        tooltip.pos[1] - 50,
        1,
        100,
      ]);
      setView({
        duration: 600,
        step: (progress) => INITIAL_VIEW.interpolate(final, progress),
      });
    },
    [isZoomedIn],
  );
  const reset = hooks.useCallback(() => {
    setTooltip(null);
    setView({
      duration: 600,
      step: (progress) => view.interpolate(INITIAL_VIEW, progress),
    });
  }, [view]);

  return (
    <>
      <button class="button" onClick={reset} disabled={!isZoomedIn}>
        Reset
      </button>
      <Chart
        height={435}
        ssWidth={width}
        view={view}
        gutter={[20, 20, 50, 60]}
        isCanvas={isAnimating}
        htmlLayer={tooltip
          ? {
            position: tooltip.pos,
            render: <Tooltip tooltip={tooltip} />,
          }
          : null}
        onPointerDown={() => setTooltip(null)}
      >
        {reshapedData.map((series, x) => (
          <Clip path={view.toPath()}>
            <BoxAndWhisker
              key={series.city}
              x={x}
              seriesData={series.data.map((datapoint) => datapoint.y)}
            />
            {series.data.map((datapoint) => (
              <Handle
                onPointerDown={(ev) => {
                  ev.event.stopPropagation();
                  handleClick(
                    {
                      city: series.city,
                      date: datapoint.date,
                      pos: ev.pointerPosition,
                    },
                    datapoint.nInBin,
                  );
                }}
              >
                <Dot
                  key={datapoint.date}
                  symbol="circle"
                  point={[x, datapoint.y]}
                  pxOffset={dodge.offsetXBilateral(
                    datapoint.indexInBin,
                    datapoint.nInBin,
                    isZoomedIn ? 10 : 4,
                  )}
                  strokeWidth={0}
                  fill={series.color}
                  opacity={0.3}
                />
              </Handle>
            ))}
          </Clip>
        ))}

        <axes.YAxis
          tickPositions={d3.ticks(view.yMin, view.yMax, 4)}
          intercept={view.xMin}
          axisLabel="Precipitation (mm)"
        />
        <axes.XAxis
          tickPositions={[0, 1, 2]}
          getTickLabel={(pos) => reshapedData[pos].city}
          intercept={view.yMin}
        />
      </Chart>
    </>
  );
};

const dodger = dodge.dodge(
  ({ x, y }: { x: number; y: number; date: string }) => [x, Math.floor(y / 3)],
);
const reshapeData = (data: Props["data"]) =>
  Object.keys(SERIES).map((key, x) => {
    const _city = key as City;

    return {
      city: _city,
      color: SERIES[_city],
      data: dodger(
        data.map((y) => ({
          x,
          y: y[_city],
          date: y.date,
        })),
      ),
    };
  });

const BoxAndWhisker: preact.FunctionComponent<{
  x: number;
  seriesData: number[];
}> = ({ x, seriesData }) => {
  const { scale, pxBox } = useChartState();
  const hW = boxWidth(pxBox.width) / 2;

  const quartiles = [0.05, 0.25, 0.5, 0.75, 0.95].map((q) =>
    scale([x, d3.quantile(seriesData, q)!])
  );

  return (
    <>
      {quartiles.map((q) => (
        <BoxAndWhiskerLine
          path={[
            [q[0] - hW, q[1]],
            [q[0] + hW, q[1]],
          ]}
        />
      ))}
      <BoxAndWhiskerLine path={[quartiles[0], quartiles[1]]} />
      <BoxAndWhiskerLine path={[quartiles[3], quartiles[4]]} />
      <BoxAndWhiskerLine
        path={[
          [quartiles[1][0] - hW, quartiles[1][1]],
          [quartiles[1][0] + hW, quartiles[1][1]],
          [quartiles[3][0] + hW, quartiles[3][1]],
          [quartiles[3][0] - hW, quartiles[3][1]],
          [quartiles[1][0] - hW, quartiles[1][1]],
        ]}
      />
    </>
  );
};

const BoxAndWhiskerLine: preact.FunctionComponent<{
  path: [number, number][];
}> = ({ path }) => <PxLine path={path} strokeWidth={2} stroke="#666" />;

const Tooltip: preact.FunctionComponent<{
  tooltip: TooltipData;
}> = ({ tooltip }) => {
  return (
    <div class="box">
      <p>{tooltip.city}</p>
      <p>{tooltip.date}</p>
    </div>
  );
};
