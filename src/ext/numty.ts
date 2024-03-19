import type { Point } from "../lib/types.ts";

/**
 * Generates a list of length numbers, calculated from getValue.
 * list(3, i => i * 2) => [0, 2, 4]
 */
export const list = <T>(
  length: number,
  getValue: (index: number) => T,
): Array<T> => Array.from({ length }, (_, i) => getValue(i));

/**
 * Calculates distributional statistics of a dataset. For example, median
 * or quartiles.
 * dist(dataset)(0.5) => find the median (eg the third quartile)
 * dist(dataset)(0.25) => finds the first quartile, etc..
 */
export const dist = (dataset: number[]) => {
  const sorted = dataset.slice(0).sort((a, b) => a - b);

  return (interval: number) => {
    const idxWanted = (sorted.length - 1) * interval;
    if (idxWanted === Math.floor(idxWanted)) {
      return sorted[idxWanted];
    }
    const down = sorted[Math.floor(idxWanted)];
    const up = sorted[Math.ceil(idxWanted)];
    return (down + up) / 2;
  };
};

interface Trendline {
  slope: number;
  yIntercept: number;
  r2: number;
}

interface Sums {
  x: number;
  y: number;
  x2: number;
  y2: number;
  xy: number;
}

export const leastSquares = (dataset: Point[]): Trendline => {
  const sums: Sums = dataset.reduce(
    (acc, point) => {
      return {
        x: acc.x + point[0],
        y: acc.y + point[1],
        xy: acc.xy + point[0] * point[1],
        x2: acc.x2 + Math.pow(point[0], 2),
        y2: acc.y2 + Math.pow(point[1], 2),
      };
    },
    {
      x: 0,
      y: 0,
      xy: 0,
      x2: 0,
      y2: 0,
    },
  );
  const n = dataset.length;

  const slope = (n * sums.xy - sums.x * sums.y) /
    (n * sums.x2 - Math.pow(sums.x, 2));

  return {
    slope,
    yIntercept: (sums.y - slope * sums.x) / n,
    r2: (n * sums.xy - sums.x * sums.y) /
      (Math.sqrt(n * sums.x2 - Math.pow(sums.x, 2)) *
        Math.sqrt(n * sums.y2 - Math.pow(sums.y, 2))),
  };
};

/**
 * Round to the nearest factor. Eg round(100) generates a function that rounds
 * to the nearest 100.
 */
export const round = (factor = 1) => {
  if (factor === 1) {
    return Math.round;
  }

  if (factor > 1) {
    return (input: number) => Math.round(input / factor) * factor;
  }

  return (input: number) => Number(input.toFixed(Math.log10(factor) * -1));
};
