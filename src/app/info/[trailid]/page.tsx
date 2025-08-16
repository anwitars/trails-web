import { apiSend } from "@/api/utils";
import TrailNotFound from "@/components/TrailNotFound";
import { DateTime } from "luxon";
import Link from "next/link";

const formatDateTime = (datetime: DateTime) =>
  datetime.toLocaleString(DateTime.DATETIME_MED);

type RowProps = {
  label: string;
  children: React.ReactNode;
};

const Row = ({ label, children }: RowProps) => {
  return (
    <tr className="py-4">
      <td className="font-medium py-1 pr-4">{label}:</td>
      <td className="text-primary text-right py-1 pl-4">{children}</td>
    </tr>
  );
};

type Props = {
  params: Promise<{
    trailid: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { trailid } = await params;
  const response = await apiSend("/info/{trail_id}", "get", {
    pathParams: {
      trail_id: trailid,
    },
    gracefulNotFound: true,
  });

  if (response.code === 404) {
    return <TrailNotFound />;
  }

  if (response.code !== 200) {
    throw new Error(`Failed to fetch trail info: ${response.data}`);
  }

  const info = response.data;
  const createdAt = DateTime.fromISO(info.created);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-bold mb-8">
        Trail Info for <span className="text-primary">{trailid}</span>
      </h1>
      <div className="card">
        <table className="w-full">
          <tbody>
            <Row label="URL">{<Link href={info.url}>{info.url}</Link>}</Row>
            <Row label="Created At">{formatDateTime(createdAt)}</Row>
            <Row label="Expires at">
              {formatDateTime(createdAt.plus({ hours: info.lifetime }))}
            </Row>
            <Row label="All Visits">{info.visits.all.toString()}</Row>
            <Row label="Unique Visits">{info.visits.unique.toString()}</Row>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
