import { z } from "zod";

export function validate(schema, handler) {
  return async (req, ...args) => {
    try {
      const body = await req.json();
      schema.parse(body); // throws if invalid
      req.body = body;
      return handler(req, ...args);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Validation failed", details: err.errors || err.message }),
        { status: 400 }
      );
    }
  };
}
