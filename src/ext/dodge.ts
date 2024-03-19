export const dodge =
  <P>(getXY: (datapoint: P) => [number, number]) =>
  (dataset: P[]): Array<P & { nInBin: number; indexInBin: number }> => {
    const points = dataset.map(getXY);

    return dataset.map((datapoint, i) => {
      const point = getXY(datapoint);

      let nInBin = 0;
      let indexInBin = 0;
      points.forEach((xy, j) => {
        if (xy[0] !== point[0] || xy[1] !== point[1]) {
          return;
        }
        nInBin++;
        if (j < i) indexInBin++;
      });

      return { ...datapoint, nInBin, indexInBin };
    });
  };

export const offsetXBilateral = (
  indexInBin: number,
  nInBin: number,
  offset: number
): [number, number] => {
  const disp =
    indexInBin % 2 === 1
      ? Math.ceil(indexInBin / 2) * offset
      : (indexInBin / 2) * offset * -1;

  const corrected = nInBin % 2 === 1 ? disp : disp - 0.5 * offset;
  return [corrected, 0];
};
