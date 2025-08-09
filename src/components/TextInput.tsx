const ValidationErrorCard = ({ errors }: { errors?: string[] }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="card-validation-error">
      <ul className="text-sm list-disc">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  errors?: string[];
  required?: boolean;
  className?: string;
  type?: "text" | "email" | "url";
  disabled?: boolean;
};

export const TextInput = ({
  value,
  onChange,
  placeholder,
  errors,
  required = false,
  className,
  type = "text",
  disabled = false,
}: TextInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          Boolean(errors?.length) ? "border-red-500" : ""
        }`}
        required={required}
        disabled={disabled}
      />
      <ValidationErrorCard errors={errors} />
    </div>
  );
};

type LabeledTextInputProps = TextInputProps & { label: string };

export const LabeledTextInput = ({
  label,
  ...textInputProps
}: LabeledTextInputProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-2">{label}</label>
    <TextInput {...textInputProps} />
  </div>
);
