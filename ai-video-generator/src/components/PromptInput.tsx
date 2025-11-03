
import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from "axios";

interface ModelSettings {
    model: string;
    duration: string;
    resolution: string;
    audio: boolean;
    referenceImageFile?: File | null;
}

const PromptInput: React.FC<{ onVideoGenerated: (url: string) => void; modelSettings: ModelSettings }> = ({ onVideoGenerated, modelSettings }) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        console.log("Prompt submitted:", prompt);
        if (!prompt) return;

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("model", modelSettings.model);
            formData.append("prompt", prompt);
            formData.append("duration", modelSettings.duration);
            formData.append("resolution", modelSettings.resolution);
            formData.append("audio", modelSettings.audio.toString());

            if (modelSettings.referenceImageFile) {
                formData.append("referenceImage", modelSettings.referenceImageFile);
            }

            const response = await axios.post(
                "http://localhost:5001/api/video-generation/v1/videos",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const url = response.data.videos?.[0]?.url;
            if (url) onVideoGenerated(url);
        } catch (error: any) {
            console.error("Video generation failed:", error.message);
            alert("Failed to generate video. Check backend logs.");
        } finally {
            setLoading(false);
            setPrompt("");
        }
    };

    return (
        <>
            <Box
                sx={{
                    backgroundColor: '#111',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    width: '100%',
                    border: '1px solid #333',
                }}
            >
                <TextField
                    multiline
                    maxRows={4}
                    fullWidth
                    placeholder="Type a prompt to generate a video e.g. A graceful ballerina dancing outside a circus tent on green grass, with colorful wildflowers swaying around her as she twirls and poses in the meadow."
                    variant="standard"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    InputProps={{
                        disableUnderline: true,
                        sx: {
                            color: '#fff',
                            fontSize: '0.9rem',
                            whiteSpace: 'pre-wrap',
                            paddingRight: '12px',
                        },
                    }}
                    sx={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        color: '#fff',
                        fontSize: '0.95rem',
                    }}
                />
                <IconButton
                    onClick={handleSubmit}
                    sx={{
                        background: 'linear-gradient(to right, #6f4ef2, #b84592)',
                        color: '#fff',
                        borderRadius: 2,
                        width: 32,
                        height: 32,
                        padding: 0,
                        '&:hover': {
                            background: 'linear-gradient(to right, #8368f4, #cb5fa5)',
                        },
                    }}
                >
                    <ArrowForwardIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
            </Box>
        </>
    );
};

export default PromptInput;