import { d3Shape, d3Symbol } from "../imports.ts";

const {
  curveBasisOpen,
  curveCardinalOpen,
  curveLinear,
  curveNatural,
  curveStepBefore,
  symbolCircle,
  symbolCross,
  symbolDiamond,
  symbolSquare,
  symbolStar,
  symbolTriangle,
  symbolWye,
} = d3Shape;

export type CurveFactory = typeof curveLinear;
export type CurveType = "linear" | "cardinal" | "natural" | "basis" | "step";

export const getD3Curve = (input?: CurveType | CurveFactory): CurveFactory => {
  if (!input) {
    return curveLinear;
  }

  if (typeof input !== "string") return input;

  switch (input) {
    case "cardinal":
      return curveCardinalOpen;

    case "natural":
      return curveNatural as unknown as CurveFactory;

    case "basis":
      return curveBasisOpen;

    case "step":
      return curveStepBefore;
  }

  return curveLinear;
};

export const DASHED_LINE = [5, 5];
export const DOTTED_LINE = [1, 1];
export type DashType = "solid" | "dashed" | "dotted" | Array<number> | null;

export const getDashArray = (input: DashType): Array<number> | null => {
  if (typeof input !== "string") return input;

  switch (input) {
    case "solid":
      return null;

    case "dashed":
      return DASHED_LINE;

    case "dotted":
      return DOTTED_LINE;
  }
};

export type D3SymbolType = typeof d3Symbol;
export type SymbolType =
  | "circle"
  | "cross"
  | "diamond"
  | "square"
  | "star"
  | "triangle"
  | "wye"
  | "none";

export const getD3Symbol = (input?: SymbolType | D3SymbolType) => {
  if (typeof input !== "string") {
    return input;
  }

  switch (input) {
    case "cross":
      return symbolCross;

    case "diamond":
      return symbolDiamond;

    case "square":
      return symbolSquare;

    case "star":
      return symbolStar;

    case "triangle":
      return symbolTriangle;

    case "wye":
      return symbolWye;

    case "none":
      return null;
  }

  return symbolCircle;
};
