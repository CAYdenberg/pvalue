import { Delaunay } from "https://cdn.skypack.dev/d3-delaunay@6";

import { useCallback, useEffect, useState } from "../imports.ts";
import { ChartEventHandler, Point } from "../lib/types.ts";

const useDelaunay = (
  series: Point[],
  callback: ChartEventHandler,
  timeout?: number,
): ChartEventHandler => {
  const [voronoi, setVoronoi] = useState<Delaunay | null>(null);

  useEffect(() => {
    // the current Voronoi is now obsolete, clear it.
    setVoronoi(null);

    // make sure this is a browser environment with the support we need.
    // Do not run in canvas mode as nothing will render.
    if (!window || !globalThis.requestIdleCallback) {
      return;
    }

    const handle = globalThis.requestIdleCallback(
      () => {
        setVoronoi(Delaunay.from(series));
      },
      typeof timeout !== "undefined" ? { timeout } : undefined,
    );

    return () => {
      // any queued callbacks are now waiting to run on obsolete data, clear them.
      globalThis?.cancelIdleCallback && globalThis.cancelIdleCallback(handle);
    };
  }, [series, timeout]);

  const handler: ChartEventHandler = useCallback(
    (data) => {
      data.event.stopPropagation();

      if (!voronoi || !data.pointerPosition) {
        return data;
      }

      // get the elementPosition and meta data about the point nearest the
      // pointer position by refering to the Voronoi diagram
      const index = voronoi.find(...data.pointerPosition);

      return callback({
        ...data,
        elementPosition: series[index],
      });
    },
    [callback, series, voronoi],
  );

  return handler;
};

export default useDelaunay;
