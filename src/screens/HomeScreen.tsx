import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const { width, height } = Dimensions.get('window');

interface CategoryItemProps {
  category: string;
  icon: string;
  index: number;
  totalItems: number;
  onPress: () => void;
}

const CATEGORIES = [
  { name: 'Waste Management', icon: 'trash' },
  { name: 'Road Damage', icon: 'road' },
  { name: 'Street Light', icon: 'lightbulb' },
  { name: 'Water Supply', icon: 'water' },
  { name: 'Sanitation', icon: 'soap' },
  { name: 'Sewage and Drainage', icon: 'water-outline' },
];

const CategoryItem = ({ category, icon, index, totalItems, onPress }: CategoryItemProps) => {
  return (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.categoryIconContainer}>
        <FontAwesome5 name={icon} size={28} color="#666" />
      </View>
      <Text style={styles.categoryName}>{category}</Text>
    </TouchableOpacity>
  );
};

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [location, setLocation] = useState<string | null>('Current Location');
  const [searchQuery, setSearchQuery] = useState('');

  const handleReportButtonPress = () => {
    navigation.navigate('ReportIssue', { category: 'Other' });
  };

  const handleCheckNearbyPress = () => {
    navigation.navigate('NearbyIssues');
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* BLUE HEADER */}
      <View style={styles.headerGradient}>
        <Text style={styles.greeting}>Good morning!</Text>
        <Text style={styles.subGreeting}>Help make your city better</Text>
        
        {/* SEARCH BAR */}
        <View style={styles.searchBarContainer}>
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search issues or locations..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* REPORT BUTTON */}
        <TouchableOpacity
          style={styles.reportButton}
          onPress={handleReportButtonPress}
          activeOpacity={0.7}
        >
          <MaterialIcons name="camera-alt" size={24} color="#fff" />
          <Text style={styles.reportButtonText}>Report an Issue</Text>
        </TouchableOpacity>

        {/* CHECK NEARBY BUTTON */}
        <TouchableOpacity
          style={styles.checkNearbyButton}
          onPress={handleCheckNearbyPress}
          activeOpacity={0.7}
        >
          <MaterialIcons name="location-on" size={24} color="#fff" />
          <Text style={styles.checkNearbyButtonText}>Check Nearby Issues</Text>
        </TouchableOpacity>

        {/* SELECT CATEGORY TITLE */}
        <Text style={styles.selectCategoryTitle}>
          Select Category
        </Text>

        {/* CATEGORIES GRID */}
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((category, index) => (
            <CategoryItem
              key={category.name}
              category={category.name}
              icon={category.icon}
              index={index}
              totalItems={CATEGORIES.length}
              onPress={() => navigation.navigate('ReportIssue', { category: category.name })}
            />
          ))}
        </View>
      </ScrollView>

      {/* FLOATING CHAT BUBBLE */}
      <TouchableOpacity
        style={styles.chatBubble}
        onPress={() => navigation.navigate('Chat')}
        activeOpacity={0.8}
      >
        <MaterialIcons name="chat-bubble" size={32} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerGradient: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 80,
  },
  reportButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  checkNearbyButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#7c3aed',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkNearbyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  selectCategoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    marginBottom: 8,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  chatBubble: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#2563eb',
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
});