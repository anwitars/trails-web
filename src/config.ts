export type AppConfig = {
  apiUrl: string;
};

let appConfig: Promise<AppConfig> | null = null;

export const getAppConfig = async (): Promise<AppConfig> => {
  if (appConfig !== null) return appConfig;

  appConfig = fetch("/api/config")
    .then((res) => res.json())
    .then((data) => data as AppConfig)
    .catch((error) => {
      console.error("Failed to fetch app config:", error);
      throw error;
    });

  return appConfig;
};
