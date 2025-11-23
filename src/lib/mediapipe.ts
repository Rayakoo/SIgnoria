let isLoaded = false;

export const loadMediaPipe = async () => {
  if (isLoaded) return;
  isLoaded = true;

  const loadScript = (src: string) =>
    new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve());
        existingScript.addEventListener("error", reject);
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.crossOrigin = "anonymous";
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });

  try {
    await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
    await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/hands.js");

    // Wait for MediaPipe globals to be available
    let attempts = 0;
    while ((!window.Hands || !window.Camera) && attempts < 50) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    if (!window.Hands || !window.Camera) {
      throw new Error("MediaPipe scripts loaded, but Hands or Camera is not available.");
    }
  } catch (error) {
    console.error("Failed to load MediaPipe scripts:", error);
    throw new Error("Gagal memuat MediaPipe. Pastikan koneksi internet stabil.");
  }
};
