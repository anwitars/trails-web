import {
  Endpoint,
  EndpointJSONInput,
  EndpointMethod,
  EndpointPathParams,
  EndpointResponses,
} from "./types";

type TrailsHeader = "X-Trail-Token";

/** Removes all "never" keys in a type, leaving only the keys that have actual values. */
type OptionalIfNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

type UseApiSendInputOptionsStrict<
  E extends Endpoint,
  M extends EndpointMethod<E>,
> = {
  pathParams: EndpointPathParams<E, M>;
  body: EndpointJSONInput<E, M>;
  headers?: Record<TrailsHeader, string>;
};

type UseApiSendInputOptions<
  E extends Endpoint,
  M extends EndpointMethod<E>,
> = OptionalIfNever<UseApiSendInputOptionsStrict<E, M>>;

type UseApiSendOptions<Inputs, GracefulNotFound extends boolean> = {
  gracefulNotFound?: GracefulNotFound;
} & Inputs;

export const apiSend = async <
  E extends Endpoint,
  M extends EndpointMethod<E>,
  GracefulNotFound extends boolean = false,
>(
  endpoint: E,
  method: M,
  options: UseApiSendOptions<UseApiSendInputOptions<E, M>, GracefulNotFound>,
): Promise<EndpointResponses<E, M, GracefulNotFound>> => {
  const { pathParams, body, headers, gracefulNotFound } =
    options as UseApiSendOptions<
      UseApiSendInputOptionsStrict<E, M>,
      GracefulNotFound
    >;

  // Construct the URL based on the endpoint and method
  let url = process.env.NEXT_PUBLIC_API_URL + endpoint;
  if (pathParams) {
    for (const [key, value] of Object.entries(pathParams)) {
      url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
    }
  }

  const reqHeaders: Record<string, string> = headers || {};
  if (body) {
    reqHeaders["Content-Type"] = "application/json";
  }

  const requestOptions: RequestInit = {
    method: (method as string).toUpperCase(),
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(url, requestOptions);

  // we will keep the 422 status code for validation errors
  if (
    !response.ok &&
    response.status !== 422 &&
    (response.status !== 404 || !gracefulNotFound)
  ) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204)
    return { code: 204 } as EndpointResponses<E, M, GracefulNotFound>;

  let data;
  const contentType = response.headers.get("Content-Type");

  if (contentType?.includes("application/json")) {
    data = await response.json();
  } else if (contentType?.includes("text/plain")) {
    data = await response.text();
  } else {
    throw new Error("Unsupported content type");
  }

  return {
    code: response.status,
    data,
  } as unknown as EndpointResponses<E, M, GracefulNotFound>;
};
