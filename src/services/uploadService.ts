// services/uploadService.ts

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadFile = async (fileUri: string, folder: string) => {
  try {
    const storage = getStorage();

    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;

    // Convert file to blob
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const storageRef = ref(storage, fileName);

    // Upload blob using Firebase v9 method
    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;

  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    throw error;
  }
};
