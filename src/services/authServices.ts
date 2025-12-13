    import { FIREBASE_AUTH as auth } from "../config/firebase";
    import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
    import { Alert } from "react-native";

    let verificationId: string | null = null;

    // STEP 1 → Send OTP
export const sendOtp = async (phone: string) => {
  try {
    const provider = new PhoneAuthProvider(auth);
    verificationId = await provider.verifyPhoneNumber(phone, 
      // @ts-ignore
      FirebaseRecaptchaVerifierModalRef
    );

    return verificationId;
  } catch (err) {
    console.log("OTP SEND ERROR:", err);
    throw err;
  }
};

// STEP 2 → Verify OTP
export const verifyOtp = async (otp: string) => {
  try {
    if (!verificationId) throw new Error("No verification ID");

    const credential = PhoneAuthProvider.credential(verificationId, otp);
    const result = await signInWithCredential(auth, credential);

    return result.user;
  } catch (err) {
    console.log("OTP VERIFY ERROR:", err);
    throw err;
  }
};
