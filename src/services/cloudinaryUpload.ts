export const uploadToCloudinary = async (fileUri: string) => {
  const data = new FormData();

  data.append("file", {
    uri: fileUri,
    type: "image/jpeg",
    name: "photo.jpg",
  } as any);

  data.append("upload_preset", "city_reports");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dtqjjbm7u/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const result = await response.json();

  if (!result.secure_url) {
    console.log("CLOUDINARY ERROR 👉", result);
    throw new Error("Image upload failed");
  }

  return result.secure_url;
};
