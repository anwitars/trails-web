/* eslint-disable @typescript-eslint/no-unsafe-function-type */
"use client";

import { Component, DependencyList, useCallback, useState } from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  error: Error | undefined;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("Error caught by ErrorBoundary:", error);
  }

  render() {
    if (this.state.error) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export type FunctionWrapper<Args extends unknown[], Return> = (
  fn: (...args: Args) => Promise<Return>,
) => (...args: Args) => Promise<Return>;

export type ErrorCatcherHook = {
  error: Error | undefined;
  setError: React.Dispatch<React.SetStateAction<Error | undefined>>;
  wrapper: <T extends Function>(fn: T) => T;
};

export function useErrorCatcher(): ErrorCatcherHook {
  const [error, setError] = useState<Error | undefined>(undefined);

  const wrapper = useCallback(
    <T extends Function>(fn: T): T =>
      ((...args: unknown[]) => {
        // check if function is async
        const isAsync = fn.constructor.name === "AsyncFunction";
        if (isAsync) {
          return fn(...args).catch((err: Error) => {
            setError(err);
            console.error("Error caught by useErrorCatcher:", err);
            throw err;
          });
        } else {
          return fn(...args);
        }
      }) as unknown as T,
    [],
  );

  if (error) {
    console.error("Error caught by useErrorCatcher:", error);
    throw error;
  }

  return {
    error,
    setError,
    wrapper,
  };
}

export function useSafeCallback<T extends Function>(
  fn: T,
  dependencies: DependencyList,
): T {
  const errorCatcher = useErrorCatcher();

  return useCallback(
    ((...args: unknown[]) => errorCatcher.wrapper(fn)(...args)) as unknown as T,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [errorCatcher, fn, ...dependencies],
  );
}
