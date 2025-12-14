import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../theme/ThemeContext';
import { getReportById } from "../services/reportService";


type ReportDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ReportDetails'>;
type ReportDetailsScreenRouteProp = any;

interface ReportData {
  id: string;
  category: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  status: string;
  createdAt: string;
  image?: string[];
}

export const ReportDetails = () => {
  const navigation = useNavigation<ReportDetailsScreenNavigationProp>();
  const route = useRoute<ReportDetailsScreenRouteProp>();
  const { isDark } = useTheme();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportDetails();
  }, []);

  const fetchReportDetails = async () => {
    try {
      const { reportId } = route.params;

      const report = await getReportById(reportId);

      setReportData(report as any);
    } catch (error) {
      console.error("Error fetching report details:", error);
    } finally {
      setLoading(false);
    }
  };


  if (loading || !reportData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
        <View style={styles.loaderContainer}>
          <Text style={[styles.loadingText, { color: isDark ? '#aaa' : '#666' }]}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="arrow-back"
            size={28}
            color={isDark ? '#fff' : '#333'}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#333' }]}>
          Report Details
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' }]}>
          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, { color: '#34C759' }]}>
              {reportData.status}
            </Text>
          </View>

          <Text style={[styles.category, { color: isDark ? '#fff' : '#333' }]}>
            {reportData.category}
          </Text>

          <Text style={[styles.description, { color: isDark ? '#aaa' : '#666' }]}>
            {reportData.description}
          </Text>
          {/* REPORT IMAGES */}
          {reportData.images && reportData.images.length > 0 && (
            <ScrollView horizontal style={{ marginBottom: 16 }}>
              {reportData.images.map((img: string, index: number) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                />
              ))}
            </ScrollView>
          )}


          <View style={styles.detailsSection}>
            <View style={styles.detailItem}>
              <MaterialIcons name="location-on" size={20} color="#007AFF" />
              <Text style={[styles.detailLabel, { color: isDark ? '#aaa' : '#666' }]}>
                {reportData.location}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <MaterialIcons name="calendar-today" size={20} color="#007AFF" />
              <Text style={[styles.detailLabel, { color: isDark ? '#aaa' : '#666' }]}>
                {new Date(reportData.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <MaterialIcons name="schedule" size={20} color="#007AFF" />
              <Text style={[styles.detailLabel, { color: isDark ? '#aaa' : '#666' }]}>
                {new Date(reportData.createdAt).toLocaleTimeString()}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <MaterialIcons name="info" size={20} color="#007AFF" />
              <Text style={[styles.detailLabel, { color: isDark ? '#aaa' : '#666' }]}>
                ID: {reportData.id}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton}>
            <MaterialIcons name="edit" size={20} color="#fff" />
            <Text style={styles.editButtonText}>Edit Report</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton}>
            <MaterialIcons name="delete" size={20} color="#fff" />
            <Text style={styles.deleteButtonText}>Delete Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
  },
  category: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    color: '#666',
  },
  detailsSection: {
    marginTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});