// This file is auto-generated from local OpenAPI documentation.

/** The raw OpenAPI schema for the API in JSON format. */
export const apiSchema = {
  "openapi": "3.1.0",
  "info": {
    "title": "FastAPI",
    "version": "0.2.1"
  },
  "paths": {
    "/ping": {
      "get": {
        "summary": "Responds with 'pong'",
        "description": "Simply returns a plain text response with the text \"pong\".",
        "operationId": "resolver_ping_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/pave": {
      "post": {
        "summary": "Pave Trail",
        "description": "Paves a Trail for the given URL.",
        "operationId": "resolver_pave_post",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PaveInput"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PaveResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/t/{trail_id}": {
      "get": {
        "summary": "Traverse Trail by ID",
        "description": "Traverse a Trail by its ID, leaving a Visit on the Trail. The user gets redirected to the Trail's URL.",
        "operationId": "resolver_t__trail_id__get",
        "parameters": [
          {
            "name": "trail_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Trail Id"
            }
          }
        ],
        "responses": {
          "307": {
            "description": "Successful Response"
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "summary": "Delete Trail by ID",
        "operationId": "resolver_t__trail_id__delete",
        "parameters": [
          {
            "name": "trail_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Trail Id"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Successful Response"
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/info/{trail_id}": {
      "get": {
        "summary": "Get Trail Information",
        "description": "Retrieve information about a trail by its ID. See return schema for details.",
        "operationId": "resolver_info__trail_id__get",
        "parameters": [
          {
            "name": "trail_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Trail Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TrailInfo"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/peek/{trail_id}": {
      "get": {
        "summary": "Peek a Trail by ID",
        "description": "Get a quick peek at a Trail's URL by its ID. This does not leave a Visit on the Trail,\ntherefore not counting towards the Trail's visit statistics. Might be useful for\nautomation.",
        "operationId": "resolver_peek__trail_id__get",
        "parameters": [
          {
            "name": "trail_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Trail Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "string"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "HTTPValidationError": {
        "properties": {
          "detail": {
            "items": {
              "$ref": "#/components/schemas/ValidationError"
            },
            "type": "array",
            "title": "Detail"
          }
        },
        "type": "object",
        "title": "HTTPValidationError"
      },
      "PaveInput": {
        "properties": {
          "url": {
            "type": "string",
            "maxLength": 2083,
            "minLength": 1,
            "format": "uri",
            "title": "Url",
            "description": "The URL to pave a Trail for."
          },
          "lifetime": {
            "type": "integer",
            "maximum": 720,
            "minimum": 1,
            "title": "Lifetime",
            "description": "The lifetime of the Trail in hours. Defaults to 72 hours.",
            "default": 72
          }
        },
        "type": "object",
        "required": [
          "url"
        ],
        "title": "PaveInput"
      },
      "PaveResponse": {
        "properties": {
          "trail_id": {
            "type": "string",
            "title": "Trail Id",
            "description": "The unique identifier for the paved Trail."
          },
          "token": {
            "type": "string",
            "title": "Token",
            "description": "The unique token for the Trail. This grants access to restricted operations."
          },
          "message": {
            "type": "string",
            "title": "Message",
            "description": "A message indicating the result of the operation."
          }
        },
        "type": "object",
        "required": [
          "trail_id",
          "token",
          "message"
        ],
        "title": "PaveResponse"
      },
      "TrailInfo": {
        "properties": {
          "id": {
            "type": "string",
            "title": "Id",
            "description": "The unique identifier of the Trail."
          },
          "url": {
            "type": "string",
            "title": "Url",
            "description": "The URL associated with the Trail."
          },
          "visits": {
            "$ref": "#/components/schemas/TrailVisitInfo",
            "description": "Information about visits to the Trail, including total and unique visits."
          },
          "created": {
            "type": "string",
            "title": "Created",
            "description": "The UTC timestamp when the Trail was created, in ISO 8601 format."
          },
          "lifetime": {
            "type": "integer",
            "title": "Lifetime",
            "description": "The lifetime of the Trail in hours."
          }
        },
        "type": "object",
        "required": [
          "id",
          "url",
          "visits",
          "created",
          "lifetime"
        ],
        "title": "TrailInfo"
      },
      "TrailVisitInfo": {
        "properties": {
          "all": {
            "type": "integer",
            "title": "All",
            "description": "The total number of visits to the Trail, including both unique and non-unique visits."
          },
          "unique": {
            "type": "integer",
            "title": "Unique",
            "description": "The number of unique visits to the Trail, based on distinct hashed IP addresses."
          }
        },
        "type": "object",
        "required": [
          "all",
          "unique"
        ],
        "title": "TrailVisitInfo"
      },
      "ValidationError": {
        "properties": {
          "loc": {
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "type": "array",
            "title": "Location"
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          }
        },
        "type": "object",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "title": "ValidationError"
      }
    }
  }
} as const;

export type ApiSchema = typeof apiSchema;
