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
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-forest)' }}>
                    Nearby Heritage Sites
                </h3>
                <div className="text-center py-8">
                    <div className="text-4xl mb-2">🏛️</div>
                    <p style={{ color: 'var(--color-forest-dark)' }}>No heritage sites found nearby</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-forest)', opacity: 0.6 }}>Try moving the map or zooming out</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-t-3xl shadow-lg p-6 max-h-[40vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-forest)' }}>
                Nearby Heritage Sites ({sites.length})
            </h3>
            <div className="space-y-3">
                {sites.map((site) => (
                    <div
                        key={site.placeId}
                        className="border rounded-lg p-4 transition-colors cursor-pointer"
                        style={{ borderColor: 'var(--color-eggshell-dark)' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-forest)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-eggshell-dark)'}
                        onClick={() => onSiteSelect(site)}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold truncate" style={{ color: 'var(--color-forest)' }}>
                                    {site.name}
                                </h4>
                                <p className="text-sm truncate" style={{ color: 'var(--color-forest-dark)', opacity: 0.7 }}>{site.address}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    {site.distance !== undefined && (
                                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--color-forest-light)', color: 'white', opacity: 0.9 }}>
                                            📍 {formatDistance(site.distance)}
                                        </span>
                                    )}
                                    {site.rating && (
                                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--color-eggshell-dark)', color: 'var(--color-forest-dark)' }}>
                                            ⭐ {site.rating.toFixed(1)}
                                        </span>
                                    )}
                                    {site.isVisited && (
                                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--color-terracotta-light)', color: 'white' }}>
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
                                className="text-white px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
                                style={{ background: 'var(--color-forest)' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-forest-dark)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-forest)'}
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
