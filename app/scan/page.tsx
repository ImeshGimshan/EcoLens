"use client";

import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Zap,
  AlertCircle,
  RotateCcw,
  Sparkles,
  MapPin,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnalysisResultOverlay } from "@/components/AnalysisResultOverlay";
import { AnalysisResult } from "@/lib/ai/types";
import { useAuth } from "@/contexts/AuthContext";

export default function ScanPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [provider, setProvider] = useState<string | undefined>(undefined);
  const [showResult, setShowResult] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
    name?: string; // Heritage site name
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check for heritage site location from URL parameters
  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const name = searchParams.get("name");
    const address = searchParams.get("address");

    if (lat && lng) {
      setLocation({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        address: address || undefined,
        name: name || undefined,
      });
    }
  }, [searchParams]);

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // Use back camera on mobile
          audio: false,
        });

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Unable to access camera. Please grant camera permissions.");
      }
    };

    initCamera();

    // Cleanup: stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture photo from video stream
  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to base64 image
        const photoData = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedPhoto(photoData);
        setError(null); // Clear any previous errors

        // Capture location for AI context (non-blocking)
        // Only if location is not already set from URL params (heritage site)
        if (!location) {
          try {
            const position = await navigator.geolocation.getCurrentPosition(
              async (pos) => {
                const { latitude, longitude } = pos.coords;

                // Try reverse geocoding
                try {
                  const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`,
                    { headers: { "User-Agent": "EcoLens Heritage App" } },
                  );
                  const data = await response.json();
                  setLocation({
                    latitude,
                    longitude,
                    address: data.display_name || undefined,
                  });
                } catch {
                  setLocation({ latitude, longitude });
                }
              },
              (err) => {
                console.warn("Location capture failed:", err);
                // Continue without location - not critical
              },
              { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
            );
          } catch (err) {
            console.warn("Location not available:", err);
          }
        }
      }
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedPhoto(null);
    setAnalysisResult(null);
    setShowResult(false);
    setError(null);
  };

  // Analyze photo
  const analyzePhoto = async () => {
    if (!capturedPhoto) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: capturedPhoto,
          location, // Include location for AI context
          // Provider can be set generically or let backend use default
          // provider: "gemini"
        }),
      });

      const data = await response.json();
      console.log("Analysis result:", data);

      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
        setImageUrl(data.metadata?.imageUrl);
        setProvider(data.provider);
        setShowResult(true);
      } else {
        throw new Error(data.error || "Analysis failed to return results");
      }
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Analysis failed. Please try again.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <MobileFrame>
      {/* Custom Header for Scan Page */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-orange-500 via-red-500 to-red-600 text-white overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Camera size={24} strokeWidth={2.5} />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">AI Scanner</h1>
              <p className="text-sm opacity-90 font-medium">
                Heritage Analysis
              </p>
            </div>
          </div>

          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-2 h-2 rounded-full shadow-lg ${
              isCameraReady ? "bg-green-400" : "bg-yellow-400"
            }`}
          ></motion.div>
        </div>

        {/* Heritage Site Banner */}
        {location?.name && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-3"
          >
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-blue-300 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {location.name}
                </p>
                {location.address && (
                  <p className="text-xs text-blue-100 truncate">
                    {location.address}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      </motion.header>

      {/* Camera View */}
      <main className="flex-1 flex flex-col relative bg-gradient-to-b from-gray-900 to-black">
        <div className="flex-1 relative overflow-hidden">
          {/* Video Feed or Captured Photo */}
          {capturedPhoto ? (
            // Show captured photo
            <img
              src={capturedPhoto}
              alt="Captured"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            // Show live video feed
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanning Animation Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-orange-500/20 flex items-center justify-center mb-4"
              >
                <Sparkles size={48} className="text-orange-400" />
              </motion.div>
              <p className="text-white font-medium animate-pulse">
                Analyzing Structure...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="absolute inset-x-0 top-4 z-20 flex justify-center px-4">
              <div className="bg-red-500/90 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 backdrop-blur-sm">
                <AlertCircle size={16} />
                <p className="text-sm font-medium">{error}</p>
                <button onClick={() => setError(null)} className="ml-2">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Corner Brackets */}
          <div className="absolute inset-0 p-8 pointer-events-none">
            <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-orange-500 rounded-tl-2xl"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-orange-500 rounded-tr-2xl"></div>
            <div className="absolute bottom-24 left-8 w-16 h-16 border-b-4 border-l-4 border-orange-500 rounded-bl-2xl"></div>
            <div className="absolute bottom-24 right-8 w-16 h-16 border-b-4 border-r-4 border-orange-500 rounded-br-2xl"></div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-28 left-0 right-0 flex flex-col items-center gap-4 p-6">
            {!showResult && (
              <>
                {capturedPhoto ? (
                  // Photo captured - show retake and analyze buttons
                  <div className="flex gap-3 w-full max-w-sm">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={retakePhoto}
                      disabled={isAnalyzing}
                      className="flex-1 px-6 py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 border border-white/30 disabled:opacity-50"
                    >
                      <RotateCcw size={20} strokeWidth={2.5} />
                      Retake
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={analyzePhoto}
                      disabled={isAnalyzing}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Sparkles size={20} strokeWidth={2.5} />
                          Analyze
                        </>
                      )}
                    </motion.button>
                  </div>
                ) : (
                  // No photo - show capture button
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={capturePhoto}
                    disabled={!isCameraReady}
                    className={`px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg flex items-center gap-3 ${
                      !isCameraReady ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Zap size={20} strokeWidth={2.5} />
                    Capture Photo
                  </motion.button>
                )}
              </>
            )}

            {/* Info Cards */}
            {!capturedPhoto && (
              <div className="flex gap-2 w-full max-w-sm">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20"
                >
                  <div className="flex items-center gap-2 text-white">
                    <AlertCircle size={16} />
                    <span className="text-xs font-medium">AI Powered</span>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20"
                >
                  <div className="flex items-center gap-2 text-white">
                    <Camera size={16} />
                    <span className="text-xs font-medium">Photo Mode</span>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Analysis Result Overlay */}
      <AnimatePresence>
        {showResult && analysisResult && (
          <AnalysisResultOverlay
            result={analysisResult}
            imageUrl={imageUrl}
            provider={provider}
            userId={user?.uid}
            userEmail={user?.email || undefined}
            onClose={() => setShowResult(false)}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </MobileFrame>
  );
}
