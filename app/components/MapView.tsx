"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { HeritageSite, UserLocation } from "../types/heritage";

interface MapViewProps {
  userLocation: UserLocation;
  sites: HeritageSite[];
  selectedSite: HeritageSite | null;
  onSiteSelect: (site: HeritageSite | null) => void;
  onMapBoundsChange?: (center: { lat: number; lng: number }) => void;
}

// Fix for default marker icons in Leaflet
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = L.divIcon({
  className: "custom-user-marker",
  html: '<div style="width: 16px; height: 16px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const selectedIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

function MapController({
  selectedSite,
}: {
  selectedSite: HeritageSite | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedSite) {
      map.flyTo([selectedSite.latitude, selectedSite.longitude], 16, {
        duration: 1,
      });
    }
  }, [selectedSite, map]);

  return null;
}

export default function MapView({
  userLocation,
  sites,
  selectedSite,
  onSiteSelect,
}: MapViewProps) {
  const center: [number, number] = [
    userLocation.latitude,
    userLocation.longitude,
  ];

  return (
    <div className="w-full h-[60vh] relative">
      <MapContainer
        center={center}
        zoom={14}
        className="w-full h-full rounded-lg"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedSite={selectedSite} />

        {/* User location marker */}
        <Marker position={center} icon={userIcon}>
          <Popup>Your Location</Popup>
        </Marker>

        {/* Heritage site markers */}
        {sites.map((site) => (
          <Marker
            key={site.placeId}
            position={[site.latitude, site.longitude]}
            icon={
              selectedSite?.placeId === site.placeId
                ? selectedIcon
                : defaultIcon
            }
            eventHandlers={{
              click: () => onSiteSelect(site),
            }}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-semibold">{site.name}</h3>
                <p className="text-zinc-600 text-xs">{site.address}</p>
                {site.rating && (
                  <p className="text-xs mt-1">⭐ {site.rating.toFixed(1)}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map controls overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 z-1000">
        <p className="text-sm font-medium text-zinc-900">
          {sites.length} heritage {sites.length === 1 ? "site" : "sites"} nearby
        </p>
      </div>
    </div>
  );
}
