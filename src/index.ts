import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default {
  async fetch(req: Request, env: any) { 
    if (req.method !== "POST") {
      return new Response("Only POST method allowed", { status: 405 });
    }

    const body = await req.json();
    const { project, fileName, fileType } = body;

    const allowedProjects = ["projectA", "projectB", "projectC"];
    if (!allowedProjects.includes(project)) {
      return new Response("Invalid project", { status: 400 });
    }

    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(fileType)) {
      return new Response("File type not allowed", { status: 400 });
    }

    const key = `${project}/uploads/${Date.now()}-${fileName}`;

    // Use env passed to the fetch function
    const s3 = new S3Client({
      region: "auto",
      endpoint: "https://614b432497b38de337d7bbea788b1ddc.r2.cloudflarestorage.com",
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID ,
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
