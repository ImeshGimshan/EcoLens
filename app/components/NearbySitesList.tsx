'use client';

import { HeritageSite } from '../types/heritage';
import { formatDistance } from '../lib/geolocation';
import { motion } from 'framer-motion';
import { MapPin, Camera } from 'lucide-react';

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
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-t-3xl shadow-lg p-6"
            >
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-forest)' }}>
                    Nearby Heritage Sites
                </h3>
                <div className="text-center py-12">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-5xl mb-4"
                    >
                        🏛️
                    </motion.div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-forest)' }}>
                        No heritage sites found nearby
                    </p>
                    <p className="text-xs mt-2" style={{ color: 'var(--color-forest-dark)', opacity: 0.6 }}>
                        Try moving the map or zooming out
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-t-3xl shadow-lg overflow-hidden"
        >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-forest)' }}>
                    Nearby Heritage Sites
                </h3>
                <p className="text-xs mt-1" style={{ color: 'var(--color-forest-dark)', opacity: 0.6 }}>
                    {sites.length} {sites.length === 1 ? 'site' : 'sites'} within 2km
                </p>
            </div>

            {/* Sites List */}
            <div className="overflow-y-auto max-h-96 px-4 py-3 space-y-2">
                {sites.map((site, index) => (
                    <motion.div
                        key={site.placeId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        {/* Card */}
                        <motion.div
                            whileHover={{ y: -1 }}
                            className="p-3 rounded-lg transition-colors border border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100"
                            onClick={() => onSiteSelect(site)}
                        >
                            <div className="flex items-start justify-between gap-3">
                                {/* Site Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate" style={{ color: 'var(--color-forest)' }}>
                                        {site.name}
                                    </h4>
                                    <div className="flex items-center gap-1 text-xs mt-1" style={{ color: 'var(--color-forest-dark)', opacity: 0.7 }}>
                                        <MapPin size={12} />
                                        <p className="truncate">{site.address}</p>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                        {site.distance !== undefined && (
                                            <span
                                                className="text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap text-white"
                                                style={{
                                                    background: 'var(--color-forest)',
                                                }}
                                            >
                                                📍 {formatDistance(site.distance)}
                                            </span>
                                        )}
                                        {site.rating && (
                                            <span
                                                className="text-xs px-2.5 py-1 rounded-full font-medium"
                                                style={{
                                                    background: 'var(--color-eggshell-dark)',
                                                    color: 'var(--color-forest-dark)',
                                                }}
                                            >
                                                ⭐ {site.rating.toFixed(1)}
                                            </span>
                                        )}
                                        {site.isVisited && (
                                            <span
                                                className="text-xs px-2.5 py-1 rounded-full font-medium text-white"
                                                style={{
                                                    background: 'var(--color-terracotta)',
                                                }}
                                            >
                                                ✓ Visited
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Scan Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onScanSite(site);
                                    }}
                                    className="shrink-0 p-2 rounded-lg transition-colors text-white font-medium flex items-center justify-center"
                                    style={{
                                        background: 'var(--color-forest)',
                                    }}
                                >
                                    <Camera size={16} />
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            {/* Footer Info */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs" style={{ color: 'var(--color-forest-dark)', opacity: 0.6 }}>
                    Tap a site to highlight it, or scan to contribute data
                </p>
            </div>
        </motion.div>
    );
}