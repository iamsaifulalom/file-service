import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { verifyDomainAndResources } from "./verify-domain-and-resources";
import { AllowedFileType } from "./domain-policy";

export interface BODY {
	project : string, 
	fileName : string, 
	fileType: AllowedFileType
}

export default {
  async fetch(req: Request, env: any) {

    if (req.method !== "POST") {
      return new Response("Only POST method allowed", { status: 405 });
    }

    const body: BODY = await req.json();
    const { project, fileName, fileType } = body;

    // verify domain and resource(file type)
    verifyDomainAndResources(req, body);

    const key = `${project}/uploads/${Date.now()}-${fileName}`;

    // Use env passed to the fetch function
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
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return new Response(JSON.stringify({ uploadUrl, key }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
};
