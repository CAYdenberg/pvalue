import { assertEquals } from "assert/assert_equals.ts";
import { dist, round, leastSquares } from "../numty.ts";
import type { Point } from "pvalue";

const inst = dist([0, 0, 2, 3, 3, 5, 7, 7, 8, 10, 10]);

Deno.test("dist: medain", () => {
  assertEquals(inst(0.5), 5);
});

Deno.test("dist: q25", () => {
  assertEquals(inst(0.25), 2.5);
});

Deno.test("round: factors greater than 1", () => {
  assertEquals(round(10)(61.23), 60);
});

Deno.test("round: prevent annoying excess digits", () => {
  assertEquals(round(0.1)(6.1123094818732541), 6.1);
});

// Example taken from:
// https://statisticsbyjim.com/regression/least-squares-regression-line/
Deno.test("least squares", () => {
  const dataset: Point[] = [
    [1, 11],
    [3, 16],
    [4, 15],
    [6, 20],
    [8, 18],
  ];

  const result = leastSquares(dataset);

  assertEquals(round(0.0001)(result.slope), 1.0616);
  assertEquals(round(0.001)(result.yIntercept), 11.329);
});
