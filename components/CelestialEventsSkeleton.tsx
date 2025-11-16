import React from 'react';

const SkeletonCard: React.FC = () => (
    <div className="bg-gray-800/50 p-4 rounded-lg">
        <div className="h-5 w-3/4 bg-gray-700 rounded-md mb-3"></div>
        <div className="h-4 w-1/2 bg-gray-700 rounded-md mb-3"></div>
        <div className="h-4 w-full bg-gray-700 rounded-md"></div>
        <div className="h-4 w-5/6 bg-gray-700 rounded-md mt-1"></div>
    </div>
);

const CelestialEventsSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse">
            <ul className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </ul>
        </div>
    );
};

export default CelestialEventsSkeleton;
