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
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnalysisResultOverlay } from "@/components/AnalysisResultOverlay";
import { AnalysisResult } from "@/lib/ai/types";
import { useAuth } from "@/contexts/AuthContext";
import { useState as useStateForAchievements } from "react";
import { Achievement } from "@/lib/achievements/types";
import { AchievementUnlockModal } from "@/components/AchievementUnlockModal";

function ScanContent() {
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
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [achievementPoints, setAchievementPoints] = useState(0);
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

        // Handle achievement unlocking
        if (user) {
          try {
            const { handleScanCompleted } = await import('@/lib/achievements/service');
            const result = await handleScanCompleted(user.uid, location?.name || 'unknown');

            // Show achievement modals if any were unlocked
            if (result.newAchievements.length > 0) {
              setUnlockedAchievements(result.newAchievements);
              setCurrentAchievement(result.newAchievements[0]);
              setAchievementPoints(result.newAchievements[0].points);
              setShowAchievementModal(true);
            }

            console.log(`Earned ${result.points} points (including ${result.streakBonus} streak bonus)`);
          } catch (achievementError) {
            console.error('Error processing achievements:', achievementError);
          }
        }
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
      {/* Header with Green Background like Home */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-6 py-6 text-white"
        style={{ background: 'var(--gradient-primary)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
          >
            <img src="/logo.svg" alt="EcoLens Logo" className="w-8 h-8" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Scan Heritage
            </h1>
            <p className="text-sm text-white/90 mt-0.5">
              AI-powered conservation analysis
            </p>
          </div>
        </div>

        {/* <div> */}

        <div>
          {/* Status Indicator */}
          {isCameraReady && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-white shadow-lg"
              ></motion.div>
              <span className="text-white">Camera Ready</span>
            </motion.div>
          )}

          {/* Heritage Site Info Banner */}
          <AnimatePresence>
            {location?.name && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 p-3 rounded-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="flex items-start gap-2">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-white"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {location.name}
                    </p>
                    {location.address && (
                      <p
                        className="text-xs mt-1 truncate text-white/80"
                      >
                        {location.address}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto pb-24 px-4 py-4" style={{ background: 'var(--color-eggshell)' }}>

        {/* Error Toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 bg-red-500/90"
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

        {/* Camera Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-md mb-4"
        >
          <div className="relative w-full aspect-square bg-gray-900 overflow-hidden">
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
                    background: "rgba(15, 23, 42, 0.8)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{
                      background: "rgba(126, 217, 87, 0.1)",
                      border: "2px solid rgba(126, 217, 87, 0.3)",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={36} style={{ color: 'var(--color-forest)' }} />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <p className="text-white font-semibold text-sm mb-1">
                      Analyzing...
                    </p>
                    <p className="text-white/60 text-xs">
                      Processing heritage data
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Crosshair Scanner Frame */}
            {!capturedPhoto && isCameraReady && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute inset-0 pointer-events-none p-8 flex items-center justify-center"
              >
                <div className="relative w-full h-full max-w-xs max-h-96">
                  {/* Corner Brackets */}
                  <div
                    className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 rounded-tl-lg"
                    style={{ borderColor: 'var(--color-forest)' }}
                  ></div>
                  <div
                    className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 rounded-tr-lg"
                    style={{ borderColor: 'var(--color-forest)' }}
                  ></div>
                  <div
                    className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 rounded-bl-lg"
                    style={{ borderColor: 'var(--color-forest)' }}
                  ></div>
                  <div
                    className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 rounded-br-lg"
                    style={{ borderColor: 'var(--color-forest)' }}
                  ></div>

                  {/* Center Crosshair */}
                  <motion.div
                    animate={{ scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-px h-6" style={{ background: 'var(--color-forest)', opacity: 0.6 }}></div>
                    <div className="absolute w-6 h-px" style={{ background: 'var(--color-forest)', opacity: 0.6 }}></div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Controls Section */}
        {!showResult && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 mt-2"
          >
            {capturedPhoto ? (
              // Captured State - Retake & Analyze
              <>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={retakePhoto}
                    disabled={isAnalyzing}
                    className="flex-1 px-5 py-3.5 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 border-2 border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
                    style={{ color: 'var(--color-forest)' }}
                  >
                    <RotateCcw size={18} strokeWidth={2.5} />
                    Retake
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={analyzePhoto}
                    disabled={isAnalyzing}
                    className="flex-1 px-5 py-3.5 font-semibold rounded-xl text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    {isAnalyzing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles size={18} strokeWidth={2.5} />
                      </motion.div>
                    ) : (
                      <>
                        <Zap size={18} strokeWidth={2.5} />
                        Analyze
                      </>
                    )}
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center text-xs text-gray-500 pt-1"
                >
                  Photo ready for analysis
                </motion.div>
              </>
            ) : (
              // Ready State - Capture
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={capturePhoto}
                  disabled={!isCameraReady}
                  className={`w-full px-8 py-4 text-white font-bold rounded-lg flex items-center justify-center gap-3 transition-all ${!isCameraReady
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-lg"
                    }`}
                  style={{
                    background: "var(--gradient-primary)",
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Camera size={20} strokeWidth={2} />
                  </motion.div>
                  Capture Photo
                </motion.button>

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="px-4 py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border"
                    style={{
                      color: 'var(--color-forest)',
                      background: 'var(--color-eggshell)',
                      borderColor: 'rgba(126, 217, 87, 0.2)',
                    }}
                  >
                    <Sparkles size={14} />
                    AI Powered
                  </motion.div>
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="px-4 py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border"
                    style={{
                      color: 'var(--color-forest)',
                      background: 'var(--color-eggshell)',
                      borderColor: 'rgba(126, 217, 87, 0.2)',
                    }}
                  >
                    <Camera size={14} />
                    Live Camera
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        )}
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

      {/* Achievement Unlock Modal */}
      <AnimatePresence>
        {showAchievementModal && currentAchievement && (
          <AchievementUnlockModal
            achievement={currentAchievement}
            points={achievementPoints}
            onClose={() => {
              setShowAchievementModal(false);

              // Show next achievement if there are more
              const currentIndex = unlockedAchievements.findIndex(
                a => a.id === currentAchievement.id
              );
              if (currentIndex < unlockedAchievements.length - 1) {
                const nextAchievement = unlockedAchievements[currentIndex + 1];
                setCurrentAchievement(nextAchievement);
                setAchievementPoints(nextAchievement.points);
                setTimeout(() => setShowAchievementModal(true), 300);
              } else {
                setCurrentAchievement(null);
                setUnlockedAchievements([]);
              }
            }}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </MobileFrame>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={
      <MobileFrame>
        <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--color-eggshell)' }}>
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 mx-auto mb-4"
            >
              <Sparkles size={48} style={{ color: 'var(--color-forest)' }} />
            </motion.div>
            <p className="text-gray-600">Loading scanner...</p>
          </div>
        </div>
        <BottomNav />
      </MobileFrame>
    }>
      <ScanContent />
    </Suspense>
  );
}