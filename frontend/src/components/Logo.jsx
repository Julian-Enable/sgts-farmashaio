import React from 'react';
import { Box, Typography } from '@mui/material';
import { LocalPharmacy } from '@mui/icons-material';

const Logo = ({ variant = 'full', size = 'medium', color = 'primary' }) => {
  const sizes = {
    small: { icon: 24, text: '1.25rem', height: 40 },
    medium: { icon: 32, text: '1.5rem', height: 50 },
    large: { icon: 48, text: '2rem', height: 70 },
  };

  const currentSize = sizes[size] || sizes.medium;

  if (variant === 'icon') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: currentSize.height,
          height: currentSize.height,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
        }}
      >
        <LocalPharmacy
          sx={{
            fontSize: currentSize.icon,
            color: '#ffffff',
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      {/* Icono con gradiente */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: currentSize.height,
          height: currentSize.height,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          },
        }}
      >
        <LocalPharmacy
          sx={{
            fontSize: currentSize.icon,
            color: '#ffffff',
            position: 'relative',
            zIndex: 1,
          }}
        />
      </Box>

      {/* Texto del logo */}
      {variant === 'full' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: currentSize.text,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}
          >
            FARMASHAIO
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#64748b',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              mt: 0.5,
            }}
          >
            Soporte TI
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Logo;
