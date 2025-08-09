import CreateTrail from "@/components/CreateTrail";

const DESCRIPTION = "An account-free, open-source URL shortener." as const;

const Description = () => (
  <div className="mb-4">
    <p>{DESCRIPTION}</p>
  </div>
);

export default function Home() {
  return (
    <div className="page">
      <h1 className="text-7xl font-bold mb-4">Trails</h1>
      <Description />
      <span className="mb-16" />
      <CreateTrail />
    </div>
  );
}
