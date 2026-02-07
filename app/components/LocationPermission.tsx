'use client';

import { useState, useEffect } from 'react';

interface LocationPermissionProps {
    onLocationGranted: (location: { latitude: number; longitude: number }) => void;
    onLocationDenied: () => void;
}

export default function LocationPermission({
    onLocationGranted,
    onLocationDenied,
}: LocationPermissionProps) {
    const [permissionState, setPermissionState] = useState<
        'prompt' | 'granted' | 'denied' | 'loading'
    >('loading');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        checkPermission();
    }, []);

    const checkPermission = async () => {
        if (!navigator.geolocation) {
            setPermissionState('denied');
            setError('Geolocation is not supported by your browser');
            onLocationDenied();
            return;
        }

        try {
            const result = await navigator.permissions.query({ name: 'geolocation' });
            setPermissionState(result.state as 'prompt' | 'granted' | 'denied');

            if (result.state === 'granted') {
                getCurrentLocation();
            } else if (result.state === 'denied') {
                onLocationDenied();
            }
        } catch (err) {
            // Fallback if permissions API is not supported
            setPermissionState('prompt');
        }
    };

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setPermissionState('granted');
                onLocationGranted({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                setPermissionState('denied');
                setError(error.message);
                onLocationDenied();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    const requestPermission = () => {
        setPermissionState('loading');
        getCurrentLocation();
    };

    if (permissionState === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--color-eggshell)' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--color-forest)' }}></div>
                    <p style={{ color: 'var(--color-forest-dark)' }}>Getting your location...</p>
                </div>
            </div>
        );
    }

    if (permissionState === 'denied') {
        return (
            <div className="flex items-center justify-center min-h-screen p-4" style={{ background: 'var(--color-eggshell)' }}>
                <div className="max-w-md text-center">
                    <div className="text-6xl mb-4">📍</div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-forest)' }}>
                        Location Access Required
                    </h2>
                    <p className="mb-6" style={{ color: 'var(--color-forest-dark)' }}>
                        {error ||
                            'EcoLens needs access to your location to show nearby heritage sites.'}
                    </p>
                    <div className="rounded-lg p-4 text-sm text-left mb-6" style={{ background: 'var(--color-eggshell-dark)' }}>
                        <p className="font-semibold mb-2" style={{ color: 'var(--color-forest)' }}>To enable location:</p>
                        <ol className="list-decimal list-inside space-y-1" style={{ color: 'var(--color-forest-dark)' }}>
                            <li>Click the lock icon in your browser&apos;s address bar</li>
                            <li>Find &quot;Location&quot; permissions</li>
                            <li>Select &quot;Allow&quot;</li>
                            <li>Refresh this page</li>
                        </ol>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-white px-6 py-3 rounded-full font-medium transition-colors"
                        style={{ background: 'var(--color-forest)' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-forest-dark)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-forest)'}
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    if (permissionState === 'prompt') {
        return (
            <div className="flex items-center justify-center min-h-screen p-4" style={{ background: 'var(--color-eggshell)' }}>
                <div className="max-w-md text-center">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-forest)' }}>
                        Discover Heritage Sites
                    </h2>
                    <p className="mb-6" style={{ color: 'var(--color-forest-dark)' }}>
                        Allow location access to find cultural and heritage sites near you.
                    </p>
                    <button
                        onClick={requestPermission}
                        className="text-white px-8 py-3 rounded-full font-medium transition-colors"
                        style={{ background: 'var(--color-forest)' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-forest-dark)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-forest)'}
                    >
                        Enable Location
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
