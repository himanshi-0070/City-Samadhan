import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  ReportIssue: { category?: string } | undefined;
  NearbyIssues: undefined;
  ReportDetails: { reportId: string };
  EditProfile: undefined;
  MyReports: undefined;
  MainTabs: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Nearby: undefined;
  MyReports: undefined;
  Profile: undefined;
};