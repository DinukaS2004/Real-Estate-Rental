import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

// R2 uses the S3 SDK but with Cloudflare's endpoint
const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CF_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY!,
    },
});

const BUCKET = process.env.CF_R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.CF_R2_PUBLIC_URL!;

export const generatePresignedUrl = async (
    fileType: string,
    folder: string = "properties"
) => {
    // Validate file type
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(fileType)) {
        throw new Error("Only JPEG, PNG, and WebP images are allowed");
    }

    const ext = fileType.split("/")[1];
    const key = `${folder}/${uuidv4()}.${ext}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: fileType,
    });

    // URL expires in 5 minutes — enough time for the browser to upload
    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

    return {
        uploadUrl,
        publicUrl: `${PUBLIC_URL}/${key}`,
    };
};

export const deleteFile = async (publicUrl: string) => {
    // Extract key from the public URL
    const key = publicUrl.replace(`${PUBLIC_URL}/`, "");

    await r2.send(
        new DeleteObjectCommand({ Bucket: BUCKET, Key: key })
    );
};