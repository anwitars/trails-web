import * as z from "zod";
import { deepEqual } from "@/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ErrorTree<T> = z.core.$ZodErrorTree<T>;

export type FormOptions = {
  /// Auto validate on every change
  autoValidate?: boolean;

  /// If true, even if the value has never been changed, it will still validate the value
  allowValidateUnchanged?: boolean;
};

export type Form<T> = {
  values: T;
  setValues: (partial: Partial<T>) => void;
  errors: ErrorTree<T> | undefined;
  validate: (data: T) => boolean;
  hasChanged: boolean;
  valid: boolean;
};

export function useForm<T>(
  schema: z.ZodSchema<T>,
  initialValue: T,
  options?: FormOptions,
): Form<T> {
  const [values, setValues] = useState<T>(initialValue);
  const [errors, setErrors] = useState<ErrorTree<T> | undefined>(undefined);
  const valid = useMemo(() => errors === undefined, [errors]);
  const initialRef = useRef(initialValue);

  const hasChanged = useMemo(() => {
    return deepEqual(values, initialRef.current) === false;
  }, [values]);

  const validate = useCallback(
    (data: T) => {
      if (!hasChanged && !options?.allowValidateUnchanged) {
        setErrors(undefined);
        return true;
      }

      const result = schema.safeParse(data);

      if (result.success) {
        setErrors(undefined);
        return true;
      } else {
        setErrors(z.treeifyError(result.error));
        return false;
      }
    },
    [hasChanged, options?.allowValidateUnchanged, schema],
  );

  const partialSetValues = useCallback(
    (partial: Partial<T>) => {
      setValues((prev) => ({ ...prev, ...partial }));
    },
    [setValues],
  );

  // it is safe to assume that autoValidate will either be enable indefinitely or not at all for
  // a component
  if (options?.autoValidate) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      validate(values);
    }, [values, validate]);
  }

  return {
    values,
    setValues: partialSetValues,
    errors,
    validate,
    hasChanged,
    valid,
  };
}
