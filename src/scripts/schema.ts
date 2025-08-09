// This scripts generates the src/api/schema.ts file from the OpenAPI documentation specified in the CODEGEN_OPENAPI_DOCS_PATH environment variable.

const openAPIDocsPath = process.env.CODEGEN_OPENAPI_DOCS_PATH;
if (!openAPIDocsPath) {
  throw new Error("Environment variable CODEGEN_OPENAPI_DOCS_PATH is not set.");
}

import { promises as fs } from "fs";
import { OpenAPIV3_1 } from "openapi-types";
import path from "path";

const main = async () => {
  const docsContent = await fs.readFile(openAPIDocsPath, "utf8");
  const docs = JSON.parse(docsContent) as OpenAPIV3_1.Document;

  let content = "";

  content += `// This file is auto-generated from local OpenAPI documentation.\n\n`;
  content += `/** The raw OpenAPI schema for the API in JSON format. */\n`;
  content += `export const apiSchema = ${JSON.stringify(docs, null, 2)} as const;\n\n`;
  content += `export type ApiSchema = typeof apiSchema;\n`;

  await fs.writeFile(path.join(__dirname, "../api/schema.ts"), content, "utf8");
};

main();
