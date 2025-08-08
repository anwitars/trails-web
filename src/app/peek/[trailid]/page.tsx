import { apiSend } from "@/api/utils";

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
  });

  if (response.code !== 200) {
    throw new Error(`Failed to fetch trail info: ${response.data}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-bold mb-8">
        Trail would be traversed to <a href={response.data}>{response.data}</a>
      </h1>
    </div>
  );
};

export default Page;
