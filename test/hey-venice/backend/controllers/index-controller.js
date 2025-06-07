/**
 * Controller for the index route
 */

export const getApiInfo = (req, res) => {
  res.json({
    name: "Hey Venice API",
    version: "1.0.0",
    description: "API for Hey Venice application",
    endpoints: [
      {
        path: "/api",
        method: "GET",
        description: "Get API information"
      },
      {
        path: "/api/venice",
        method: "POST",
        description: "Interact with Venice AI"
      },
      {
        path: "/api/cast/:hash",
        method: "GET",
        description: "Get a cast and its replies by hash"
      },
      {
        path: "/api/resolve-cast-hash",
        method: "POST",
        description: "Resolve a cast hash from a URL"
      }
    ]
  });
};