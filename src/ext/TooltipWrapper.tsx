import { FunctionComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";

interface Props {
  onRequestClose?: () => void;
}

export const TooltipWrapper: FunctionComponent<Props> = (
  { onRequestClose, children },
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        onRequestClose && ref.current &&
        !ref.current.contains(event.target as Element)
      ) {
        onRequestClose();
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [onRequestClose]);

  return (
    <div
      ref={ref}
      role="tooltip"
      aria-live="polite"
    >
      {children}
    </div>
  );
};
