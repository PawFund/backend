const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Dokumentasi API untuk backend",
    },
    servers: [
      {
        url: "https://backend-production-acca.up.railway.app",
        description: "Production server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Pastikan path ke file route benar
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
