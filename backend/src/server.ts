import "dotenv/config";
import app from "./app";

// Euphoria Backend Server instance

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Euphoria Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Closing HTTP server gracefully...`);
  server.close(() => {
    console.log("HTTP server closed. Process terminating.");
    process.exit(0);
  });

  // Force close after 10s if connections linger
  setTimeout(() => {
    console.error("Forcefully shutting down server due to timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default server;
