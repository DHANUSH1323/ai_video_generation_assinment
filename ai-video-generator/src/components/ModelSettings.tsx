
import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ArrowForwardIos } from '@mui/icons-material';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Switch,
    Paper,
    Button,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface ModelSettingsProps {
    onSettingsChange: (settings: { model: string; duration: string; resolution: string; audio: boolean; referenceImageFile?: File | null }) => void;
    referenceImageFile?: File | null;
}

const ModelSettings: React.FC<ModelSettingsProps> = ({ onSettingsChange }) => {
    const [model, setModel] = useState('Veo 3.1');
    const [duration, setDuration] = useState(8);
    const [resolution, setResolution] = useState(720);
    const [audio, setAudio] = useState(true);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const notifyChange = (newModel: string, newDuration: number, newResolution: number, newAudio: boolean, newImageFile?: File | null) => {
        onSettingsChange({
            model: newModel,
            duration: newDuration.toString(),
            resolution: newResolution.toString(),
            audio: newAudio,
            referenceImageFile: newImageFile ?? imageFile,
        });
    };

    const handleDurationChange = (type: 'increment' | 'decrement') => {
        setDuration((prev) => {
            const newDuration = type === 'increment' ? Math.min(prev + 1, 12) : Math.max(prev - 1, 1);
            notifyChange(model, newDuration, resolution, audio);
            return newDuration;
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            setImageFile(file);
            notifyChange(model, duration, resolution, audio, file);
        }
    };

    const handleModelChange = (newModel: string) => {
        setModel(newModel);
        notifyChange(newModel, duration, resolution, audio);
    };

    const handleResolutionChange = (newResolution: number) => {
        setResolution(newResolution);
        notifyChange(model, duration, newResolution, audio);
    };

    const handleAudioChange = (newAudio: boolean) => {
        setAudio(newAudio);
        notifyChange(model, duration, resolution, newAudio);
    };

    return (
        <Box
            sx={{
                backgroundColor: '#111',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: 2,
                width: { xs: '100%', md: '344px' },
                height: '100%',
                borderRadius: 2,
                overflowY: 'auto',
            }}
        >
            {/* Model */}
            <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ color: '#fff', fontSize: '0.95rem' }}>Model *</InputLabel>
                <Select
                    value={model}
                    onChange={(e) => handleModelChange(e.target.value)}
                    label="Model *"
                    sx={{
                        color: '#fff',
                        borderRadius: 2,
                        backgroundColor: '#1c1c1c',
                        '&.Mui-focused': {
                            backgroundColor: '#222',
                        },
                        '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#555',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#666',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#888',
                        },
                        '& .MuiSelect-icon': {
                            color: '#fff',
                            right: 12,
                        },
                    }}
                    IconComponent={ArrowForwardIos}
                >
                    <MenuItem value="Veo 3.1">Veo 3.1</MenuItem>
                </Select>
            </FormControl>

            {/* Reference Image */}
            <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="#ccc" sx={{ fontSize: '0.95rem' }}>
                        Reference Image
                    </Typography>
                    <Tooltip title="Optional image to guide video generation" arrow>
                        <IconButton size="small" sx={{ color: '#888' }}>
                            <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Paper
                    sx={{
                        backgroundColor: '#2a2a2a',
                        border: '2px dashed #555',
                        borderRadius: 2,
                        p: 1.5,
                        textAlign: 'center',
                        height: 200,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                    }}
                >
                    {imageUrl ? (
                        <>
                            <Box
                                component="img"
                                src={imageUrl}
                                alt="Reference"
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: 130,
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
                            />
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => {
                                    setImageUrl(null);
                                    setImageFile(null);
                                    notifyChange(model, duration, resolution, audio, null);
                                }}
                                startIcon={<DeleteOutlineIcon />}
                                sx={{
                                    color: '#fff',
                                    borderColor: '#999',
                                    fontSize: '0.85rem',
                                    textTransform: 'none',
                                }}
                            >
                                Delete
                            </Button>
                        </>
                    ) : (
                        <>
                            <CloudUploadIcon sx={{ fontSize: 40, color: '#aaa' }} />
                            <Typography variant="body2" color="#ccc" mt={1} sx={{ fontSize: '0.95rem' }}>
                                Click to upload reference image
                            </Typography>
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                id="upload-ref-img"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="upload-ref-img">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    sx={{
                                        mt: 1,
                                        borderRadius: '8px',
                                        borderColor: '#999',
                                        color: '#fff',
                                    }}
                                >
                                    Choose File
                                </Button>
                            </label>
                        </>
                    )}
                </Paper>
            </Box>

            {/* Duration */}
            <Box>
                <Typography variant="subtitle2" color="#fff" gutterBottom sx={{ fontSize: '0.95rem' }}>
                    Duration *
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#2a2a2a',
                        borderRadius: '8px',
                        justifyContent: 'space-between',
                        px: 1,
                        height: 56,
                    }}
                >
                    <IconButton
                        onClick={() => handleDurationChange('decrement')}
                        sx={{
                            color: '#fff',
                            border: '1px solid #555',
                            borderRadius: '8px',
                            width: 40,
                            height: 40,
                            backgroundColor: 'grey',
                        }}
                    >
                        <Remove />
                    </IconButton>
                    <Typography sx={{ fontSize: '0.95rem' }}>{duration}s</Typography>
                    <IconButton
                        onClick={() => handleDurationChange('increment')}
                        sx={{
                            color: '#fff',
                            border: '1px solid #555',
                            borderRadius: '8px',
                            width: 40,
                            height: 40,
                            backgroundColor: 'grey',
                        }}
                    >
                        <Add />
                    </IconButton>
                </Box>
            </Box>

            {/* Resolution */}
            <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ color: '#fff', fontSize: '0.95rem' }}>Resolution *</InputLabel>
                <Select
                    value={resolution}
                    onChange={(e) => handleResolutionChange(Number(e.target.value))}
                    label="Resolution *"
                    sx={{
                        color: '#fff',
                        borderRadius: 2,
                        backgroundColor: '#1c1c1c',
                        '&.Mui-focused': {
                            backgroundColor: '#222',
                        },
                        '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#555',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#666',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#888',
                        },
                        '& .MuiSelect-icon': {
                            color: '#fff',
                            right: 12,
                        },
                    }}
                    IconComponent={ArrowForwardIos}
                >
                    <MenuItem value={720}>720p</MenuItem>
                    <MenuItem value={1080}>1080p</MenuItem>
                </Select>
            </FormControl>

            {/* Audio toggle */}
            <Box>
                <Typography variant="subtitle2" color="#fff" gutterBottom sx={{ fontSize: '0.95rem' }}>
                    Generate Audio
                </Typography>
                <Switch
                    checked={audio}
                    onChange={(e) => handleAudioChange(e.target.checked)}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default ModelSettings;