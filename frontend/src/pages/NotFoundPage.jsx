import React from 'react';
import { Box, Button } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FuzzyText from '../components/FuzzyText';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      textAlign="center"
      gap={2}
      sx={{ background: '#18141c' }}
    >
      <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true} fontSize="clamp(3rem, 10vw, 8rem)" color="#fff">
        404
      </FuzzyText>
      <FuzzyText fontSize="clamp(1.5rem, 5vw, 3rem)" fontWeight={700} color="#fff" baseIntensity={0.15} hoverIntensity={0.3} enableHover={true}>
        Página no encontrada
      </FuzzyText>
      <Box mt={3}>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
        >
          Volver al Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default NotFoundPage;