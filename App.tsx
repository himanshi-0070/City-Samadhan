import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Navigation } from './src/navigation/index';
import { useAuthStore } from './src/store/authStore';
import { useReportsStore } from './src/store/reportsStore';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

const AppContent = () => {
  const initializeAuth = useAuthStore((state: any) => state.initialize);
  const initializeReports = useReportsStore((state: any) => state.initialize);
  const { isDark } = useTheme();

  useEffect(() => {
    initializeAuth();
    initializeReports();
  }, []);

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Navigation /> {/* This already contains NavigationContainer + Stack */}
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
