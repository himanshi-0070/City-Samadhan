import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
}

const suggestions = [
  {
    icon: "document-text" as const,
    title: "Report an Issue",
    description: "Learn how to report civic issues",
    prompt: "How do I report a civic issue in my area?",
  },
  {
    icon: "time" as const,
    title: "Resolution Timeline",
    description: "Know when your issue will be resolved",
    prompt: "How long does it take for the government to resolve my reported issue?",
  },
  {
    icon: "trash" as const,
    title: "Waste Management",
    description: "Garbage collection & disposal issues",
    prompt: "What is a Waste Management Issue and how do I report garbage problems?",
  },
  {
    icon: "water" as const,
    title: "Water & Sanitation",
    description: "Water supply and sanitation problems",
    prompt: "Tell me about Water Issues and Sanitation problems I can report",
  },
];

export const WelcomeScreen = ({ onSuggestionClick }: WelcomeScreenProps) => {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Logo and Title */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="chatbubble-ellipses" size={32} color="#4b1358ff" />
        </View>
        <Text style={styles.title}>Hi, I'm Civico!</Text>
        <Text style={styles.subtitle}>
          Your City-Samadhan assistant for reporting and tracking civic issues like waste management, water supply, sanitation, and more.
        </Text>
      </View>

      {/* Suggestions Grid */}
      <View style={styles.suggestionsContainer}>
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.title}
            style={styles.suggestionCard}
            onPress={() => onSuggestionClick(suggestion.prompt)}
            activeOpacity={0.7}
          >
            <View style={styles.suggestionIcon}>
              <Ionicons name={suggestion.icon} size={20} color="#9c9fafff" />
            </View>
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
              <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(149, 115, 243, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
  },
  suggestionsContainer: {
    width: '100%',
    gap: 12,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#4c3177ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#390349ff',
    gap: 12,
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#9d0dd6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 4,
  },
  suggestionDescription: {
    fontSize: 13,
    color: '#9ca3af',
  },
});
