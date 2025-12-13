import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, isUser ? styles.userAvatar : styles.assistantAvatar]}>
        <Ionicons 
          name={isUser ? "person" : "chatbubble-ellipses"} 
          size={16} 
          color={isUser ? "#fff" : "#10b981"} 
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{isUser ? "You" : "Civico"}</Text>
        <Text style={styles.message}>{content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    backgroundColor: '#374151',
  },
  assistantAvatar: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9ca3af',
  },
  message: {
    fontSize: 15,
    color: '#f9fafb',
    lineHeight: 22,
  },
});
