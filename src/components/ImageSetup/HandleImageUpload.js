import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { useLoading } from "../../LoadingContext";

const s3Client = new S3Client({
    region: "ap-south-1", // Replace with your S3 bucket region
    credentials: {
        accessKeyId: "AKIA3ISBWBDSKOMOCW5L", // Replace with your access key
        secretAccessKey: "TyxV2wS4Ku1OdgWi81X2XHlrraHtFwu+B7F+1Q2m", // Replace with your secret key
    },
});
export const handleUploadImage = async (file, filename) => {
    if (!file) {
        throw new Error("No file provided");
    }

    if (!filename) {
        throw new Error("Filename must be provided");
    }

    try {
        // Generate a unique file name
        const timestamp = new Date().toISOString().replace(/[-:.]/g, ""); // Remove special characters
        const uniqueFileName = `${timestamp}_${filename}`;

        const uploadParams = {
            Bucket: "dlt-tool", // Replace with your bucket name
            Key: uniqueFileName,
            Body: file,
            ContentType: file.type,
        };

        // Upload the file to S3
        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        // Construct the uploaded file URL
        const region = "ap-south-1"; // Explicitly specify your region
        const fileUrl = `https://${uploadParams.Bucket}.s3.${region}.amazonaws.com/${uniqueFileName}`;

        console.log("Uploaded File URL:", fileUrl);
        return fileUrl; // Ensure the URL is returned
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        throw new Error("Failed to upload file");
    }
};
