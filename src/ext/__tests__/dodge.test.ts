import { dodge, offsetXBilateral } from "../dodge.ts";
import { assertEquals } from "assert/assert_equals.ts";

type DatasetPoint = { key: string; x: number; y: number };

Deno.test("dodge", () => {
  const dataset: DatasetPoint[] = [
    { key: "a", x: 0, y: 0 },
    { key: "b", x: 0, y: 1 },
    { key: "c", x: 0, y: 1 },
    { key: "d", x: 0, y: 2 },
    { key: "e", x: 0, y: 2 },
    { key: "f", x: 0, y: 2 },
  ];
  const result = dodge((point: DatasetPoint) => [point.x, point.y])(dataset);
  const expected = [
    { key: "a", x: 0, y: 0, nInBin: 1, indexInBin: 0 },
    { key: "b", x: 0, y: 1, nInBin: 2, indexInBin: 0 },
    { key: "c", x: 0, y: 1, nInBin: 2, indexInBin: 1 },
    { key: "d", x: 0, y: 2, nInBin: 3, indexInBin: 0 },
    { key: "e", x: 0, y: 2, nInBin: 3, indexInBin: 1 },
    { key: "f", x: 0, y: 2, nInBin: 3, indexInBin: 2 },
  ];
  assertEquals(result, expected);
});

const offset = 1;

Deno.test("offsetXBilateral: 1 in bin", () => {
  const nInBin = 1;
  const result = offsetXBilateral(0, nInBin, offset);
  assertEquals(result, [0, 0]);
});

Deno.test("offsetXBilateral: even number in in", () => {
  const nInBin = 2;
  assertEquals(offsetXBilateral(0, nInBin, offset), [-0.5, 0]);
  assertEquals(offsetXBilateral(1, nInBin, offset), [0.5, 0]);
});

Deno.test("offsetXBilateral: odd number in in", () => {
  const nInBin = 3;
  assertEquals(offsetXBilateral(0, nInBin, offset), [0, 0]);
  assertEquals(offsetXBilateral(1, nInBin, offset), [1, 0]);
  assertEquals(offsetXBilateral(2, nInBin, offset), [-1, 0]);
});
