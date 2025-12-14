// services/reportService.ts
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getReportById = async (reportId: string) => {
  const ref = doc(FIRESTORE_DB, "reports", reportId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Report not found");
  }

  return {
    id: snap.id,
    ...snap.data(),
  };
};


/* ---------------- SUBMIT ISSUE ---------------- */

export const submitIssue = async (data: {
  title: string;
  category: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  images: string[];
  voiceNote: string | null;
  status: string;
}) => {
  try {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) throw new Error("User not logged in");

    if (!data.title.trim()) throw new Error("Title missing");
    if (!data.location) throw new Error("Location missing");

    await addDoc(collection(FIRESTORE_DB, "issues"), {
      ...data,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    console.log("✅ ISSUE STORED SUCCESSFULLY");
  } catch (err) {
    console.log("❌ SUBMIT ISSUE ERROR:", err);
    throw err;
  }
};

/* ---------------- LISTEN TO USER REPORTS ---------------- */

export const listenToUserReports = (
  userId: string,
  callback: (reports: any[]) => void
) => {
  const q = query(
    collection(FIRESTORE_DB, "issues"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(reports);
  });

  return unsubscribe;
};
