/* eslint-disable @typescript-eslint/no-unused-vars */

// Just to have fun with TypeScript's type system, I tried to implement a basic
// type-safe API client based on the OpenAPI schema. It does not cover all the
// cases, but just enough for my current needs.

import { ApiSchema } from "./schema";

/**
 * Since all the schema references start with `#/components/schemas/`, we can
 * just strip that prefix to get the actual schema name.
 * */
type StripSchemaPrefix<T extends string> =
  T extends `#/components/schemas/${infer Name}` ? Name : T;

/** Convert a string representation of a number to a number type. */
type StringToNumber<S extends string> = S extends `${infer N extends number}`
  ? N
  : never;

/** All the endpoints in the API schema. */
export type Endpoint = keyof ApiSchema["paths"];

/** All the methods for a given endpoint. */
export type EndpointMethod<K extends Endpoint> = keyof ApiSchema["paths"][K];

/** Creates a type that represents the path parameters for a given endpoint and method. */
export type EndpointPathParams<
  K extends Endpoint,
  M extends EndpointMethod<K>,
> = ApiSchema["paths"][K][M] extends {
  parameters: infer P;
}
  ? P extends readonly {
      name: infer N;
      schema: { type: string };
    }[]
    ? { [Param in P[number] as N & string]: string }
    : never
  : never;

/** Converts an OpenAPI schema literal type represented as a string to a TypeScript type. */
type OpenAPILiteral<K> = K extends "string"
  ? string
  : K extends "number" | "integer"
    ? number
    : unknown;

/** Same as [OpenAPILiteral] but for arrays. */
type OpenAPIArray<T> = T extends { type: "array"; items: infer Items }
  ? SchemaType<Items>[]
  : never;

/** All component schemas in the API schema. */
type ComponentSchemas = ApiSchema["components"]["schemas"];

/** Resolves a component schema reference to its actual type. */
type ComponentSchemaRef<T> = T extends {
  $ref: infer Ref;
}
  ? Ref extends string
    ? StripSchemaPrefix<Ref> extends keyof ComponentSchemas
      ? ComponentSchema<StripSchemaPrefix<Ref>>
      : never
    : never
  : never;

/** All-in-one resolver for OpenAPI schema types that uses the above defined helper types. */
type SchemaType<T> = T extends { $ref: string }
  ? ComponentSchemaRef<T>
  : T extends { type: infer Type }
    ? Type extends "string" | "number" | "integer"
      ? OpenAPILiteral<Type>
      : Type extends "array"
        ? OpenAPIArray<T>
        : unknown
    : T extends { anyOf: readonly (infer Choice)[] }
      ? SchemaType<Choice>
      : unknown;

/** Checks if a given schema field has a default value. */
type HasDefault<T> = T extends { default: infer _ } ? true : false;

/** Turns a schema (with type object) defined in components into a TypeScript type. */
export type ComponentSchema<Name extends keyof ComponentSchemas> = {
  // no need to actually check if the schema has an object type, as all the schemas
  // in the API schema are objects
  [Field in keyof ComponentSchemas[Name]["properties"] as HasDefault<
    ComponentSchemas[Name]["properties"][Field]
  > extends false
    ? // If the field does not have a default value, it is required
      Field
    : never]: SchemaType<ComponentSchemas[Name]["properties"][Field]>;
} & {
  [Field in keyof ComponentSchemas[Name]["properties"] as HasDefault<
    ComponentSchemas[Name]["properties"][Field]
  > extends true
    ? // If the field has a default value, it is optional (the ? after the key)
      Field
    : never]?: SchemaType<ComponentSchemas[Name]["properties"][Field]>;
};

/** Extracts the JSON input type for a given endpoint and method. */
export type EndpointJSONInput<
  K extends Endpoint,
  M extends EndpointMethod<K>,
> = ApiSchema["paths"][K][M] extends {
  requestBody: {
    content: { "application/json": { schema: infer Schema } };
  };
}
  ? SchemaType<Schema>
  : never;

/** Creates a simple response type for all given variations of responses for a given endpoint and method. */
export type EndpointResponses<
  K extends Endpoint,
  M extends EndpointMethod<K>,
> = ApiSchema["paths"][K][M] extends { responses: infer R }
  ? {
      [StatusCode in keyof R]: R[StatusCode] extends {
        content: { "application/json": { schema: infer Schema } };
      }
        ? {
            code: StringToNumber<StatusCode & string>;
            data: SchemaType<Schema>;
          }
        : R[StatusCode] extends {
              content: { "text/plain": { schema: infer Schema } };
            }
          ? {
              code: StringToNumber<StatusCode & string>;
              data: SchemaType<Schema>;
            }
          : {
              code: StringToNumber<StatusCode & string>;
              data: never;
            };
    }[keyof R]
  : never;
