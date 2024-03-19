import { useCallback, useRef } from "../imports.ts";
import { ChartEvent, ChartEventHandler, Point } from "../mod.ts";

export type GestureCallback = ({
  delta,
}: {
  delta: Point;
  lastEvent: ChartEvent;
}) => void;

export type TouchList = Record<
  number,
  {
    start: {
      pos: Point;
      time: number;
    };
    last: {
      pos: Point;
      time: number;
    };
  } | null
>;

interface Gestures {
  onDrag?: GestureCallback;
  onSwipe?: GestureCallback;
  onScroll?: GestureCallback;
  onPinch?: GestureCallback;
}

interface GestureEvents {
  onPointerDown: ChartEventHandler;
  onPointerUp: ChartEventHandler;
  onPointerMove: ChartEventHandler;
  onPointerLeave: ChartEventHandler;
}

interface Recognized {
  drag?: Point;
  swipe?: Point;
  pinch?: Point;
}

const SWIPE_MIN_PX = 100;
const SWIPE_MAX_TIME = 300;

export const updateTouchList = (
  touchList: TouchList,
  ev: ChartEvent,
): TouchList => {
  const { type, pointerId, clientX, clientY, timeStamp } = ev.event;

  if (type === "pointerdown") {
    return {
      ...touchList,
      [pointerId]: {
        start: {
          pos: [clientX, clientY],
          time: timeStamp,
        },
        last: {
          pos: [clientX, clientY],
          time: timeStamp,
        },
      },
    };
  }

  if (type === "pointermove") {
    if (!touchList[pointerId]) return touchList;

    return {
      ...touchList,
      [pointerId]: {
        start: touchList[pointerId]!.start,
        last: {
          pos: [clientX, clientY],
          time: timeStamp,
        },
      },
    };
  }

  if (["pointerup", "pointerleave"].includes(type)) {
    return {
      ...touchList,
      [pointerId]: null,
    };
  }

  return touchList;
};

export const recognizer = (
  touchList: TouchList,
  ev: ChartEvent,
): Recognized => {
  const { type, pointerId, clientX, clientY, timeStamp } = ev.event;

  const isDrag = !!touchList[pointerId];

  let swipe: Point = [0, 0];
  const start = touchList[pointerId]?.start;
  if (start) {
    const dX = clientX - start.pos[0];
    const dY = clientY - start.pos[1];
    const dT = timeStamp - start.time;
    if (Math.abs(dX) > SWIPE_MIN_PX && dT < SWIPE_MAX_TIME) {
      swipe = [dX > 0 ? 1 : -1, 0];
    }
    if (Math.abs(dY) > SWIPE_MIN_PX && dT < SWIPE_MAX_TIME) {
      swipe = [swipe[0], dY > 0 ? 1 : -1];
    }
  }

  return {
    drag: isDrag ? ev.delta : undefined,
    swipe: swipe[0] || swipe[1] ? swipe : undefined,
  };
};

const useGesture = ({ onDrag, onSwipe }: Gestures): GestureEvents => {
  const touchList = useRef<TouchList>({});

  const onPointerDown = useCallback((ev: ChartEvent) => {
    touchList.current = updateTouchList(touchList.current, ev);
  }, []);

  const onPointerMove = useCallback(
    (ev: ChartEvent) => {
      const recognized = recognizer(touchList.current, ev);
      if (recognized.drag) {
        onDrag && onDrag({ delta: recognized.drag, lastEvent: ev });
      }
      touchList.current = updateTouchList(touchList.current, ev);
    },
    [onDrag],
  );

  const onPointerUp = useCallback(
    (ev: ChartEvent) => {
      const recognized = recognizer(touchList.current, ev);
      if (recognized.swipe) {
        onSwipe && onSwipe({ delta: recognized.swipe, lastEvent: ev });
      }
      touchList.current = updateTouchList(touchList.current, ev);
    },
    [onSwipe],
  );

  const onPointerLeave = useCallback((ev: ChartEvent) => {
    touchList.current = updateTouchList(touchList.current, ev);
  }, []);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave,
  };
};

export default useGesture;
