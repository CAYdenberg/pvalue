import { useCallback, useRef, useState } from "../imports.ts";

export interface ChartAnimation<T> {
  duration: number;
  step: (progress: number) => T;
}

const isTransitionAnimation = <T>(
  input: ChartAnimation<T> | T | ((prevState: T) => T),
): input is ChartAnimation<T> => !!(input as ChartAnimation<T>).duration;

const useStateTransition = <T>(initialState: T) => {
  const [currentState, setCurrentState] = useState<T>(initialState);
  const [isAnimating, setIsAnimating] = useState(false);

  const timer = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  const cancelAnimation = useCallback(() => {
    if (timer.current) {
      cancelAnimationFrame(timer.current);
    }
    timer.current = null;
    startTime.current = null;
    setIsAnimating(false);
  }, []);

  const setState = useCallback(
    (next: T | ((prevState: T) => T) | ChartAnimation<T>) => {
      cancelAnimation();

      if (!isTransitionAnimation(next)) {
        setCurrentState(next);
        return;
      }

      const step = (time: number) => {
        if (!startTime.current) {
          startTime.current = time;
          timer.current = requestAnimationFrame(step);
          return;
        }

        const progress = (time - startTime.current) / next.duration;

        if (progress > 1) {
          const result = next.step(1);
          setCurrentState(result);
          cancelAnimation();
        } else {
          setCurrentState(next.step(progress));
        }

        if (timer.current) {
          timer.current = requestAnimationFrame(step);
        }
      };

      timer.current = requestAnimationFrame(step);
      setIsAnimating(true);

      // cancelAnimation has no dependencies
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [currentState],
  );

  return [currentState, setState, isAnimating] as const;
};

export default useStateTransition;
