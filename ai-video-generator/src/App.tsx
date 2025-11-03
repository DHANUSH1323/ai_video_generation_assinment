import React, { useState } from 'react';
import Box from '@mui/material/Box';
import ModelSettings from './components/ModelSettings';
import PromptInput from './components/PromptInput';
import VideoPreview from './components/VideoPreview';

const App = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [modelSettings, setModelSettings] = useState<{
    model: string;
    duration: string;
    resolution: string;
    audio: boolean;
    referenceImageFile?: File | null;
  }>({
    model: '',
    duration: '',
    resolution: '',
    audio: false,
    referenceImageFile: null,
  });

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        padding: 2,
        display: 'flex',
        alignItems: 'stretch',
        gap: 3,
        margin: '0 auto',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {/* Left Panel */}
      <Box
        sx={{
          minWidth: { md: 344, xs: '100%' },
          backgroundColor: '#0a0a0a',
          padding: 2,
          borderRadius: 1,
          border: '1px solid #222',
          boxShadow: '0 0 8px rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <ModelSettings onSettingsChange={setModelSettings} />
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'space-between',
            minHeight: '100%',
            gap: 3,
          }}
        >
          {/* <Box sx={{ flexGrow: 1, mb: 2 }}>
            <VideoPreview videoUrl={videoUrl} />
          </Box> */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <VideoPreview videoUrl={videoUrl} />
          </Box>

          <Box sx={{ mt: 'auto' }}>
            <PromptInput modelSettings={modelSettings} onVideoGenerated={(url: string) => setVideoUrl(url)} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default App;