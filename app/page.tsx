"use client";

import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader } from "@/components/AppHeader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import { MapPin, Camera, Trophy, Sparkles, ArrowRight, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { HeritageSite, UserLocation } from "@/app/types/heritage";
import { useAuth } from "@/contexts/AuthContext";

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/app/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
        <p className="text-white text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [nearbySites, setNearbySites] = useState<HeritageSite[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [reportsCount, setReportsCount] = useState(0);
  const { user } = useAuth();

  // Get user location and fetch nearby sites
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setUserLocation(location);
          setIsLoadingLocation(false);

          // Fetch nearby heritage sites
          try {
            const response = await fetch(
              `/api/places/nearby?latitude=${location.latitude}&longitude=${location.longitude}&radius=2000`,
            );
            const data = await response.json();
            setNearbySites(data.sites || []);
          } catch (error) {
            console.error("Error fetching nearby sites:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
        },
      );
    } else {
      setIsLoadingLocation(false);
    }
  }, []);

  // Fetch user's reports count
  useEffect(() => {
    const fetchReportsCount = async () => {
      if (!user?.uid) return;

      try {
        const response = await fetch(`/api/reports/user?userId=${user.uid}`);
        const data = await response.json();
        if (data.success) {
          setReportsCount(data.reports?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching reports count:", error);
      }
    };

    fetchReportsCount();
  }, [user]);

  return (
    <ProtectedRoute>
      <MobileFrame>
        {/* Hero Header with Gradient */}
        <div
          className="relative overflow-hidden"
          style={{ background: 'var(--gradient-hero)' }}
        >
          <AppHeader title="EcoLens" subtitle="Heritage Guardian" icon="🌿" />

          {/* Hero Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="px-6 pb-8 pt-4"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Protect Our Heritage
            </h1>
            <p className="text-white/90 text-sm mb-6">
              Discover, scan, and help preserve cultural sites near you
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center"
              >
                <div className="text-2xl font-bold text-white">{nearbySites.length}</div>
                <div className="text-xs text-white/80 mt-1">Nearby Sites</div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center"
              >
                <div className="text-2xl font-bold text-white">{reportsCount}</div>
                <div className="text-xs text-white/80 mt-1">Your Scans</div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center"
              >
                <div className="text-2xl font-bold text-white">
                  <Trophy size={24} className="mx-auto" />
                </div>
                <div className="text-xs text-white/80 mt-1">Rank</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 48H1440V0C1440 0 1080 48 720 48C360 48 0 0 0 0V48Z" fill="var(--color-eggshell)" />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <main
          className="flex-1 relative overflow-y-auto pb-24 px-4 pt-6"
          style={{ background: 'var(--color-eggshell)' }}
        >
          {/* Quick Actions */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-forest)' }}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Explore Map */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/map')}
                className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all text-left"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)' }}
                >
                  <MapPin size={24} className="text-white" />
                </div>
                <h3 className="font-semibold mb-1" style={{ color: '#047857' }}>
                  Explore Map
                </h3>
                <p className="text-xs text-gray-800">
                  Find heritage sites nearby
                </p>
              </motion.button>

              {/* Scan Site */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/scan')}
                className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all text-left"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: 'var(--gradient-accent)' }}
                >
                  <Camera size={24} className="text-white" />
                </div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--color-terracotta)' }}>
                  Scan Site
                </h3>
                <p className="text-xs text-gray-800">
                  AI-powered analysis
                </p>
              </motion.button>

              {/* View Reports */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/reports')}
                className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all text-left"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)' }}
                >
                  <Shield size={24} className="text-white" />
                </div>
                <h3 className="font-semibold mb-1" style={{ color: '#2563EB' }}>
                  My Reports
                </h3>
                <p className="text-xs text-gray-800">
                  View your contributions
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/leaderboard')}
                className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all text-left"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}
                >
                  <Trophy size={24} className="text-white" />
                </div>
                <h3 className="font-semibold mb-1" style={{ color: '#D4A017' }}>
                  Leaderboard
                </h3>
                <p className="text-xs text-gray-800">
                  Top guardians
                </p>
              </motion.button>
            </div>
          </motion.div>

          {/* Map Preview */}
          {userLocation && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-forest)' }}>
                  Nearby Heritage Sites
                </h2>
                <button
                  onClick={() => router.push('/map')}
                  className="text-sm font-medium flex items-center gap-1 transition-colors"
                  style={{ color: 'var(--color-forest)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-forest-dark)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-forest)'}
                >
                  View All
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="h-64">
                  <MapView
                    userLocation={userLocation}
                    sites={nearbySites.slice(0, 5)}
                    selectedSite={null}
                    onSiteSelect={() => { }}
                  />
                </div>
                <div className="p-4" style={{ background: 'var(--color-eggshell)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-forest)' }}>
                    {nearbySites.length} heritage {nearbySites.length === 1 ? 'site' : 'sites'} within 2km
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-forest-dark)', opacity: 0.7 }}>
                    Tap the map to explore all locations
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Featured Info Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-6"
          >
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={20} className="text-white" />
                  <h3 className="font-bold text-white">How It Works</h3>
                </div>
                <ol className="space-y-2 text-sm text-white/90">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    <span>Find heritage sites on the map</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    <span>Visit and scan with AI camera</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    <span>Help preserve our cultural heritage</span>
                  </li>
                </ol>
              </div>

              {/* Decorative circles */}
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10"></div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10"></div>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoadingLocation && !userLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--color-forest)' }}></div>
              <p className="text-sm" style={{ color: 'var(--color-forest-dark)' }}>
                Getting your location...
              </p>
            </motion.div>
          )}
        </main>

        <BottomNav />
      </MobileFrame>
    </ProtectedRoute>
  );
}
