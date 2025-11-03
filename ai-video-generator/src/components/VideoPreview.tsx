import React, { useRef, useState, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { IconButton, Slider, Box } from '@mui/material';

interface VideoPreviewProps {
    videoUrl?: string | null;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl }) => {
    const hiddenVideoRef = useRef<HTMLVideoElement>(null);
    const mainVideoRef = useRef<HTMLVideoElement>(null);
    const [previewTime, setPreviewTime] = useState<number | null>(null);
    const [previewPosition, setPreviewPosition] = useState<{ x: number }>({ x: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const progressPercent = (currentTime / duration) * 100;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        const video = hiddenVideoRef.current;

        if (video && video.duration) {
            const time = percent * video.duration;
            video.currentTime = time;
            setPreviewTime(time);
            setPreviewPosition({ x });
        }
    };

    const handleMouseLeave = () => {
        setPreviewTime(null);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const toggleFullScreen = () => {
        const videoContainer = mainVideoRef.current?.parentElement;
        if (!videoContainer) return;

        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    };

    useEffect(() => {
        const video = hiddenVideoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || previewTime === null) return;

        const ctx = canvas.getContext('2d');
        const drawFrame = () => {
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
        };

        video.addEventListener('seeked', drawFrame);
        return () => {
            video.removeEventListener('seeked', drawFrame);
        };
    }, [previewTime]);

    return (
        <Box
            sx={{
                'progress-percent': `${progressPercent}%`,
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #333',
                width: '100%',
                aspectRatio: '16 / 9',
                backgroundColor: 'black',
                position: 'relative',
                paddingBottom: '48px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'black',
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                {videoUrl && (
                    <>
                        <Box
                            component="video"
                            ref={hiddenVideoRef}
                            src={videoUrl ?? undefined}
                            sx={{ display: 'none' }}
                            preload="auto"
                            muted
                        />
                        <Box
                            component="video"
                            ref={mainVideoRef}
                            src={videoUrl ?? undefined}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                            }}
                            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                            muted
                            loop
                            preload="metadata"
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: '8px',
                                left: 0,
                                width: '100%',
                                padding: '8px',
                                background: 'rgba(0, 0, 0, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxSizing: 'border-box',
                            }}
                        >
                            <IconButton
                                onClick={() => {
                                    const video = mainVideoRef.current;
                                    if (video) {
                                        if (isPlaying) {
                                            video.pause();
                                        } else {
                                            video.play();
                                        }
                                        setIsPlaying(!isPlaying);
                                    }
                                }}
                                sx={{ color: 'rgba(255, 255, 255, 0.85)', marginRight: '12px' }}
                            >
                                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>

                            <Box
                                sx={{ position: 'relative', flex: 1, marginRight: '12px' }}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Slider
                                    min={0}
                                    max={duration}
                                    value={currentTime}
                                    onChange={(_, value) => {
                                        const newTime = typeof value === 'number' ? value : value[0];
                                        const video = mainVideoRef.current;
                                        if (video) {
                                            video.currentTime = newTime;
                                        }
                                    }}
                                    sx={{
                                        color: '#00f0ff',
                                        height: 6,
                                        '& .MuiSlider-thumb': {
                                            width: 16,
                                            height: 16,
                                            backgroundColor: '#fff',
                                            boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                                        },
                                        '& .MuiSlider-rail': {
                                            backgroundColor: '#444',
                                        },
                                        '& .MuiSlider-track': {
                                            backgroundColor: '#00f0ff',
                                        },
                                    }}
                                />
                                {previewTime !== null && (
                                    <Box
                                        component="canvas"
                                        ref={canvasRef}
                                        sx={{
                                            position: 'absolute',
                                            bottom: '36px',
                                            left: previewPosition.x,
                                            transform: 'translateX(-50%)',
                                            width: '120px',
                                            height: '68px',
                                            borderRadius: '8px',
                                            border: '1px solid #444',
                                            backgroundColor: 'black',
                                            zIndex: 10,
                                            pointerEvents: 'none',
                                        }}
                                        width={120}
                                        height={68}
                                    />
                                )}
                            </Box>

                            <Box component="span" sx={{ color: '#fff', fontSize: '12px', minWidth: '80px', textAlign: 'right', marginRight: '12px', fontFamily: 'monospace' }}>
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </Box>

                            <IconButton
                                onClick={toggleFullScreen}
                                sx={{ color: 'white' }}
                            >
                                <FullscreenIcon />
                            </IconButton>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default VideoPreview;