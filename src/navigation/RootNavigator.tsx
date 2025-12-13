import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { HomeScreen } from '../screens/HomeScreen';
import ReportIssueScreen from '../screens/ReportIssueScreen';
import { NearbyIssues } from '../screens/NearbyIssues';
import { ReportDetails } from '../screens/ReportDetails';
import { RootStackParamList } from '../types/navigation';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { MyReportsScreen } from 'screens/MyReportsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
        }}
        initialRouteName="Welcome"
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />
        <Stack.Screen 
          name="ReportIssue" 
          component={ReportIssueScreen} 
        />
        <Stack.Screen 
          name="NearbyIssues" 
          component={NearbyIssues} 
        />
        <Stack.Screen 
          name="ReportDetails" 
          component={ReportDetails} 
        />
        <Stack.Screen 
          name="MyReports" 
          component={MyReportsScreen} 
        />
        <Stack.Screen
          name="ReportDetails"
          component={ReportDetails}
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyReports"
          component={MyReportsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReportDetails"
          component={ReportDetails}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};