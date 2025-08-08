import { useCallback, useState } from "react";

export type CooldownHook = {
  cooling: boolean;
  start: () => void;
};

export const useCooldown = (cooldown: number): CooldownHook => {
  const [cooling, setCoolingDown] = useState(false);

  const start = useCallback(() => {
    if (cooling) return;

    setCoolingDown(true);
    setTimeout(() => {
      setCoolingDown(false);
    }, cooldown);
  }, [cooldown, cooling]);

  return { cooling, start };
};
