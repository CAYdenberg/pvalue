import { Fragment, FunctionComponent, JSX } from "preact";
import useContainerSizes from "../src/lib/useContainerSizes.ts";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

interface Props {
  app: (width: number) => JSX.Element;
  data: Array<Record<string, number | string>>;
}

export const Container: FunctionComponent<Props> = ({ app, data }) => {
  const [isChart, setIsChart] = useState(true);

  const ref = useRef<HTMLDivElement>(null);
  const v = useContainerSizes(812, 812, ref);
  const [width, setWidth] = useState<number | null>(null);
  const onChange = useCallback((ev: Event) => {
    const value = (ev.target as HTMLInputElement).value;
    const numValue = Number(value);
    if (numValue && !isNaN(numValue)) {
      setWidth(numValue);
    }
  }, []);
  useEffect(() => {
    setWidth(v.width);
  }, [v.hash]);

  return (
    <Fragment>
      <div class="tabs is-left">
        <ul>
          <li class={isChart ? "is-active" : ""}>
            <a onClick={() => setIsChart(true)}>
              <span>Chart</span>
            </a>
          </li>
          <li class={isChart ? "" : "is-active"}>
            <a onClick={() => setIsChart(false)}>
              <span>Data</span>
            </a>
          </li>
        </ul>
      </div>

      {isChart
        ? (
          <>
            <div class="level">
              <div class="field is-horizontal level-item">
                <div class="field-label">
                  <label class="label pr-2">Width</label>
                </div>
                <div class="field-body">
                  <input
                    type="number"
                    class="control"
                    min={300}
                    max={v.width}
                    step={20}
                    value={width || 812}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
            <div class="is-vcentered">
              <div style={{ width }} ref={ref}>
                {width ? app(width) : null}
              </div>
            </div>
          </>
        )
        : (
          <div class="table-container">
            <table class="table is-bordered is-fullwidth">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    {Object.keys(row).map((key) => <td key={key}>{row[key]}
                    </td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </Fragment>
  );
};
