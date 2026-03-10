import React, { useEffect, useMemo, useState } from "react";
import LocationFilterPopup from "./LocationFilterPopup";

const API = "http://localhost:5000";

const LocationFilter = ({ filters, setFilters }) => {
  const [locations, setLocations] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const selectedLocations = Array.isArray(filters?.location)
    ? filters.location
    : [];

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/api/jobs/location-count`);
        if (!res.ok) {
          throw new Error("Failed to fetch location counts");
        }

        const data = await res.json();

        // only posted-job locations
        const validLocations = Array.isArray(data)
          ? data.filter((item) => item?.name && Number(item.count) > 0)
          : [];

        setLocations(validLocations);
      } catch (error) {
        console.error("Location fetch error:", error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const topLocations = useMemo(() => locations.slice(0, 4), [locations]);
  const remainingLocations = useMemo(() => locations.slice(4), [locations]);

  const toggleLocation = (locationName) => {
    setFilters((prev) => {
      const prevLocations = Array.isArray(prev.location) ? prev.location : [];

      const updated = prevLocations.includes(locationName)
        ? prevLocations.filter((loc) => loc !== locationName)
        : [...prevLocations, locationName];

      return {
        ...prev,
        location: updated,
      };
    });
  };

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Location</h3>

        {selectedLocations.length > 0 && (
          <span className="rounded-full bg-cyan-600 px-2 py-1 text-xs text-white">
            {selectedLocations.length}
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : topLocations.length === 0 ? (
        <p className="text-sm text-slate-500">No locations found</p>
      ) : (
        <div className="space-y-2">
          {topLocations.map((loc) => (
            <label
              key={loc.name}
              className="flex cursor-pointer items-center justify-between text-sm text-slate-300"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(loc.name)}
                  onChange={() => toggleLocation(loc.name)}
                  className="accent-cyan-500"
                />
                <span>{loc.name}</span>
              </div>

              <span className="text-xs text-slate-400">({loc.count || 0})</span>
            </label>
          ))}
        </div>
      )}

      {remainingLocations.length > 0 && (
        <button
          type="button"
          onClick={() => setShowPopup(true)}
          className="mt-3 text-sm font-medium text-cyan-400 hover:text-cyan-300"
        >
          View More
        </button>
      )}

      {showPopup && (
        <LocationFilterPopup
          locations={remainingLocations}
          selected={selectedLocations}
          setSelected={(updated) =>
            setFilters((prev) => ({
              ...prev,
              location: updated,
            }))
          }
          closePopup={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default LocationFilter;