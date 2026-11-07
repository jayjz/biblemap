export interface FailedRequest {
  url: string;
  method: string;
  resourceType: string;
  errorText: string | undefined;
}

/** Next 16 static-export Flight requests can be cancelled by document navigation.
 * Only classify the observed transport cancellation. HTTP errors are never filtered.
 */
export function expectedRscCancellation(request: FailedRequest, origin: string): boolean {
  const url = new URL(request.url);
  return url.origin === new URL(origin).origin && request.method === "GET" &&
    request.resourceType === "fetch" && url.searchParams.has("_rsc") &&
    !!url.searchParams.get("_rsc") && url.pathname.endsWith(".txt") &&
    request.errorText === "net::ERR_ABORTED";
}
