export const deepEqual = <T>(a: T, b: T): boolean => {
  if (a === b) return true;
  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a == null ||
    b == null
  ) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (
      !keysB.includes(key) ||
      !deepEqual((a as never)[key], (b as never)[key])
    ) {
      return false;
    }
  }

  return true;
};

export const shortenString = (str: string, maxLength: number): string => {
  if (str.length > maxLength) {
    const firstPart = str.substring(0, maxLength / 2);
    const secondPart = str.substring(str.length - maxLength / 2);
    return `${firstPart}...${secondPart}`;
  } else return str;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const trailIdToUrl = (id: string): string =>
  `${process.env.NEXT_PUBLIC_API_URL}/t/${id}`;
