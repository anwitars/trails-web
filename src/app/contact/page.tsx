import Link from "next/link";

export default function Page() {
  return (
    <div className="page gap-16">
      <div className="card flex flex-col gap-6">
        <h1 className="text-center mb-2 text-6xl font-bold">Contact</h1>
        <p className="text-2xl text-justify">
          Trails is an open-source project, and we’d love to hear from you!
        </p>
        <ul className="list-disc list-inside text-2xl space-y-2">
          <li>
            Found a bug or have a feature request? Open an issue on{" "}
            <Link
              href="https://github.com/anwitars/trails-web/issues"
              target="_blank"
            >
              GitHub
            </Link>
            .
          </li>
          <li>
            Prefer email? Reach out to{" "}
            <a href="mailto:anwitarsbusiness@gmail.com">
              anwitarsbusiness@gmail.com
            </a>
            .
          </li>
        </ul>
      </div>
    </div>
  );
}
