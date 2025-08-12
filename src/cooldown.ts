import { useCallback, useState } from "react";

export type CooldownHook = {
  /** Whether the cooldown is currently active. */
  cooling: boolean;

  /* Starts the cooldown timer. */
  start: () => void;
};

export const useCooldown = (cooldown: number): CooldownHook => {
  const [cooling, setCoolingDown] = useState(false);

  const start = useCallback(() => {
    if (cooling || cooldown === 0) return;

    setCoolingDown(true);
    setTimeout(() => {
      setCoolingDown(false);
    }, cooldown);
  }, [cooldown, cooling]);

  return { cooling, start };
};
