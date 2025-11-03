import path from "path";
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";


dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const FAL_KEY = process.env.FAL_KEY;
console.log("Loaded FAL_KEY:", FAL_KEY ? `${FAL_KEY.slice(0, 10)}` : "not loaded");

if (!FAL_KEY) {
    throw new Error("Missing FAL_KEY");
}

fal.config({ credentials: FAL_KEY });

// export const generateVideo = async ({
//     imageUrls,
//     prompt,
//     duration = "8s",
//     resolution = "720p",
//     generateAudio = true,
// }: {
//     imageUrls: string[];
//     prompt: string;
//     duration?: "8s";
//     resolution?: "720p" | "1080p";
//     generateAudio?: boolean;
// }) => {
//     try {
//         console.log("Sending request");

//         const result = await fal.subscribe("fal-ai/veo3.1/reference-to-video", {
//             input: {
//                 image_urls: imageUrls,
//                 prompt,
//                 duration,
//                 resolution,
//                 generate_audio: generateAudio,
//             },
//             logs: true,
//             onQueueUpdate: (update) => {
//                 if (update.status === "IN_PROGRESS") {
//                     update.logs.map((log) => log.message).forEach(console.log);
//                 }
//             },
//         });

//         const res: any = result as any;
//         const videoUrl =
//             res?.data?.video?.url ||
//             res?.video?.url ||
//             res?.output?.video?.url;
//         const requestId = res?.requestId;

//         if (!videoUrl) {
//             console.error("Fal.ai raw response:", JSON.stringify(result, null, 2));
//             throw new Error("No video returned");
//         }

//         console.log("Video generated successfully:", videoUrl);
//         return { videoUrl, requestId };
//     } catch (error: any) {
//         console.error("Fal.ai generation failed:", error.message || error);
//         throw new Error("Video generation failed");
//     }
// };


export const generateVideo = async ({
    imageUrls,
    prompt,
    duration = "8s",
    resolution = "720p",
    generateAudio = true,
}: {
    imageUrls: string[];
    prompt: string;
    duration?: string;
    resolution?: string;
    generateAudio?: boolean;
}) => {
    try {
        console.log("Fetching dummy video from S3 video");

        const videoUrl =
            "https://ai-video-generator-assets.s3.us-east-1.amazonaws.com/videos/cat.mp4";

        console.log("Mock video from S3:", videoUrl);

        return {
            videoUrl
            // requestId: "mock-request-id-001",
        };
    } catch (error: any) {
        console.error("Mock generation failed:", error.message);
        throw new Error("Video generation failed. Please try again later.");
    }
};