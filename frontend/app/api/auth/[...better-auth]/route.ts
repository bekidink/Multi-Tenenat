export async function proxy(request: Request) {
  const url = new URL(request.url);
  const target = `${process.env.NEXT_PUBLIC_BETTER_AUTH_API_URL}${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host"); // important

  const backendResponse = await fetch(target, {
    method: request.method,
    headers,
    body: request.body,
    credentials: "include",
    redirect: "manual",
  });

  // Create a new response with the SAME Set-Cookie
  const responseHeaders = new Headers(backendResponse.headers);

  // critical: explicitly pass cookie through
  const setCookie = backendResponse.headers.get("set-cookie");
  if (setCookie) {
    responseHeaders.set("set-cookie", setCookie);
  }

  const body = await backendResponse.arrayBuffer();

  return new Response(body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });
}
