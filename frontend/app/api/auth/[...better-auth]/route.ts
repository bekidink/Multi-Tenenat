export async function GET(request: Request) {
  { return proxy(request); }}
export async function POST(request: Request) { return proxy(request); }


async function proxy(request: Request) {
  const url = new URL(request.url);
  const target = `${process.env.NEXT_PUBLIC_BETTER_AUTH_API_URL}${url.pathname}${url.search}`;
const headers = new Headers(request.headers);

 return fetch(target, {
    method: request.method,
    headers,
    body: request.body,
    redirect: "manual",
  });
}