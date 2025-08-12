import { useCooldown } from "@/cooldown";
import { useSafeCallback } from "./ErrorBoundary";

export type IconButtonProps = {
  onClick: () => void;
  children: React.ReactNode;

  className?: string;
  disabled?: boolean;

  /* Whether the icon button gets disabled for a cooldown time */
  cooldown?: number;
};

export const IconButton = ({
  onClick,
  children,
  className,
  disabled,
  cooldown: cooldownTime,
}: IconButtonProps) => {
  const cooldown = useCooldown(cooldownTime || 0);

  const handleClick = useSafeCallback(() => {
    cooldown.start();
    onClick();
  }, []);

  return (
    <button
      className={`icon-button ${className || ""} ${
        cooldown.cooling ? "icon-button-disabled" : ""
      }`}
      onClick={handleClick}
      disabled={disabled || cooldown.cooling}
    >
      {children}
    </button>
  );
};
