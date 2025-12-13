import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

// ----------------------------------
// TYPES
// ----------------------------------
type Category = 'Roads' | 'Water' | 'Lights' | 'Garbage' | 'Sanitation' | 'All';

interface IssueItem {
  id: number;
  title: string;
  category: Category;
  distance: string;
  location: string;
  reports: number;
  image: string;
  latitude: number;
  longitude: number;
}

// ----------------------------------
// CATEGORY COLORS
// ----------------------------------
const CATEGORY_COLORS: Record<Exclude<Category, 'All'>, string> = {
  Roads: '#ef4444',
  Water: '#3b82f6',
  Lights: '#f59e0b',
  Garbage: '#10b981',
  Sanitation: '#8b5cf6',
};

// ----------------------------------
// COMPONENT
// ----------------------------------
export const NearbyIssues = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  const [userLocation, setUserLocation] = useState<Region | undefined>(undefined);
  const [mapRegion, setMapRegion] = useState<Region | undefined>(undefined);

  const [showMap, setShowMap] = useState(true);

  const categories: Category[] = ['All', 'Roads', 'Garbage', 'Water', 'Lights'];

  const allIssues: IssueItem[] = [
    {
      id: 1,
      title: 'Broken Water Pipe',
      category: 'Water',
      distance: '0.5 km away',
      location: 'Oak Avenue',
      reports: 3,
      image: '💧',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    {
      id: 2,
      title: 'Street Light Damaged',
      category: 'Lights',
      distance: '0.8 km away',
      location: 'Main Street',
      reports: 5,
      image: '💡',
      latitude: 37.7751,
      longitude: -122.4185,
    },
    {
      id: 3,
      title: 'Road Pothole',
      category: 'Roads',
      distance: '1.2 km away',
      location: 'Park Road',
      reports: 7,
      image: '🚗',
      latitude: 37.7752,
      longitude: -122.419,
    },
    {
      id: 4,
      title: 'Garbage Overflow',
      category: 'Garbage',
      distance: '1.5 km away',
      location: 'Center Plaza',
      reports: 2,
      image: '🗑️',
      latitude: 37.7748,
      longitude: -122.42,
    },
    {
      id: 5,
      title: 'Road Cracks',
      category: 'Roads',
      distance: '0.3 km away',
      location: 'Elm Street',
      reports: 4,
      image: '🚗',
      latitude: 37.775,
      longitude: -122.4188,
    },
    {
      id: 6,
      title: 'Water Leakage',
      category: 'Water',
      distance: '2.1 km away',
      location: 'Central Park',
      reports: 6,
      image: '💧',
      latitude: 37.7745,
      longitude: -122.4205,
    },
    {
      id: 7,
      title: 'Broken Street Light',
      category: 'Lights',
      distance: '1.8 km away',
      location: 'Broadway Street',
      reports: 3,
      image: '💡',
      latitude: 37.7753,
      longitude: -122.418,
    },
    {
      id: 8,
      title: 'Garbage Dump',
      category: 'Garbage',
      distance: '2.5 km away',
      location: 'West End',
      reports: 8,
      image: '🗑️',
      latitude: 37.774,
      longitude: -122.421,
    },
  ];

  // ----------------------------------
  // GET LOCATION
  // ----------------------------------
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to show nearby issues on map.'
        );

        const fallback: Region = {
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        setUserLocation(fallback);
        setMapRegion(fallback);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newLoc: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      setUserLocation(newLoc);
      setMapRegion(newLoc);
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  // ----------------------------------
  // PICK IMAGE
  // ----------------------------------
  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // FIXED
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert('Success', 'Photo uploaded successfully!', [{ text: 'OK' }]);
    }
  };

  // ----------------------------------
  // FILTER ISSUES
  // ----------------------------------
  const filteredIssues =
    selectedCategory === 'All'
      ? allIssues
      : allIssues.filter((i) => i.category === selectedCategory);

  // ----------------------------------
  // GET CATEGORY COLOR
  // ----------------------------------
  const getCategoryColor = (category: Category) => {
    if (category === 'All') return '#6b7280';
    return CATEGORY_COLORS[category];
  };

  // ----------------------------------
  // UI
  // ----------------------------------
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerGradient}>
        <Text style={styles.headerTitle}>Nearby Issues</Text>
        <Text style={styles.headerSubtitle}>Issues around you</Text>

        {/* SEARCH BAR */}
        <View style={styles.searchBarContainer}>
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search issues..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* CATEGORY FILTER */}
      <View style={styles.categoryFilterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.activeChip,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.activeCategoryChipText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* MAP */}
      {showMap && userLocation && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={userLocation}
            region={mapRegion ?? undefined}
            onRegionChange={(region) => setMapRegion(region)}
          >
            {/* USER MARKER */}
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="Your Location"
              pinColor="#3b82f6"
            />

            {/* ISSUE MARKERS */}
            {filteredIssues.map((issue) => (
              <Marker
                key={issue.id}
                coordinate={{
                  latitude: issue.latitude,
                  longitude: issue.longitude,
                }}
                title={issue.title}
                description={`${issue.location} • ${issue.reports} reports`}
              >
                <View
                  style={[
                    styles.markerView,
                    { backgroundColor: getCategoryColor(issue.category) },
                  ]}
                >
                  <Text style={styles.markerText}>{issue.image}</Text>
                </View>
              </Marker>
            ))}
          </MapView>

          {/* TOGGLE LIST VIEW */}
          <TouchableOpacity
            style={styles.toggleMapButton}
            onPress={() => setShowMap(false)}
          >
            <MaterialIcons name="list" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* LIST VIEW */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={!showMap}
        contentContainerStyle={styles.scrollContent}
      >
        {!showMap &&
          filteredIssues.map((issue) => (
            <TouchableOpacity key={issue.id} style={styles.issueCard}>
              <View
                style={[
                  styles.issueImage,
                  {
                    backgroundColor: `${getCategoryColor(issue.category)}20`,
                  },
                ]}
              >
                <Text style={styles.issueEmoji}>{issue.image}</Text>
              </View>

              <View style={styles.issueContent}>
                <View style={styles.issueTitleRow}>
                  <Text style={styles.issueTitle}>{issue.title}</Text>
                </View>

                <View style={styles.issueMeta}>
                  <MaterialIcons name="location-on" size={16} color="#ef4444" />
                  <Text style={styles.metaText}>{issue.location}</Text>
                </View>

                <View style={styles.issueMeta}>
                  <MaterialIcons name="navigation" size={16} color="#3b82f6" />
                  <Text style={styles.metaText}>{issue.distance}</Text>
                </View>

                <View style={styles.reportersContainer}>
                  <MaterialIcons name="group" size={16} color="#f59e0b" />
                  <Text style={styles.reportersText}>
                    {issue.reports} people reported this
                  </Text>
                </View>
              </View>

              <MaterialIcons name="chevron-right" size={24} color="#d1d5db" />
            </TouchableOpacity>
          ))}

        {!showMap && (
          <View style={styles.addPhotoSection}>
            <Text style={styles.addPhotoTitle}>Found an Issue?</Text>

            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={pickImage}
            >
              <MaterialIcons name="camera-alt" size={24} color="#fff" />
              <Text style={styles.addPhotoButtonText}>Add Photos</Text>
            </TouchableOpacity>

            <Text style={styles.addPhotoSubtext}>
              Take a photo of the issue and help your community
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ----------------------------------
// STYLES
// ----------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },

  headerGradient: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
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
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 14, color: '#333' },

  categoryFilterContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: '#3b82f6',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeCategoryChipText: {
    color: '#fff',
  },

  mapContainer: { flex: 1 },
  map: { flex: 1 },

  markerView: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  markerText: { fontSize: 24 },

  toggleMapButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3b82f6',
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },

  issueCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  issueImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  issueEmoji: { fontSize: 28 },

  issueContent: { flex: 1 },

  issueTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  issueTitle: { fontSize: 15, fontWeight: 'bold', color: '#1f2937' },

  issueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  metaText: { fontSize: 12, color: '#6b7280' },

  reportersContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  reportersText: { fontSize: 12, color: '#6b7280' },

  addPhotoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
    alignItems: 'center',
  },
  addPhotoTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  addPhotoButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addPhotoButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  addPhotoSubtext: { marginTop: 8, fontSize: 12, color: '#6b7280' },
});

