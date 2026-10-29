import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = process.env.BACKEND_API_URL || "http://103.158.96.244:5000/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params, "GET");
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params, "POST");
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params, "PUT");
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params, "DELETE");
}

async function handleProxy(request: NextRequest, { path }: { path: string[] }, method: string) {
  try {
    const subpath = (path || []).join("/");
    const search = request.nextUrl.search;
    const targetUrl = `${BACKEND_BASE}/${subpath}${search}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const auth = request.headers.get("authorization");
    if (auth) headers["Authorization"] = auth;

    const demoUserId = request.headers.get("x-demo-user-id");
    if (demoUserId) headers["x-demo-user-id"] = demoUserId;

    let body: any = undefined;
    if (method !== "GET" && method !== "HEAD") {
      try {
        const text = await request.text();
        if (text) body = text;
      } catch (e) {
        // no body
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-Type") || "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("Proxy error to backend:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal terhubung ke backend server 103.158.96.244:5000",
        error: error.message,
      },
      { status: 502 }
    );
  }
}
