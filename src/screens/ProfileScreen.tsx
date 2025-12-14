import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { useAuthStore } from '../store/authStore';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { logout } = useAuthStore();

  const profile = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    status: 'Active Reporter',
    avatar: 'S',
  };

  const achievements = [
    { label: 'Reports Submitted', value: '12', icon: 'description', color: '#3b82f6' },
    { label: 'Issues Resolved', value: '8', icon: 'check-circle', color: '#10b981' },
    { label: 'Community Points', value: '240', icon: 'star', color: '#f59e0b' },
  ];

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleMyReports = () => {
    navigation.navigate('MyReports');
  };

  const handleSettings = () => {
    Alert.alert(
      'Switch Account',
      'Do you want to logout and login to another account?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => handleLogout(),
          style: 'destructive',
        },
      ]
    );
  };

  const handleHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'How to use City Samadhan:\n\n' +
        '1. Report Issues: Click "Report an Issue" to report civic problems in your area.\n\n' +
        '2. Choose Category: Select the category of the issue (Roads, Garbage, Water, etc.).\n\n' +
        '3. Add Details: Provide location, description, and photos of the issue.\n\n' +
        '4. View Reports: Check your reported issues in "My Reports".\n\n' +
        '5. Track Progress: Monitor the status of your reports in real-time.\n\n' +
        '6. Nearby Issues: View issues reported by others near your location.\n\n' +
        '7. Community Points: Earn points for reporting and resolving issues.\n\n' +
        'For more help, contact support@citysamadhan.com',
      [{ text: 'OK', onPress: () => {} }]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'You have been logged out successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Auth'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const menuItems = [
    { label: 'Edit Profile', icon: 'edit', color: '#3b82f6', onPress: handleEditProfile },
    { label: 'My Reports', icon: 'description', color: '#3b82f6', onPress: handleMyReports },
    { label: 'Settings', icon: 'settings', color: '#6b7280', onPress: handleSettings },
    { label: 'Help & Support', icon: 'help', color: '#6b7280', onPress: handleHelpSupport },
    { label: 'Logout', icon: 'logout', color: '#ef4444', onPress: handleLogout },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{profile.avatar}</Text>
          </View>

          <Text style={styles.userName}>
            {profile.name}
          </Text>
          <Text style={styles.userEmail}>
            {profile.email}
          </Text>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{profile.status}</Text>
          </View>

          <TouchableOpacity 
            style={styles.editButton} 
            activeOpacity={0.7}
            onPress={handleEditProfile}
          >
            <MaterialIcons name="edit" size={20} color="#fff" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ACHIEVEMENTS */}
        <View style={styles.achievementsContainer}>
          {achievements.map((achievement, index) => (
            <View
              key={index}
              style={styles.achievementCard}
            >
              <View style={[styles.achievementIcon, { backgroundColor: `${achievement.color}20` }]}>
                <MaterialIcons name={achievement.icon} size={28} color={achievement.color} />
              </View>
              <Text style={[styles.achievementValue, { color: achievement.color }]}>
                {achievement.value}
              </Text>
              <Text style={styles.achievementLabel}>
                {achievement.label}
              </Text>
            </View>
          ))}
        </View>

        {/* MENU ITEMS */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>
            OPTIONS
          </Text>

          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
              ]}
              activeOpacity={0.7}
              onPress={item.onPress}
            >
              <MaterialIcons name={item.icon} size={24} color={item.color} />
              <Text style={styles.menuLabel}>
                {item.label}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color="#d1d5db" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  editButton: {
    width: '100%',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  achievementsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  achievementCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
  menuSection: {
    marginTop: 8,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
});