export * as d3Array from "https://cdn.skypack.dev/d3-array@3";
// "d3-dsv": "https://cdn.skypack.dev/d3-dsv@3",
// "d3-ease": "https://cdn.skypack.dev/d3-ease@3",
// "d3-interpolate": "https://cdn.skypack.dev/d3-interpolate@3",
export * as d3Scale from "https://cdn.skypack.dev/d3-scale@4";

import * as _d3Shape from "https://cdn.skypack.dev/d3-shape@3";
export const d3Line = _d3Shape.line;
export const d3Symbol = _d3Shape.symbol;
export const d3Shape = _d3Shape;

export { default as debounce } from "https://esm.sh/lodash@4.17.21/debounce";

export { Component, createContext, createRef, Fragment } from "preact";
export {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
export type {
  ComponentChildren,
  FunctionComponent,
  JSX,
  RefObject,
  VNode,
} from "preact";
