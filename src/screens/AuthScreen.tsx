import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuthStore } from '../store/authStore';

// 🔥 Firebase imports
import { FIREBASE_AUTH as auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface AuthState {
  user: {
    name: string;
    phone: string;
    email?: string;
  } | null;
  login: (userData: { name: string; phone: string; email?: string }) => void;
}

type AuthScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Auth'>;
};

export const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const saveUserToStore = useAuthStore((state: AuthState) => state.login);

  const handleSubmit = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        Alert.alert("Error", "Email & Password are required");
        return;
      }

      if (!isLogin && (!name.trim() || !phone.trim())) {
        Alert.alert("Error", "Name & Phone are required for signup");
        return;
      }

      if (isLogin) {
        // -------------------------
        // 🔹 LOGIN USER
        // -------------------------
        const res = await signInWithEmailAndPassword(auth, email, password);

        const snap = await getDoc(doc(db, "users", res.user.uid));
        if (!snap.exists()) {
          Alert.alert("Error", "User not found in Firestore");
          return;
        }

        const userData = snap.data();
        saveUserToStore(userData);

        navigation.replace("MainTabs");
      } else {
        // -------------------------
        // 🔹 SIGN UP USER
        // -------------------------
        const res = await createUserWithEmailAndPassword(auth, email, password);

        const newUser = {
          uid: res.user.uid,
          name,
          phone,
          email,
        };

        await setDoc(doc(db, "users", res.user.uid), newUser);

        saveUserToStore(newUser);
        Alert.alert("Success", "Account created!");

        navigation.replace("MainTabs");
      }
    } catch (error: any) {
      console.log("AUTH ERROR:", error);

      let msg = "Something went wrong";

      if (error.code === "auth/invalid-email") msg = "Invalid email address";
      if (error.code === "auth/user-not-found") msg = "No account exists with this email";
      if (error.code === "auth/wrong-password") msg = "Incorrect password";
      if (error.code === "auth/email-already-in-use") msg = "Email already registered";
      if (error.code === "auth/weak-password") msg = "Password must be at least 6 characters";

      Alert.alert("Authentication Error", msg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{isLogin ? 'Login' : 'Create Account'}</Text>

        {/* Signup fields only */}
        {!isLogin && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <PrimaryButton
          title={isLogin ? 'Login' : 'Create Account'}
          onPress={handleSubmit}
          style={styles.button}
        />

        <TouchableOpacity
          onPress={() => setIsLogin(!isLogin)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleText}>
            {isLogin
              ? "Don't have an account? Create one"
              : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: { marginTop: 8 },
  toggleButton: { marginTop: 16, alignItems: 'center' },
  toggleText: { color: '#007AFF', fontSize: 14 },
});
