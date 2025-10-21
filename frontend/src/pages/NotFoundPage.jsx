import React from 'react';
import { Box, Button } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FuzzyText from '../components/FuzzyText';
import Dither from '../components/Dither';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', p: 0, m: 0 }}>
      <Box sx={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 0 }}>
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
        gap={2}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true} fontSize="clamp(3rem, 10vw, 8rem)" color="#fff">
          404
        </FuzzyText>
        <FuzzyText fontSize="clamp(1.5rem, 5vw, 3rem)" fontWeight={700} color="#fff" baseIntensity={0.15} hoverIntensity={0.3} enableHover={true}>
          Aqui no hay nada
        </FuzzyText>
        <Box mt={4}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{
              background: 'rgba(20,20,20,0.85)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              '&:hover': {
                background: 'rgba(40,40,40,1)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.28)',
              },
            }}
          >
            Volver al Dashboard
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NotFoundPage;