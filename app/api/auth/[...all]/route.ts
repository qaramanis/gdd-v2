import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const { GET, POST } = toNextJsHandler(auth);

// export async function POST(request: Request) {
//   try {
//     return await handler.POST(request);
//   } catch (error) {
//     console.error("Auth API Error:", error);
//     return new Response(
//       JSON.stringify({ error: "Internal Server Error", details: error }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//   }
// }

export { GET, POST };
