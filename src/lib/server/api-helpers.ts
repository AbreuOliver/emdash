export function jsonError(message: string, code: string, status: number, details?: Record<string, unknown>) {
  const body: Record<string, unknown> = { error: message, code };
  if (details) Object.assign(body, details);
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
