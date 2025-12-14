export async function verifyAuth(req: Request, env: any) {

    const auth = req.headers.get("Authorization");

    if (!auth || !auth.startsWith("Bearer ")) {
        throw new Response("Unauthorized", { status: 401 });
    }
    const token = auth.slice(7);
    if (token !== env.UPLOAD_TOKEN) {
        throw new Response("Invalid token", { status: 401 });
    }
}
