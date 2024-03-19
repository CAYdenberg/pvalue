import type { FunctionComponent } from "preact";

interface Props {
  error: Error | unknown;
}

export const ErrorState: FunctionComponent<Props> = ({ error }) => {
  return (error as Error).message
    ? <p class="error">{(error as Error).message}</p>
    : <p class="error">Error during transformation or execution</p>;
};
