// deno-lint-ignore-file no-var no-explicit-any

import { Fragment, h } from "preact";
import * as _hooks from "preact/hooks";

import * as _d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {
  Chart as _Chart,
  Circle as _Circle,
  Clip as _Clip,
  createViewbox as _createViewbox,
  createViewboxFromData as _createViewboxFromData,
  Handle as _Handle,
  Line as _Line,
  PxCircle as _PxCircle,
  PxLine as _PxLine,
  Symbol as _Dot,
  Text as _Text,
  TranslatedLine as _TranslatedLine,
  useChartState as _useChartState,
  Viewbox as _Viewbox,
} from "../src/mod.ts";

import * as _axes from "../src/ext/Axis/mod.ts";
import * as _dodge from "../src/ext/dodge.ts";
import _useStateTransition from "../src/ext/useStateTransition.ts";
import _useGesture from "../src/ext/useGesture.tsx";

declare global {
  var React: any;

  var hooks: typeof _hooks;

  var d3: typeof _d3;

  var Chart: typeof _Chart;
  var Clip: typeof _Clip;
  var Dot: typeof _Dot;
  var TextEl: typeof _Text;
  var Handle: typeof _Handle;
  var Line: typeof _Line;
  var TranslatedLine: typeof _TranslatedLine;
  var PxLine: typeof _PxLine;
  var Circle: typeof _Circle;
  var PxCircle: typeof _PxCircle;
  var useChartState: typeof _useChartState;
  var createViewbox: typeof _createViewbox;
  var createViewboxFromData: typeof _createViewboxFromData;

  type Viewbox = _Viewbox;

  var axes: typeof _axes;
  var useStateTransition: typeof _useStateTransition;
  var useGesture: typeof _useGesture;
  var dodge: typeof _dodge;
}

globalThis.React = { createElement: h, Fragment: Fragment };

globalThis.hooks = _hooks;

globalThis.d3 = _d3;

// core
globalThis.Chart = _Chart;
globalThis.Chart = _Chart;
globalThis.Clip = _Clip;
globalThis.Dot = _Dot;
globalThis.TextEl = _Text;
globalThis.Handle = _Handle;
globalThis.Line = _Line;
globalThis.TranslatedLine = _TranslatedLine;
globalThis.PxLine = _PxLine;
globalThis.Circle = _Circle;
globalThis.PxCircle = _PxCircle;
globalThis.useChartState = _useChartState;
globalThis.createViewbox = _createViewbox;
globalThis.createViewboxFromData = _createViewboxFromData;

// extensions
globalThis.axes = _axes;
globalThis.dodge = _dodge;
globalThis.useStateTransition = _useStateTransition;
globalThis.useGesture = _useGesture;
