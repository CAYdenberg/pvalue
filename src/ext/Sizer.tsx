import { FunctionComponent, JSX, useRef } from "../imports.ts";

import useContainerSizes from "../lib/useContainerSizes.ts";

interface Sizes {
  width: number;
  height: number;
}

interface Props {
  children: (sizes?: Sizes) => JSX.Element;
}

export const Sizer: FunctionComponent<Props> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  const pxBox = useContainerSizes(0, 0, ref);

  return (
    <div ref={ref}>
      {children(
        ref.current ? { width: pxBox.width, height: pxBox.height } : undefined,
      )}
    </div>
  );
};
