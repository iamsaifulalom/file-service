// domain-policy.ts

export type AllowedFileType =
  | "image/png"
  | "image/jpeg"
  | "application/pdf";

export interface DomainPolicy {
  fileType: AllowedFileType[];}

export const DOMAIN_POLICY: Record<string, DomainPolicy> = {
  "saifulalom.com": {
    fileType: ["image/png", "image/jpeg"],
  },

  "www.saifulalom.com": {
    fileType: ["image/png", "image/jpeg"],
  },

  "app.saifulalom.com": {
    fileType: ["image/png", "image/jpeg", "application/pdf"],
  },

  "localhost": {
    fileType: ["image/png", "image/jpeg", "application/pdf"],
  },
};
