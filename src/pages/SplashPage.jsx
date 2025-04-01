
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../components/SplashScreen';

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return <SplashScreen />;
};

export default SplashPage;
