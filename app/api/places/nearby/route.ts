import { NextRequest, NextResponse } from "next/server";
import { HeritageSite } from "@/app/types/heritage";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");
  const radius = searchParams.get("radius") || "2000"; // Default 2km

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 },
    );
  }

  try {
    // Using Overpass API (OpenStreetMap) - completely free!
    const radiusInMeters = parseInt(radius);
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["tourism"="museum"](around:${radiusInMeters},${latitude},${longitude});
        node["tourism"="attraction"](around:${radiusInMeters},${latitude},${longitude});
        node["historic"](around:${radiusInMeters},${latitude},${longitude});
        node["amenity"="place_of_worship"](around:${radiusInMeters},${latitude},${longitude});
        way["tourism"="museum"](around:${radiusInMeters},${latitude},${longitude});
        way["tourism"="attraction"](around:${radiusInMeters},${latitude},${longitude});
        way["historic"](around:${radiusInMeters},${latitude},${longitude});
        way["amenity"="place_of_worship"](around:${radiusInMeters},${latitude},${longitude});
      );
      out center;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: overpassQuery,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Check if response is ok
    if (!response.ok) {
      console.error(
        "Overpass API error:",
        response.status,
        response.statusText,
      );
      return NextResponse.json({ sites: [] });
    }

    // Check content type to ensure it's JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error(
        "Overpass API returned non-JSON response:",
        text.substring(0, 200),
      );
      return NextResponse.json({ sites: [] });
    }

    const data = await response.json();

    if (!data.elements) {
      return NextResponse.json({ sites: [] });
    }

    // Format the response to match our HeritageSite interface
    const heritageSites: HeritageSite[] = data.elements
      .filter((element: any) => element.tags && element.tags.name)
      .map((element: any) => {
        const lat = element.lat || element.center?.lat;
        const lon = element.lon || element.center?.lon;

        if (!lat || !lon) return null;

        const types: string[] = [];
        if (element.tags.tourism) types.push(element.tags.tourism);
        if (element.tags.historic) types.push(element.tags.historic);
        if (element.tags.amenity) types.push(element.tags.amenity);

        return {
          placeId: `osm-${element.type}-${element.id}`,
          name: element.tags.name,
          address:
            element.tags["addr:full"] ||
            element.tags["addr:street"] ||
            "Address not available",
          latitude: lat,
          longitude: lon,
          types: types,
          rating: undefined,
          photoReference: undefined,
          isVisited: false,
        };
      })
      .filter((site: HeritageSite | null) => site !== null);

    return NextResponse.json({ sites: heritageSites });
  } catch (error) {
    console.error("Error fetching places from Overpass API:", error);
    return NextResponse.json(
      { error: "Failed to fetch nearby places" },
      { status: 500 },
    );
  }
}
