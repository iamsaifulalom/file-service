import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { verifyDomainAndResources } from "./verify-domain-and-resources";
import { AllowedFileType } from "./domain-policy";
import { verifyAuth } from "./verify-auth";

export interface BODY {
  project: string,
  fileName: string,
  fileType: AllowedFileType
}

export default {
  async fetch(req: Request, env: any) {

verifyAuth(req, env);                // throws Response if unauthorized
    try {
      if (req.method !== "POST") {
        return new Response("Only POST method allowed", { status: 405 });
      }

      const body: BODY = await req.json();

      verifyDomainAndResources(req, body); // throws Response if origin/filetype invalid

      const key = `${body.project}/uploads/${Date.now()}-${body.fileName}`;

      const s3 = new S3Client({
        region: "auto",
        endpoint: env.R2_END_POINT,
        credentials: {
          accessKeyId: env.R2_ACCESS_KEY_ID,
          secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        },
      });

      const command = new PutObjectCommand({
        Bucket: "my-first-bucket",
        Key: key,
        ContentType: body.fileType,
      });

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

      return new Response(JSON.stringify({ uploadUrl, key }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    } catch (error) {
      if (error instanceof Response) {
        return error; // send it to client
      }
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};

