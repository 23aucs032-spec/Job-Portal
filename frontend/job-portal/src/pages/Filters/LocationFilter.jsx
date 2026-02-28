import React, { useState, useEffect } from "react";
import LocationFilterPopup from "./LocationFilterPopup";
import fallbackLocations from "./components/locationData";

const LocationFilter = ({ filters, setFilters }) => {
  const [locations, setLocations] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  /* ================= FETCH LOCATION COUNT ================= */
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/jobs/location-count"
        );

        if (!res.ok) throw new Error("Failed to fetch location counts");

        const data = await res.json();

        // Ensure we have an array
        const backendLocations = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        // Merge with fallback locations
        const merged = fallbackLocations.map((loc) => {
          const found = backendLocations.find(
            (d) =>
              typeof d.location === "string" &&
              d.location.trim().toLowerCase() === loc.name?.trim().toLowerCase()
          );

          return {
            name: loc.name || "Unknown",
            count: typeof found?.count === "number" ? found.count : 0,
          };
        });

        setLocations(merged);
      } catch (err) {
        console.error("Location fetch error:", err);

        // Fallback: all zero counts
        setLocations(
          fallbackLocations.map((loc) => ({
            name: loc.name || "Unknown",
            count: 0,
          }))
        );
      }
    };

    fetchLocations();
  }, []);

  /* ================= TOGGLE LOCATION ================= */
  const toggleLocation = (name) => {
    if (!name) return;
    const updated = filters.location.includes(name)
      ? filters.location.filter((loc) => loc !== name)
      : [...filters.location, name];

    setFilters({
      ...filters,
      location: updated,
    });
  };

  const topLocations = locations.slice(0, 4);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-white">Location</h3>

        {filters.location?.length > 0 && (
          <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">
            {filters.location.length}
          </span>
        )}
      </div>

      {topLocations.map((loc) => (
        <label
          key={loc.name}
          className="flex justify-between items-center text-sm text-gray-300 mb-2 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.location.includes(loc.name)}
              onChange={() => toggleLocation(loc.name)}
              className="accent-blue-500"
            />
            {loc.name || "Unknown"}
          </div>

          <span className="text-xs text-gray-400">({loc.count || 0})</span>
        </label>
      ))}

      <button
        onClick={() => setShowPopup(true)}
        className="text-blue-400 text-sm mt-2 hover:underline"
      >
        View All Locations
      </button>

      {showPopup && (
        <LocationFilterPopup
          locations={locations}
          selected={filters.location}
          setSelected={(updated) =>
            setFilters({
              ...filters,
              location: updated,
            })
          }
          closePopup={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default LocationFilter;