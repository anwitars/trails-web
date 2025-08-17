import { isServerSide } from "./utils";

export type AppConfig = {
  apiUrl: string;
};

let appConfig: Promise<AppConfig> | null = null;

export const getAppConfig = async (): Promise<AppConfig> => {
  if (appConfig !== null) return appConfig;

  if (isServerSide()) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error(
        "NEXT_PUBLIC_API_URL is not defined in the environment variables.",
      );
    }

    return {
      apiUrl,
    } as AppConfig;
  }

  appConfig = fetch("/api/config")
    .then((res) => res.json())
    .then((data) => data as AppConfig)
    .catch((error) => {
      console.error("Failed to fetch app config:", error);
      throw error;
    });

  return appConfig;
};
