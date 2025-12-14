import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Uploads a local file URI to Firebase Storage and returns public URL
export const uploadFile = async (fileUri: string, folder: string): Promise<string> => {
  try {
    // Use fetch to get the file as a proper Blob
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const filename = `${folder}/${Date.now()}-${Math.floor(Math.random() * 1e6)}.jpg`;
    const storageRef = ref(storage, filename);

    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    throw err;
  }
};
