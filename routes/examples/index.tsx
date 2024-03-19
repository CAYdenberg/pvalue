import { Handler } from "$fresh/server.ts";

export const handler: Handler = () => {
  return new Response(null, {
    status: 301,
    headers: {
      location: `/examples/line-chart`,
    },
  });
};
