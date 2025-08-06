import { NextRequest } from "next/server";

function convertSrtToVtt(srt: string): string {
  return (
    "WEBVTT\n\n" +
    srt
      .replace(/\r/g, "")
      .replace(
        /(\d{2}:\d{2}:\d{2}),(\d{3}) --> (\d{2}:\d{2}:\d{2}),(\d{3})/g,
        "$1.$2 --> $3.$4"
      )
  );
}

export async function GET(req: NextRequest): Promise<Response> {
  const srtUrl = req.nextUrl.searchParams.get("url");

  if (!srtUrl || !(srtUrl.startsWith("http://") || srtUrl.startsWith("https://"))) {
    return new Response("Invalid or missing URL", { status: 400 });
  }

  try {
    const res = await fetch(srtUrl);
    if (!res.ok) {
      return new Response("Failed to fetch subtitle file", { status: 500 });
    }

    const srtText = await res.text();
    const vttText = convertSrtToVtt(srtText);

    return new Response(vttText, {
      status: 200,
      headers: {
        "Content-Type": "text/vtt; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("Caption proxy error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
