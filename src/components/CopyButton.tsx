import { CopyAll } from "@mui/icons-material";
import { useSafeCallback } from "./ErrorBoundary";
import { IconButton } from "./IconButton";

type CopyButtonProps = {
  toCopy: string;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export const CopyButton = ({
  toCopy,
  className,
  disabled,
  icon,
}: CopyButtonProps) => {
  const handleCopy = useSafeCallback(async () => {
    await navigator.clipboard.writeText(toCopy);
  }, []);

  return (
    <IconButton
      onClick={handleCopy}
      className={className}
      disabled={disabled}
      cooldown={2000}
    >
      {icon ?? <CopyAll />}
    </IconButton>
  );
};
