import Link from "next/link";

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="card flex flex-col gap-6 md:w-2xl lg:w-4xl">{children}</div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h1 className="text-center mb-2 text-4xl">{children}</h1>
);

const SectionContent = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xl text-justify">{children}</p>
);

export default function Page() {
  return (
    <div className="page gap-16">
      {/* Intro */}
      <Section>
        <SectionTitle>About Trails</SectionTitle>
        <SectionContent>
          <strong>Trails</strong> is a simple, open, and privacy-friendly URL
          shortener. It gives you everything you expect from a shortener — but
          without accounts, ads, or hidden tracking. Just shorten links, share
          them, and move on.
        </SectionContent>
      </Section>

      {/* Features */}
      <Section>
        <SectionTitle>Why Trails?</SectionTitle>
        <SectionContent>
          Trails is built around transparency and simplicity:
        </SectionContent>
        <ul className="list-disc list-inside text-xl space-y-2">
          <li>No logins, subscriptions, or paywalls.</li>
          <li>
            <Link href="/info" className="underline">
              Info
            </Link>{" "}
            pages show where a link leads, its lifetime, and visit count.
          </li>
          <li>
            <Link href="/peek" className="underline">
              Peek
            </Link>{" "}
            lets you check the destination of a link without clicking through.
          </li>
          <li>
            Privacy-first: no IPs stored, only hashed data for visit stats.
          </li>
        </ul>
      </Section>

      {/* Transparency */}
      <Section>
        <SectionTitle>Transparency First</SectionTitle>
        <SectionContent>
          Every Trail comes with clear details about its creation, expiration,
          and visits. If you just want to verify a destination before clicking,
          you can always{" "}
          <Link href="/peek" className="underline">
            peek
          </Link>{" "}
          at it safely.
        </SectionContent>
      </Section>
    </div>
  );
}
