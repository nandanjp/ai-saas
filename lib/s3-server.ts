import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs";

export async function downloadFromS3(file_key: string)
{
    const accessKeyId = process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!;
    const secretAccessKey = process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!;
    const region = "ca-central-1" as const;
    const Bucket = process.env.NEXT_PUBLIC_S3_BUCKET_NAME!;

    try
    {
        console.log(`Downloading file from S3......`);
        const download = new S3Client({
            credentials: {
                accessKeyId,
                secretAccessKey
            },
            region
        });

        const input = { // GetObjectRequest
            Bucket,
            Key: file_key
        };
        const response = await download.send(new GetObjectCommand(input));
        const file_name = `/tmp/pdf-${Date.now()}.pdf`;
        const response_as_bytes = await response.Body?.transformToByteArray();
        fs.writeFileSync(file_name, response_as_bytes as Buffer);
        return file_name;
    } catch (error)
    {
        console.error(error);
        return null;
    }
}