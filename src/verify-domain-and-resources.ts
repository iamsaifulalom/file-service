// verify-domain-and-resources.ts

import { BODY } from ".";
import { DOMAIN_POLICY } from "./domain-policy";

export function verifyDomainAndResources(req: Request, body: BODY) {
  const origin = req.headers.get("Origin") || req.headers.get("Referer");
  if (!origin) throw new Response("Missing Origin", { status: 403 });

  let hostname: string;
  try {
    hostname = new URL(origin).hostname;
  } catch {
    throw new Response("Invalid Origin", { status: 403 });
  }

  const rule = DOMAIN_POLICY[hostname];
  if (!rule) throw new Response("Domain not allowed", { status: 403 });
  if (!rule.fileType.includes(body.fileType)) {
    throw new Response("File type not allowed for this domain", { status: 400 });
  }
}
