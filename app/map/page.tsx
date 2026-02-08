"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, ArrowLeft } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import LocationPermission from "../components/LocationPermission";
import NearbySitesList from "../components/NearbySitesList";
import { HeritageSite, UserLocation } from "../types/heritage";
import { calculateDistance } from "../lib/geolocation";

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("../components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 mx-auto mb-2" style={{ borderColor: 'var(--color-forest)', borderTopColor: 'transparent' }}></div>
        <p className="text-sm mt-2" style={{ color: 'var(--color-forest-dark)' }}>Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  const fetchNearbySites = useCallback(
    async (latitude: number, longitude: number) => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/places/nearby?latitude=${latitude}&longitude=${longitude}&radius=2000`,
        );
        const data = await response.json();

        if (data.sites) {
          // Calculate distances and sort by distance
          const sitesWithDistance = data.sites.map((site: HeritageSite) => ({
            ...site,
            distance: calculateDistance(
              latitude,
              longitude,
              site.latitude,
              site.longitude,
            ),
          }));

          sitesWithDistance.sort(
            (a: HeritageSite, b: HeritageSite) =>
              (a.distance || 0) - (b.distance || 0),
          );
          setSites(sitesWithDistance);
        }
      } catch (error) {
        console.error("Error fetching nearby sites:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleLocationGranted = (location: {
    latitude: number;
    longitude: number;
  }) => {
    const userLoc: UserLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: 0,
    };
    setUserLocation(userLoc);
    fetchNearbySites(location.latitude, location.longitude);
  };

  const handleLocationDenied = () => {
    setLocationDenied(true);
  };

  const handleSiteSelect = (site: HeritageSite | null) => {
    setSelectedSite(site);
  };

  const handleScanSite = (site: HeritageSite) => {
    // Navigate to scan page with site location info
    const params = new URLSearchParams({
      lat: site.latitude.toString(),
      lng: site.longitude.toString(),
      name: site.name,
      address: site.address,
    });
    router.push(`/scan?${params.toString()}`);
  };

  const handleMapBoundsChange = (center: { lat: number; lng: number }) => {
    // Optionally refetch sites when map moves significantly
    // For now, we'll keep the initial sites
  };

  if (locationDenied) {
    return (
      <LocationPermission
        onLocationGranted={handleLocationGranted}
        onLocationDenied={handleLocationDenied}
      />
    );
  }

  if (!userLocation) {
    return (
      <LocationPermission
        onLocationGranted={handleLocationGranted}
        onLocationDenied={handleLocationDenied}
      />
    );
  }

  return (
    <MobileFrame>
      {/* Header with Green Background */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-6 py-4 text-white flex items-center justify-between"
        style={{ background: 'var(--gradient-primary)' }}
      >
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-white">Explore Map</h1>
          <p className="text-xs mt-1 text-white/90">
            {sites.length} heritage {sites.length === 1 ? 'site' : 'sites'} nearby
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/")}
          className="p-2 rounded-lg transition-all"
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <ArrowLeft size={20} className="text-white" />
        </motion.button>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative pb-20" style={{ background: 'var(--color-eggshell)' }}>
        {/* Map Container - Increased Height */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[420px] relative overflow-hidden shrink-0"
        >
          <MapView
            userLocation={userLocation}
            sites={sites}
            selectedSite={selectedSite}
            onSiteSelect={handleSiteSelect}
            onMapBoundsChange={handleMapBoundsChange}
          />

          {/* Loading indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10"
            >
              <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-2" style={{ borderColor: 'var(--color-forest)', borderTopColor: 'transparent' }}></div>
                <p className="text-xs font-medium" style={{ color: 'var(--color-forest)' }}>
                  Loading sites...
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Nearby Sites List - Scrollable */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-20 flex-1 overflow-y-auto"
        >
          <NearbySitesList
            sites={sites}
            onSiteSelect={handleSiteSelect}
            onScanSite={handleScanSite}
          />
        </motion.div>
      </div>

      <BottomNav />
    </MobileFrame>
  );
}