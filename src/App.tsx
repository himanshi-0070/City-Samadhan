import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme } from './theme/darkTheme';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ChatInterface />
    </ThemeProvider>
  );
}

export default App;