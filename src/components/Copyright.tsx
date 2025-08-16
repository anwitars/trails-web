import Link from "next/link";

export const Copyright = () => (
  <div className="text-center text-sm text-gray-500 mt-8 mb-4">
    &copy; {new Date().getFullYear()} anwitars. All rights reserved.{" "}
    <Link
      href="https://github.com/anwitars/tiny-trails/blob/master/LICENSE"
      target="_blank"
    >
      MIT License.
    </Link>
  </div>
);
