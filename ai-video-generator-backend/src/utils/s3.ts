import dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const uploadFileToS3 = async (
    file: { name: string; data: Buffer; type: string },
    folder: "images" | "videos"
): Promise<string> => {
    try {
        console.log(`Uploading ${folder} file to S3...`);

        const fileName = `${folder}/${uuidv4()}-${file.name}`;
        const params: AWS.S3.PutObjectRequest = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: fileName,
            Body: file.data,
            ContentType: file.type || "application/octet-stream",
        };

        const result = await s3.upload(params).promise();

        console.log("File uploaded successfully:", result.Location);
        return result.Location;
    } catch (error: any) {
        console.error("S3 upload failed:", error.message || error);
        throw new Error("Failed to upload file to S3. Please try again.");
    }
};