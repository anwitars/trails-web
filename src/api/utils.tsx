import {
  Endpoint,
  EndpointJSONInput,
  EndpointMethod,
  EndpointPathParams,
  EndpointResponses,
} from "./types";

/** Removes all "never" keys in a type, leaving only the keys that have actual values. */
type OptionalIfNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

type UseApiSendOptionsStrict<
  E extends Endpoint,
  M extends EndpointMethod<E>,
> = {
  pathParams: EndpointPathParams<E, M>;
  body: EndpointJSONInput<E, M>;
};

type UseApiSendOptions<
  E extends Endpoint,
  M extends EndpointMethod<E>,
> = OptionalIfNever<UseApiSendOptionsStrict<E, M>>;

export const apiSend = async <E extends Endpoint, M extends EndpointMethod<E>>(
  endpoint: E,
  method: M,
  options: UseApiSendOptions<E, M>,
): Promise<EndpointResponses<E, M>> => {
  const { pathParams, body } = options as UseApiSendOptionsStrict<E, M>;

  // Construct the URL based on the endpoint and method
  let url = process.env.NEXT_PUBLIC_API_URL + endpoint;
  if (pathParams) {
    for (const [key, value] of Object.entries(pathParams)) {
      url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
    }
  }

  let headers = {};
  if (body) {
    headers = {
      "Content-Type": "application/json",
    };
  }

  const requestOptions: RequestInit = {
    method: (method as string).toUpperCase(),
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(url, requestOptions);

  // we will keep the 422 status code for validation errors
  if (!response.ok && response.status !== 422) {
    throw new Error(`Request failed with status ${response.status}`);
  }

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
  } as EndpointResponses<E, M>;
};
