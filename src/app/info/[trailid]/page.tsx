import { apiSend } from "@/api/utils";
import { DateTime } from "luxon";

type RowProps = {
  label: string;
  value: string;
};

const Row = ({ label, value }: RowProps) => {
  return (
    <tr className="py-4">
      <td className="font-medium py-1 pr-4">{label}:</td>
      <td className="text-primary text-right py-1 pl-4">{value}</td>
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
  });

  if (response.code !== 200) {
    throw new Error(`Failed to fetch trail info: ${response.data}`);
  }

  const info = response.data;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-bold mb-8">
        Trail Info for <span className="text-primary">{trailid}</span>
      </h1>
      <div className="card">
        <table className="w-full">
          <tbody>
            <Row label="URL" value={info.url} />
            <Row
              label="Created At"
              value={DateTime.fromISO(info.created).toLocaleString(
                DateTime.DATETIME_MED,
              )}
            />
            <Row label="All Visits" value={info.visits.all.toString()} />
            <Row label="Unique Visits" value={info.visits.unique.toString()} />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
