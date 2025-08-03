import { ReactNode, JSX } from "react";

type CardProps = {
  children: ReactNode;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
};

export const Card = ({
  children,
  tag,
  className: extraClassName,
}: CardProps) => {
  const Tag = tag || "div";

  const className = `bg-[#001938] shadow-md rounded-lg p-6 ${extraClassName || ""}`;

  return <Tag className={className}>{children}</Tag>;
};

export const SimpleCard = ({ children }: { children: ReactNode }) => {
  return <Card>{children}</Card>;
};

export const ValidationErrorCard = ({ errors }: { errors?: string[] }) => {
  if (!errors) return null;

  return (
    <Card tag="ul" className="bg-red-700 py-3 px-8 mt-2">
      {errors.map((error, index) => (
        <li key={index} className="text-white-700 text-sm list-disc">
          {error}
        </li>
      ))}
    </Card>
  );
};
