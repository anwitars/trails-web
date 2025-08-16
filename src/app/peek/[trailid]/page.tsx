import { apiSend } from "@/api/utils";
import TrailNotFound from "@/components/TrailNotFound";
import Link from "next/link";

type Props = {
  params: Promise<{
    trailid: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { trailid } = await params;
  const response = await apiSend("/peek/{trail_id}", "get", {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-bold mb-8">
        Trail would be traversed to{" "}
        <Link href={response.data}>{response.data}</Link>
      </h1>
    </div>
  );
};

export default Page;
