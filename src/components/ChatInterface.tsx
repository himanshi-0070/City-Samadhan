import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  IconButton, 
  Typography, 
  Container,
  useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import { chatbotResponses } from '../data/responses';

const MessageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  overflowY: 'auto',
  height: 'calc(100vh - 200px)',
  padding: theme.spacing(2),
}));

const Message = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isUser'
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  padding: theme.spacing(1.5, 2),
  maxWidth: '70%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[1],
  whiteSpace: 'pre-wrap',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

interface ChatMessage {
  text: string;
  isUser: boolean;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: chatbotResponses.greetings.welcome, isUser: false }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const theme = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findResponse = (query: string): string => {
    query = query.toLowerCase();
    
    // Check for keywords and return appropriate responses
    if (query.includes('how') && query.includes('use')) {
      return chatbotResponses.appUsage.general;
    }
    if (query.includes('report') || query.includes('upload') || query.includes('new issue')) {
      return chatbotResponses.appUsage.reportIssue;
    }
    if (query.includes('track') || query.includes('status') || query.includes('progress')) {
      return chatbotResponses.appUsage.trackStatus;
    }
    if (query.includes('nearby') || query.includes('vote')) {
      return chatbotResponses.appUsage.nearbyIssues;
    }
    if (query.includes('profile') || query.includes('account') || query.includes('settings')) {
      return chatbotResponses.appUsage.profile;
    }
    // Department specific queries
    if (query.includes('waste') || query.includes('garbage') || query.includes('trash')) {
      return chatbotResponses.systemInfo.departmentDetails.wasteManagement;
    }
    if (query.includes('road') || query.includes('pothole') || query.includes('street condition')) {
      return chatbotResponses.systemInfo.departmentDetails.roadsAndPotholes;
    }
    if (query.includes('streetlight') || query.includes('light') || query.includes('dark street')) {
      return chatbotResponses.systemInfo.departmentDetails.streetlights;
    }
    if (query.includes('water') || query.includes('pipeline') || query.includes('supply')) {
      return chatbotResponses.systemInfo.departmentDetails.waterSupply;
    }
    if (query.includes('sewage') || query.includes('drain') || query.includes('drainage')) {
      return chatbotResponses.systemInfo.departmentDetails.sewageAndDrainage;
    }
    if (query.includes('park') || query.includes('garden') || query.includes('playground')) {
      return chatbotResponses.systemInfo.departmentDetails.publicParks;
    }
    // General department query
    if (query.includes('department') || query.includes('assign')) {
      return chatbotResponses.systemInfo.departments;
    }
    if (query.includes('language') || query.includes('hindi') || query.includes('english')) {
      return chatbotResponses.systemInfo.language;
    }
    if (query.includes('home')) {
      return chatbotResponses.navigation.home;
    }
    if (query.includes('reports') || query.includes('my issues')) {
      return chatbotResponses.navigation.myReports;
    }

    return chatbotResponses.fallback;
  };

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { text: input, isUser: true };
      const botResponse = { text: findResponse(input), isUser: false };
      
      setMessages([...messages, userMessage, botResponse]);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', position: 'relative' }}>
      <MessageContainer>
        {messages.map((message, index) => (
          <Message key={index} isUser={message.isUser}>
            <Typography variant="body1">{message.text}</Typography>
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessageContainer>
      
      <InputContainer>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius,
              }
            }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSend}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </InputContainer>
    </Container>
  );
};

export default ChatInterface;