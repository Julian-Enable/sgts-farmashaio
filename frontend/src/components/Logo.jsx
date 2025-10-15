import React from 'react';
import { Box, Typography } from '@mui/material';
import logoImage from '../assets/logo.png';

const Logo = ({ variant = 'full', size = 'medium', showSubtitle = true }) => {
  const sizes = {
    small: { height: 35, text: '1.1rem', subtitle: '0.65rem' },
    medium: { height: 45, text: '1.35rem', subtitle: '0.7rem' },
    large: { height: 60, text: '1.75rem', subtitle: '0.8rem' },
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
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <img
          src={logoImage}
          alt="FARMASHAIO Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
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
      }}
    >
      {/* Logo image */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: currentSize.height,
          minWidth: currentSize.height,
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          p: 0.5,
        }}
      >
        <img
          src={logoImage}
          alt="FARMASHAIO Logo"
          style={{
            height: '100%',
            width: 'auto',
            objectFit: 'contain',
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
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.3px',
              lineHeight: 1.2,
            }}
          >
            FARMASHAIO
          </Typography>
          {showSubtitle && (
            <Typography
              variant="caption"
              sx={{
                fontSize: currentSize.subtitle,
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.85)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                mt: 0.3,
              }}
            >
              Soporte TI
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Logo;
