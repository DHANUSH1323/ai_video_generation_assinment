import express from "express";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import { uploadFileToS3 } from "./utils/s3.js";
import { generateVideo } from "./utils/falClient.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));


app.use((req, res, next) => {
    console.log(`➡️ Received ${req.method} ${req.url}`);
    next();
});

app.get("/", (_, res) => {
    res.send("Backend is running");
});


app.post("/api/video-generation/v1/videos", async (req, res) => {
    try {
        console.log("Request received");

        const { prompt, duration, resolution, audio } = req.body;
        let referenceImageUrl: string | null = null;

        if (req.files?.referenceImage) {
            console.log("Uploading to s3 ");
            const file = req.files.referenceImage as fileUpload.UploadedFile;
            referenceImageUrl = await uploadFileToS3(
                { name: file.name, data: file.data, type: file.mimetype },
                "images"
            );
        } else {
            console.log("No image uploaded");
        }

        console.log("Calling Fal.ai");
        const { videoUrl } = await generateVideo({
            imageUrls: referenceImageUrl ? [referenceImageUrl] : [],
            prompt,
            duration: duration || "8s",
            resolution: resolution || "720p",
            generateAudio: audio === "true" || audio === true,
        });

        console.log("Downloading generated video");
        const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });
        const videoBuffer = Buffer.from(videoResponse.data, "binary");

        console.log("Uploading final video to S3");
        const videoS3Url = await uploadFileToS3(
            { name: `generated-${Date.now()}.mp4`, data: videoBuffer, type: "video/mp4" },
            "videos"
        );

        const responseData = {
            videos: [
                {
                    // id: requestId || Date.now().toString(),
                    prompt,
                    referenceImage: referenceImageUrl || null,
                    duration: parseInt(duration) || 8,
                    resolution: resolution?.includes("1080") ? 1080 : 720,
                    audio: audio === "true" || audio === true,
                    createdAt: new Date().toISOString(),
                    modelName: "fal-ai/veo3.1/reference-to-video",
                    sizeBytes: videoBuffer.length,
                    tags: [],
                    url: videoS3Url,
                    downloaded: true,
                    bookmarked: false,
                    projectVideo: false,
                    verified: true,
                    source: "fal.ai",
                    createdBy: "server",
                    edited: false,
                    status: "Generated",
                },
            ],
        };

        console.log("Video generation completed");
        res.status(200).json(responseData);

    } catch (error: any) {
        console.error("Error generating video:", error.message || error);
        res.status(500).json({ error: "Failed to generate video. Please try again." });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// console.log("Express app is still alive and listening...");