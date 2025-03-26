const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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
        url: "backend-production-acca.up.railway.app", // Ganti dengan URL API yang sudah dideploy
      },
    ],
  },
  apis: ["./routes/*.js"], // Path ke file routes
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
