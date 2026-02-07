'use client';

import { HeritageSite } from '../types/heritage';
import { formatDistance } from '../lib/geolocation';

interface NearbySitesListProps {
    sites: HeritageSite[];
    onSiteSelect: (site: HeritageSite) => void;
    onScanSite: (site: HeritageSite) => void;
}

export default function NearbySitesList({
    sites,
    onSiteSelect,
    onScanSite,
}: NearbySitesListProps) {
    if (sites.length === 0) {
        return (
            <div className="bg-white rounded-t-3xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                    Nearby Heritage Sites
                </h3>
                <div className="text-center py-8">
                    <div className="text-4xl mb-2">🏛️</div>
                    <p className="text-zinc-500">No heritage sites found nearby</p>
                    <p className="text-sm text-zinc-400 mt-1">Try moving the map or zooming out</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-t-3xl shadow-lg p-6 max-h-[40vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                Nearby Heritage Sites ({sites.length})
            </h3>
            <div className="space-y-3">
                {sites.map((site) => (
                    <div
                        key={site.placeId}
                        className="border border-zinc-200 rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer"
                        onClick={() => onSiteSelect(site)}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-zinc-900 truncate">
                                    {site.name}
                                </h4>
                                <p className="text-sm text-zinc-500 truncate">{site.address}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    {site.distance !== undefined && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                            📍 {formatDistance(site.distance)}
                                        </span>
                                    )}
                                    {site.rating && (
                                        <span className="text-xs bg-zinc-100 text-zinc-700 px-2 py-1 rounded-full">
                                            ⭐ {site.rating.toFixed(1)}
                                        </span>
                                    )}
                                    {site.isVisited && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                            ✓ Visited
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onScanSite(site);
                                }}
                                className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
                            >
                                Scan Site
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
