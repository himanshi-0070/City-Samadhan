import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";

import { listenToUserReports } from "../services/reportService";
import { RootStackParamList } from "../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type MyReportsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MyReports"
>;

export const MyReportsScreen = () => {
  const navigation = useNavigation<MyReportsScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState("All");
  const [reports, setReports] = useState<any[]>([]);
  const user = getAuth().currentUser;

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenToUserReports(user.uid, (fetchedReports) => {
      setReports(fetchedReports);
    });

    return unsubscribe;
  }, []);

  const filteredReports = reports.filter((r) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending") return r.status === "pending";
    if (activeTab === "In Progress") return r.status === "in-progress";
    if (activeTab === "Resolved") return r.status === "resolved";
    return true;
  });

  const tabs = [
    { name: "All", count: reports.length },
    { name: "Pending", count: reports.filter((r) => r.status === "pending").length },
    { name: "In Progress", count: reports.filter((r) => r.status === "in-progress").length },
    { name: "Resolved", count: reports.filter((r) => r.status === "resolved").length },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reports</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* TABS */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              style={[styles.tab, activeTab === tab.name && styles.activeTab]}
              onPress={() => setActiveTab(tab.name)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.name && styles.activeTabText,
                ]}
              >
                {tab.name} ({tab.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* REPORT LIST */}
        {filteredReports.length === 0 ? (
          <Text style={styles.noReports}>No reports found</Text>
        ) : (
          filteredReports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportCard}
              onPress={() =>
                navigation.navigate("ReportDetails", { reportId: report.id })
              }
            >
              {/* IMAGE */}
              {report.images && report.images.length > 0 ? (
                <Image
                  source={{ uri: report.images[0] }}
                  style={styles.reportImage}
                />
              ) : (
                <View
                  style={[
                    styles.reportImage,
                    { justifyContent: "center", alignItems: "center" },
                  ]}
                >
                  <Text>No Image</Text>
                </View>
              )}

              <View style={styles.reportContent}>
                <Text style={styles.reportTitle}>{report.title}</Text>

                <View style={styles.reportMeta}>
                  <MaterialIcons name="category" size={14} color="#3b82f6" />
                  <Text style={styles.reportCategory}>{report.category}</Text>

                  <Text style={styles.reportDate}>
                    •{" "}
                    {report.createdAt?.seconds
                      ? new Date(
                          report.createdAt.seconds * 1000
                        ).toDateString()
                      : "Just now"}
                  </Text>
                </View>

                <View style={styles.reportLocation}>
                  <MaterialIcons name="location-on" size={14} color="#ef4444" />
                  <Text style={styles.locationText}>
                    {report.location?.address || "No address"}
                  </Text>
                </View>

                <View style={styles.statusBadgeContainer}>
                  <Text
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          report.status === "resolved"
                            ? "#d1fae5"
                            : report.status === "in-progress"
                            ? "#fef3c7"
                            : "#fee2e2",
                        color:
                          report.status === "resolved"
                            ? "#059669"
                            : report.status === "in-progress"
                            ? "#d97706"
                            : "#b91c1c",
                      },
                    ]}
                  >
                    {report.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#1f2937" },
  scrollContent: { padding: 16 },
  tabsContainer: { flexDirection: "row", gap: 10, marginBottom: 16 },
  tab: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
  },
  activeTab: { backgroundColor: "#3b82f6" },
  tabText: { fontSize: 14, fontWeight: "600", color: "#374151" },
  activeTabText: { color: "#fff" },
  reportCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  reportImage: { width: "100%", height: 130 },
  reportContent: { padding: 12 },
  reportTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  reportMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  reportCategory: { fontSize: 12, color: "#3b82f6" },
  reportDate: { fontSize: 12, color: "#9ca3af" },
  reportLocation: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  locationText: { fontSize: 12, color: "#6b7280" },
  statusBadgeContainer: { marginTop: 10 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: "600",
  },
  noReports: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 20,
    fontSize: 15,
  },
});
