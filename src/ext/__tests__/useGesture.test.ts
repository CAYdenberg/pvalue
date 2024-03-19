import { ChartEvent } from "pvalue/mod.ts";
import { updateTouchList, TouchList, recognizer } from "../useGesture.tsx";
import { assertEquals } from "assert/assert_equals.ts";

Deno.test("updateTouchList: first onPointerDown", () => {
  const init: TouchList = {};
  const result = updateTouchList(init, {
    event: {
      type: "pointerdown",
      pointerId: 1,
      clientX: 0,
      clientY: 0,
      timeStamp: 0,
    },
  } as ChartEvent);

  assertEquals(Object.keys(result).length, 1);
});

Deno.test("updateTouchList: second onPointerDown same finger", () => {
  const init = updateTouchList({}, {
    event: {
      type: "pointerdown",
      pointerId: 1,
      clientX: 0,
      clientY: 0,
      timeStamp: 0,
    },
  } as ChartEvent);
  const result = updateTouchList(init, {
    event: {
      type: "pointerdown",
      pointerId: 1,
      clientX: 1,
      clientY: 1,
      timeStamp: 1,
    },
  } as ChartEvent);

  assertEquals(Object.keys(result).length, 1);
});

Deno.test("updateTouchList: second onPointerDown different finger", () => {
  const init = updateTouchList({}, {
    event: {
      type: "pointerdown",
      pointerId: 1,
      clientX: 0,
      clientY: 0,
      timeStamp: 0,
    },
  } as ChartEvent);
  const result = updateTouchList(init, {
    event: {
      type: "pointerdown",
      pointerId: 2,
      clientX: 1,
      clientY: 1,
      timeStamp: 1,
    },
  } as ChartEvent);

  assertEquals(Object.keys(result).length, 2);
});

Deno.test("updateTouchList: move", () => {
  const init = updateTouchList({}, {
    event: {
      type: "pointerdown",
      pointerId: 1,
      clientX: 0,
      clientY: 0,
      timeStamp: 0,
    },
  } as ChartEvent);
  const result = updateTouchList(init, {
    event: {
      type: "pointermove",
      pointerId: 1,
      clientX: 1,
      clientY: 1,
      timeStamp: 1,
    },
  } as ChartEvent);

  assertEquals(Object.keys(result).length, 1);
  assertEquals(result[1]?.last.pos, [1, 1]);
});

Deno.test("updateTouchList: move with no pointer down", () => {
  const init = {};
  const result = updateTouchList(init, {
    event: {
      type: "pointermove",
      pointerId: 1,
      clientX: 0,
      clientY: 0,
      timeStamp: 0,
    },
  } as ChartEvent);

  assertEquals(Object.keys(result).length, 0);
});

Deno.test("updateTouchList: up", () => {
  const init = updateTouchList({}, {
    event: {
      type: "pointerdown",
      pointerId: 1,
      clientX: 0,
      clientY: 0,
      timeStamp: 0,
    },
  } as ChartEvent);
  const result = updateTouchList(init, {
    event: {
      type: "pointerup",
      pointerId: 1,
      clientX: 1,
      clientY: 1,
      timeStamp: 1,
    },
  } as ChartEvent);

  assertEquals(result[1], null);
});

Deno.test("recognizer: drag", () => {
  const init = updateTouchList({}, {
    event: {
      type: "pointerdown",
      pointerId: 1,
      clientX: 0,
      clientY: 0,
      timeStamp: 0,
    },
  } as ChartEvent);

  const chartEvent = {
    event: {
      type: "pointermove",
      pointerId: 1,
      clientX: 10,
      clientY: 10,
      timeStamp: 10,
    },
    delta: [1, 1],
  } as ChartEvent;

  const touchList = updateTouchList(init, chartEvent);
  const result = recognizer(touchList, chartEvent);

  assertEquals(result.drag, [1, 1]);
});
