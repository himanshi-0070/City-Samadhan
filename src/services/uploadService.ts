// services/uploadService.ts

const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/dtqjjbm7u/image/upload";

const UPLOAD_PRESET = "city_reports";

export const uploadFile = async (fileUri: string) => {
  try {
    console.log("IMAGE URI 👉", fileUri);
    const uriParts = fileUri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    const formData = new FormData();

    formData.append("file", {
      uri: fileUri,
      name: `upload.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = await res.json();

    if (!data.secure_url) {
      console.log("CLOUDINARY ERROR 👉", data);
      throw new Error("Image upload failed");
    }

    return data.secure_url;
  } catch (err) {
    console.log("❌ CLOUDINARY UPLOAD ERROR:", err);
    throw err;
  }
};
