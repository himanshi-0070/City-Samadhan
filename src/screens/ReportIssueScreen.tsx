import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import * as Location from "expo-location";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { uploadToCloudinary } from "../services/cloudinaryUpload";
const [submitting, setSubmitting] = useState(false);
import { submitIssue, fetchAllIssues } from "../services/reportService";


type ReportIssueScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ReportIssue">;
  route: RouteProp<RootStackParamList, "ReportIssue">;
};

const ReportIssueScreen: React.FC<ReportIssueScreenProps> = ({
  navigation,
  route,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);

  // ---------- IMAGE PICKER / CAMERA ----------
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets.length > 0) {
        setImages((prev) => [...prev, result.assets[0].uri]);
      }
    } catch {
      Alert.alert("Error", "Failed to pick image");
    }
  };
  //taking photo
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets.length > 0) {
        setImages((prev) => [...prev, result.assets[0].uri]);
      }
    } catch {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  // ---------- AUDIO RECORDING ----------
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") return Alert.alert("Permission denied");

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);
    } catch {
      Alert.alert("Error", "Could not start recording");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) setVoiceNote(uri);
    } catch {
      Alert.alert("Error", "Failed to stop recording");
    } finally {
      setIsRecording(false);
      setRecording(null);
    }
  };

  // ---------- LOCATION ----------
  const captureLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return Alert.alert("Enable location permissions!");

      const pos = await Location.getCurrentPositionAsync({});
      const [addr] = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });

      const address = addr
        ? `${addr.name || ""}, ${addr.street || ""}, ${addr.city || ""}`
        : "Unknown";

      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        address,
      });

      Alert.alert("Location Captured!");
    } catch {
      Alert.alert("Error capturing location");
    }
  };

  // ---------- SUBMIT REPORT ----------
  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      const uploadedImages: string[] = [];

      for (const img of images) {
        const url = await uploadToCloudinary(img);
        uploadedImages.push(url);
      }

      let voiceUrl: string | null = null;
      if (voiceNote) voiceUrl = await uploadToCloudinary(voiceNote);

      await submitIssue({
        title,
        category: route.params?.category || "Others",
        location,
        images: uploadedImages,
        voiceNote: voiceUrl,
        status: "pending",
      });

      Alert.alert("Success", "Issue submitted", [
        {
          text: "OK",
          onPress: () => {
            // 🔥 RESET FORM
            setTitle("");
            setImages([]);
            setVoiceNote(null);
            setLocation(null);

            navigation.navigate("Home");
          },
        },
      ]);

    } catch (err: any) {
      console.log("SUBMIT ERROR:", err.message);
      Alert.alert("Error", "Failed to submit: " + err.message);
    }
  };


  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 5 }}>
      <Text style={styles.heading}>Report an Issue</Text>

      {/* Image Buttons */}
      <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <MaterialIcons name="photo-library" size={28} color="#333" />
          <Text style={styles.imageText}>Pick Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
          <MaterialIcons name="camera-alt" size={28} color="#333" />
          <Text style={styles.imageText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      {images.length > 0 && (
        <ScrollView horizontal style={{ marginBottom: 16 }}>
          {images.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.previewImage} />
          ))}
        </ScrollView>
      )}

      {/* Voice Note */}
      <TouchableOpacity
        style={styles.voiceButton}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <MaterialIcons
          name={isRecording ? "stop" : "mic"}
          size={28}
          color={isRecording ? "#FF3B30" : "#333"}
        />
        <Text style={styles.voiceText}>
          {isRecording ? "Stop Recording" : voiceNote ? "Re-record Voice Note" : "Add Voice Note"}
        </Text>
      </TouchableOpacity>

      {/* Title */}
      <TextInput
        placeholder="Enter Issue Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      {/* Location */}
      <TouchableOpacity style={styles.locationButton} onPress={captureLocation}>
        <MaterialIcons name="my-location" size={24} color="#555" />
        <Text style={styles.locationText}>
          {location ? "Update GPS Location" : "Capture GPS Location"}
        </Text>
      </TouchableOpacity>

      {location && <Text style={styles.addressText}>{location.address}</Text>}

      {/* Submit */}
      <TouchableOpacity
        disabled={submitting}
        style={{ opacity: submitting ? 0.6 : 1 }}
        onPress={handleSubmit}
      >
        <Text style={styles.submitText}>Submit Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  imageButton: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  imageText: { marginTop: 4, fontSize: 14 },
  previewImage: { width: 100, height: 100, marginRight: 8, borderRadius: 8 },
  voiceButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f1f1f1",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  voiceText: { marginLeft: 8, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  locationButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f1f1f1",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: { marginLeft: 8 },
  addressText: { marginBottom: 16, color: "#666" },
  submitBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
export default ReportIssueScreen;