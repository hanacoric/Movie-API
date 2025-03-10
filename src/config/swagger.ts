import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { Application } from "express";

//swagger documentation
export function setupSwagger(app: Application) {
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Movie API",
      version: "1.0.0",
      description: "API for managing movies and authentication",
    },
    servers: [
      {
        url: "http://localhost:4000/api",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "auth-token",
        },
      },
      schemas: {
        Movie: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            year: { type: "integer" },
            genre: { type: "string" },
            actors: { type: "array", items: { type: "string" } },
            director: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
          },
        },
      },
    },
  };

  const options = {
    swaggerDefinition,
    apis: ["src/routes/*.ts"], // path to api routs
  };

  const swaggerSpec = swaggerJsdoc(options);

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
