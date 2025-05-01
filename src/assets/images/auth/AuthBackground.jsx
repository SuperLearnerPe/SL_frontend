import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

const AuthBackground = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.palette.primary.light} stopOpacity="0.4" />
            <stop offset="100%" stopColor={theme.palette.secondary.light} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grad1)" />
        
        <g fill={theme.palette.primary.main} fillOpacity="0.2">
          <circle cx="10%" cy="10%" r="5%" />
          <circle cx="90%" cy="10%" r="7%" />
          <circle cx="50%" cy="50%" r="10%" />
          <circle cx="20%" cy="80%" r="6%" />
          <circle cx="80%" cy="90%" r="8%" />
        </g>
        
        <path
          d="M0,1080 C384,864 672,918 960,864 C1248,810 1344,648 1920,648 L1920,1080 Z"
          fill={theme.palette.secondary.main}
          fillOpacity="0.2"
        />
        
        <path
          d="M0,1080 C288,972 576,1026 960,972 C1344,918 1536,972 1920,918 L1920,1080 Z"
          fill={theme.palette.primary.main}
          fillOpacity="0.2"
        />
      </svg>
    </Box>
  );
};

export default AuthBackground;