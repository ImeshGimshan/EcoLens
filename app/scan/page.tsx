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
  CrosshairIcon,
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
    name?: string;
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
          video: { facingMode: "environment" },
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

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const photoData = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedPhoto(photoData);
        setError(null);

        if (!location) {
          try {
            const position = await navigator.geolocation.getCurrentPosition(
              async (pos) => {
                const { latitude, longitude } = pos.coords;

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
          location,
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
      {/* Premium Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative px-6 pt-4 pb-3 text-white overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute -top-20 -right-20 w-48 h-48 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            }}
          ></div>
          <div
            className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
            }}
          ></div>
        </div>

        <div className="relative z-10">
          {/* Title Section */}
          <h1 className="text-xl font-bold tracking-tight mb-1">
            Scan Heritage
          </h1>
          <p className="text-white/80 text-xs font-medium">
            AI-powered conservation analysis
          </p>

          {/* Status Indicator */}
          {isCameraReady && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-1 inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: "rgba(16, 185, 129, 0.2)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-green-400"
              ></motion.div>
              <span style={{ color: "#10B981" }}>Camera Ready</span>
            </motion.div>
          )}
        </div>

        {/* Heritage Site Info Banner */}
        <AnimatePresence>
          {location?.name && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 p-2 rounded-2xl"
              style={{
                background: "rgba(4, 120, 87, 0.2)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-start gap-2">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0"
                  style={{ color: "#6EE7B7" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {location.name}
                  </p>
                  {location.address && (
                    <p
                      className="text-xs mt-0.5 truncate opacity-75"
                      style={{ color: "#A7F3D0" }}
                    >
                      {location.address}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Camera View Container */}
      <main className="flex-1 flex flex-col relative overflow-hidden pb-20" style={{ background: "var(--color-eggshell)" }}>
        {/* Camera/Preview Area */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#0F172A" }}>
          {/* Video Feed or Captured Photo */}
          {capturedPhoto ? (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={capturedPhoto}
              alt="Captured"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Hidden Canvas */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Analyzing Overlay */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center"
                style={{
                  background: "rgba(31, 41, 55, 0.7)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(4, 120, 87, 0.3) 0%, rgba(16, 185, 129, 0.1) 100%)",
                    border: "2px solid rgba(16, 185, 129, 0.4)",
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles size={40} style={{ color: "#10B981" }} />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <p className="text-white font-semibold text-lg mb-2">
                    Analyzing...
                  </p>
                  <p className="text-white/60 text-xs">
                    Processing heritage data
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Toast */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-4 left-4 right-4 z-40 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3"
                style={{
                  background: "rgba(239, 68, 68, 0.9)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <AlertCircle size={18} className="shrink-0 text-white" />
                <p className="text-sm font-medium text-white flex-1">{error}</p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setError(null)}
                  className="text-white/80 hover:text-white"
                >
                  <RotateCcw size={16} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Crosshair Scanner Frame */}
          {!capturedPhoto && isCameraReady && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute inset-0 pointer-events-none p-8 flex items-center justify-center"
            >
              {/* Corner Brackets */}
              <div className="relative w-full h-full max-w-xs max-h-96">
                <div
                  className="absolute top-0 left-0 w-12 h-12 border-t-3 border-l-3 rounded-tl-2xl"
                  style={{ borderColor: "rgba(16, 185, 129, 0.6)" }}
                ></div>
                <div
                  className="absolute top-0 right-0 w-12 h-12 border-t-3 border-r-3 rounded-tr-2xl"
                  style={{ borderColor: "rgba(16, 185, 129, 0.6)" }}
                ></div>
                <div
                  className="absolute bottom-0 left-0 w-12 h-12 border-b-3 border-l-3 rounded-bl-2xl"
                  style={{ borderColor: "rgba(16, 185, 129, 0.6)" }}
                ></div>
                <div
                  className="absolute bottom-0 right-0 w-12 h-12 border-b-3 border-r-3 rounded-br-2xl"
                  style={{ borderColor: "rgba(16, 185, 129, 0.6)" }}
                ></div>

                {/* Center Crosshair */}
                <motion.div
                  animate={{ scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-1 h-8" style={{ background: "rgba(16, 185, 129, 0.4)" }}></div>
                  <div className="absolute w-8 h-1" style={{ background: "rgba(16, 185, 129, 0.4)" }}></div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Controls Section - Fixed Bottom */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="sticky bottom-0 p-5 pt-6 z-20"
          style={{
            background: "var(--color-eggshell)",
          }}
        >
          {!showResult && (
            <>
              {capturedPhoto ? (
                // Captured State - Retake & Analyze
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={retakePhoto}
                      disabled={isAnalyzing}
                      className="flex-1 px-6 py-3 font-semibold rounded-full text-white shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      style={{
                        background: "rgba(16, 185, 129, 0.2)",
                        border: "1.5px solid rgba(16, 185, 129, 0.4)",
                      }}
                    >
                      <RotateCcw size={16} strokeWidth={2.5} />
                      Retake
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={analyzePhoto}
                      disabled={isAnalyzing}
                      className="flex-1 px-6 py-3 font-semibold rounded-full text-white shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      style={{
                        background:
                          "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                      }}
                    >
                      {isAnalyzing ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles size={16} strokeWidth={2.5} />
                        </motion.div>
                      ) : (
                        <>
                          <Zap size={16} strokeWidth={2.5} />
                          Analyze
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Photo Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-xs text-white/60"
                  >
                    Photo ready for analysis
                  </motion.div>
                </div>
              ) : (
                // Ready State - Capture
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={capturePhoto}
                    disabled={!isCameraReady}
                    className={`w-full px-8 py-4 text-white font-bold rounded-full shadow-lg flex items-center justify-center gap-3 transition-all ${!isCameraReady
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-xl"
                      }`}
                    style={{
                      background:
                        "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Camera size={20} strokeWidth={2.5} />
                    </motion.div>
                    Capture Photo
                  </motion.button>

                  {/* Info Pills */}
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="px-4 py-2.5 rounded-full text-xs font-semibold text-white flex items-center justify-center gap-2"
                      style={{
                        background: "rgba(16, 185, 129, 0.25)",
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                      }}
                    >
                      <Sparkles size={14} />
                      AI Powered
                    </motion.div>
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="px-4 py-2.5 rounded-full text-xs font-semibold text-white flex items-center justify-center gap-2"
                      style={{
                        background: "rgba(16, 185, 129, 0.25)",
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                      }}
                    >
                      <Camera size={14} />
                      Live Camera
                    </motion.div>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
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