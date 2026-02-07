"use client";

import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader } from "@/components/AppHeader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import { MapPin, Shield, Sparkles, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { HeritageSite, UserLocation } from "@/app/types/heritage";
import { useAuth } from "@/contexts/AuthContext";

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/app/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <p className="text-gray-600">Loading map...</p>
    </div>
  ),
});

export default function Home() {
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

  const features = [
    {
      icon: Shield,
      label: "Nearby Sites",
      value: nearbySites.length.toString(),
      color: "from-green-400 to-emerald-600",
    },
    {
      icon: Sparkles,
      label: "AI Scans",
      value: reportsCount.toString(),
      color: "from-orange-400 to-red-500",
    },
    {
      icon: TrendingUp,
      label: "This Week",
      value: "-",
      color: "from-purple-400 to-pink-500",
    },
  ];

  return (
    <ProtectedRoute>
      <MobileFrame>
        <AppHeader title="EcoLens" subtitle="Heritage Guardian" icon="🌿" />

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto pb-24 px-4 pt-4">
          {/* Stats Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={feature.label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-2 mx-auto`}
                >
                  <feature.icon
                    size={20}
                    className="text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <p className="text-2xl font-bold text-gray-800 text-center">
                  {feature.value}
                </p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {feature.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Map Preview Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden mb-4"
          >
            <div className="relative h-64">
              {isLoadingLocation ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-3"
                    />
                    <p className="text-gray-600 text-sm">
                      Getting your location...
                    </p>
                  </div>
                </div>
              ) : userLocation ? (
                <MapView
                  userLocation={userLocation}
                  sites={nearbySites}
                  selectedSite={null}
                  onSiteSelect={() => {}}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                  <div className="text-center p-6">
                    <MapPin size={48} className="text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      Location Required
                    </h3>
                    <p className="text-sm text-gray-600">
                      Enable location to see nearby heritage sites
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Nearby Heritage Sites
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {nearbySites.length} sites within 2km
                  </p>
                </div>
                <a
                  href="/map"
                  className="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  View All →
                </a>
              </div>
            </div>
          </motion.div>

          {/* Nearby Sites List */}
          {nearbySites.length > 0 && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden mb-4"
            >
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">
                  Nearby Heritage Sites
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Quick access to scan nearby locations
                </p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {nearbySites.slice(0, 5).map((site, idx) => (
                  <motion.div
                    key={site.placeId}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + idx * 0.1, duration: 0.3 }}
                    className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shrink-0">
                        <MapPin size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm truncate">
                          {site.name}
                        </h4>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {site.address}
                        </p>
                        {site.distance !== undefined && (
                          <p className="text-xs text-green-600 mt-1">
                            📍 {(site.distance / 1000).toFixed(1)} km away
                          </p>
                        )}
                      </div>
                      <a
                        href={`/scan?lat=${site.latitude}&lng=${site.longitude}&name=${encodeURIComponent(site.name)}&address=${encodeURIComponent(site.address)}`}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-full hover:bg-green-700 transition-colors whitespace-nowrap"
                      >
                        Scan Site
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
              {nearbySites.length > 5 && (
                <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                  <a
                    href="/map"
                    className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                  >
                    View all {nearbySites.length} sites →
                  </a>
                </div>
              )}
            </motion.div>
          )}

          {/* Quick Action Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 shadow-xl text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Start Scanning</h3>
                <p className="text-sm opacity-90">Protect heritage with AI</p>
              </div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center cursor-pointer"
              >
                <Sparkles size={28} className="text-white" strokeWidth={2.5} />
              </motion.div>
            </div>
          </motion.div>
        </main>

        <BottomNav />
      </MobileFrame>
    </ProtectedRoute>
  );
}
