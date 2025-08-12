import { CopyAll } from "@mui/icons-material";
import { useSafeCallback } from "./ErrorBoundary";
import { IconButton } from "./IconButton";

type CopyButtonProps = {
  toCopy: string;
  className?: string;
  disabled?: boolean;
};

export const CopyButton = ({
  toCopy,
  className,
  disabled,
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
      <CopyAll />
    </IconButton>
  );
};
