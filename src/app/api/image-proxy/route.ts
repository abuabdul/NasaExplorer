import { NextRequest } from "next/server";
import http from "http";
import https from "https";
import { IncomingMessage } from "http";
import { URL } from "url";

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get("url");

  if (!imageUrl || !(imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))) {
    return new Response("Invalid or missing image URL", { status: 400 });
  }

  const client = imageUrl.startsWith("https") ? https : http;

  return new Promise((resolve) => {
    try {
      const request = client.get(imageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36",
        }
      }, (imgRes: IncomingMessage) => {
        if (imgRes.statusCode && imgRes.statusCode >= 300 && imgRes.statusCode < 400 && imgRes.headers.location) {
          const redirectedUrl = new URL(imgRes.headers.location, imageUrl).href;
          req.nextUrl.searchParams.set("url", redirectedUrl);
          resolve(GET(req));
          return;
        }

        const contentType = imgRes.headers["content-type"] || "application/octet-stream";

        if (!contentType.startsWith("image/")) {
          return resolve(new Response("Invalid image content", { status: 400 }));
        }

        const chunks: Uint8Array[] = [];
        imgRes.on("data", (chunk) => chunks.push(chunk));
        imgRes.on("end", () => {
          const buffer = Buffer.concat(chunks);
          resolve(
            new Response(buffer, {
              status: 200,
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400",
              },
            })
          );
        });
      });

      request.on("error", (err) => {
        console.error("Image proxy error:", err.message);
        resolve(new Response("Failed to fetch image", { status: 500 }));
      });

    } catch (error: any) {
      console.error("Unexpected error:", error.message);
      resolve(new Response("Unexpected error occurred", { status: 500 }));
    }
  });
}
