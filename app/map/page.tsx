"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import LocationPermission from "../components/LocationPermission";
import NearbySitesList from "../components/NearbySitesList";
import { HeritageSite, UserLocation } from "../types/heritage";
import { calculateDistance } from "../lib/geolocation";

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("../components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[60vh] bg-zinc-100 flex items-center justify-center">
      <p className="text-zinc-600">Loading map...</p>
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
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">Heritage Map</h1>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-zinc-600 hover:text-zinc-900"
        >
          ← Home
        </button>
      </header>

      {/* Map */}
      <div className="flex-1 flex flex-col">
        <MapView
          userLocation={userLocation}
          sites={sites}
          selectedSite={selectedSite}
          onSiteSelect={handleSiteSelect}
          onMapBoundsChange={handleMapBoundsChange}
        />

        {/* Loading indicator */}
        {loading && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg">
            <p className="text-sm text-zinc-600">Loading sites...</p>
          </div>
        )}

        {/* Nearby Sites List */}
        <NearbySitesList
          sites={sites}
          onSiteSelect={handleSiteSelect}
          onScanSite={handleScanSite}
        />
      </div>
    </div>
  );
}
