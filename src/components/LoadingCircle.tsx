type LoadingCircleProps = {
  color?: string;
};

const LoadingCircle = ({ color = "gray-200" }: LoadingCircleProps) => {
  return (
    <svg
      className={`animate-spin h-6 w-6 text-${color}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-50"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-80"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
};

export default LoadingCircle;
