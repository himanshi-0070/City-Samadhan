import React, { useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { TypingIndicator } from '../components/TypingIndicator';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { useChat } from '../hooks/useChat';

export const CivicoChat = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  
  const {
    activeConversation,
    isTyping,
    sendMessage,
  } = useChat();

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isTyping]);

  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const hasMessages = activeConversation && activeConversation.messages.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6262ceff" />
      
      {/* Messages or Welcome Screen */}
      {!hasMessages ? (
        <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={scrollToBottom}
        >
          {activeConversation.messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </ScrollView>
      )}

      {/* Input Area */}
      <ChatInput onSend={sendMessage} disabled={isTyping} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5b5ba1ff',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
  },
});

export default CivicoChat;
