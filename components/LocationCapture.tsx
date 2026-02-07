import { useState, useEffect } from "react";
import { MapPin, Loader2, AlertCircle } from "lucide-react";

interface LocationCaptureProps {
  onLocationCaptured: (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
  onError?: (error: string) => void;
  autoCapture?: boolean;
}

export function LocationCapture({
  onLocationCaptured,
  onError,
  autoCapture = false,
}: LocationCaptureProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationCaptured, setLocationCaptured] = useState(false);

  const captureLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current position
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        },
      );

      const { latitude, longitude } = position.coords;

      // Try to get address using reverse geocoding (OpenStreetMap Nominatim)
      let address: string | undefined;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              "User-Agent": "EcoLens Heritage App",
            },
          },
        );
        const data = await response.json();
        if (data.display_name) {
          address = data.display_name;
        }
      } catch (geocodeError) {
        console.warn("Reverse geocoding failed:", geocodeError);
        // Continue without address - it's optional
      }

      const locationData = { latitude, longitude, address };
      onLocationCaptured(locationData);
      setLocationCaptured(true);
    } catch (err: any) {
      const errorMessage =
        err.code === 1
          ? "Location permission denied"
          : err.code === 2
            ? "Location unavailable"
            : err.code === 3
              ? "Location request timed out"
              : "Failed to get location";

      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoCapture && !locationCaptured && !isLoading) {
      captureLocation();
    }
  }, [autoCapture]);

  if (autoCapture) {
    // Auto-capture mode - show minimal UI
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 size={14} className="animate-spin" />
          <span>Getting location...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center gap-2 text-xs text-amber-600">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      );
    }

    if (locationCaptured) {
      return (
        <div className="flex items-center gap-2 text-xs text-green-600">
          <MapPin size={14} />
          <span>Location captured</span>
        </div>
      );
    }

    return null;
  }

  // Manual capture mode - show button
  return (
    <button
      onClick={captureLocation}
      disabled={isLoading || locationCaptured}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Getting location...</span>
        </>
      ) : locationCaptured ? (
        <>
          <MapPin size={16} />
          <span>Location captured</span>
        </>
      ) : (
        <>
          <MapPin size={16} />
          <span>Capture Location</span>
        </>
      )}
    </button>
  );
}
