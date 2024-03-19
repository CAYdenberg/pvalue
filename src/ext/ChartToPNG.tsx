import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { renderToString } from "https://esm.sh/*preact-render-to-string@6.2.2";

import { ComponentChildren, createRef, VNode } from "../imports.ts";

import { Props as ChartProps } from "../components/Chart.tsx";
import Viewbox, { createViewbox } from "../lib/Viewbox.ts";
import { normalize } from "../lib/normalize.ts";
import { getScale } from "../lib/geometry.ts";
import { Gutter } from "../lib/types.ts";
import { ChartState, PxLine } from "../mod.ts";
import { ChartStateContext } from "../lib/ChartState.tsx";

interface Options {
  backgroundColor?: string;
  mimeType?: "image/png" | "image/jpeg";
}

const ChartToPNG =
  ({ backgroundColor, mimeType }: Options) =>
  (node: VNode<ChartProps & { children: ComponentChildren }>): Uint8Array => {
    const width = normalize(node.props.ssWidth, 600);
    const _height = normalize(node.props.height, 315);
    const height = typeof _height === "function" ? _height(width) : _height;

    const gutter: Gutter = normalize(node.props.gutter, [0, 0, 0, 0]);
    const origin = normalize(node.props.origin, "bottom-left");

    const pxBox = createViewbox([
      0,
      0,
      width,
      height,
    ]);

    const cartesianBox: Viewbox = createViewbox(
      typeof node.props.view === "function"
        ? node.props.view(pxBox.width)
        : node.props.view,
    );

    const { scale, reverseScale } = getScale(
      cartesianBox,
      pxBox,
      gutter,
      origin,
    );

    const canvas = createCanvas(width, height);
    const canvasContext = canvas.getContext(
      "2d",
    ) as unknown as CanvasRenderingContext2D;
    const dpr = 1;
    canvasContext.scale(dpr, dpr);

    canvasContext.clearRect(0, 0, pxBox.x[1], pxBox.y[1]);
    canvasContext.setTransform(1, 0, 0, 1, 0, 0);

    const chartState: ChartState = {
      pushToCanvasQueue: (
        func: (context: CanvasRenderingContext2D, dpr: number) => void,
      ) => {
        canvasContext.save();
        canvasContext.scale(dpr, dpr);
        func(canvasContext, dpr);

        canvasContext.globalAlpha = 1;
        canvasContext.restore();
        canvasContext.setTransform(1, 0, 0, 1, 0, 0);
      },
      isCanvas: true,
      pxBox,
      cartesianBox,
      scale,
      reverseScale,
      containerRef: createRef(),
    };

    renderToString(
      <ChartStateContext.Provider value={chartState}>
        {backgroundColor
          ? (
            <PxLine
              path={[
                [0, 0],
                [pxBox.xMax, 0],
                [pxBox.xMax, pxBox.yMax],
                [0, pxBox.yMax],
                [0, 0],
              ]}
              fill={backgroundColor}
            />
          )
          : null}
        {node.props.children}
      </ChartStateContext.Provider>,
    );

    return canvas.toBuffer(mimeType);
  };

export default ChartToPNG;
