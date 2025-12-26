const sendFrameToBackend = async (file: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result?.toString();
      if (!base64Image) {
        console.error("Couldn't convert file to base64.");
        return resolve("Error: Couldn't convert file to base64.");
      }

      console.log("Sending base64 image (preview):", base64Image.substring(0, 100));

      try {
        const response = await fetch("http://127.0.0.1:8000/livefeed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageBase64: base64Image }),
        });

        if (!response.ok) {
          console.error("Backend error:", await response.text());
          return resolve("Error: Backend responded with failure.");
        }

        const data = await response.json();
        return resolve(data.feedback || "No feedback");
      } catch (error) {
        console.error("Fetch error:", error);
        return resolve("Error: Failed to contact backend.");
      }
    };

    reader.onerror = () => {
      console.error("FileReader error");
      resolve("Error: Couldn't read the file.");
    };

    reader.readAsDataURL(file); // Read the image file as base64 with prefix
  });
};

export { sendFrameToBackend };


