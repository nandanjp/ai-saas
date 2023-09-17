import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export async function uploadToS3(file: File)
{
    const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ', '-');

    const accessKeyId = process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!;
    const secretAccessKey = process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!;
    const region = "ca-central-1" as const;
    const Bucket = process.env.NEXT_PUBLIC_S3_BUCKET_NAME!;

    try
    {
        console.log(`Uploading to S3......`);
        const upload = await new Upload({
            client: new S3Client({
                credentials: {
                    accessKeyId,
                    secretAccessKey
                },
                region
            }),
            params: {
                ACL: "public-read",
                Bucket,
                Key: file_key,
                Body: file
            },
        }).done();
        console.log(upload);
        console.log('successfully uploaded to S3', file_key);
        return Promise.resolve({
            file_key,
            file_name: file.name,
        });
        // console.log(`Uploading to S3......`, parseInt(((evt.loaded * 100) / evt.total).toString()).toString());
    } catch (error)
    {
        console.error("Error uploading file to S3......");
    }
}

export function getS3Url(file_key: string)
{
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ca-central-1.amazonaws.com/${file_key}`;
    return url;
}