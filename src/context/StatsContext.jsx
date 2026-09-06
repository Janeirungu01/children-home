import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { fetchPageSection, updatePageSection, createPageSection } from "../api/pageApi";

const StatsContext = createContext(null);

// Foundation start year - used to auto-calculate years of impact
const FOUNDATION_START_YEAR = 2022;

// Calculate years of impact dynamically
function calculateYearsOfImpact() {
  const currentYear = new Date().getFullYear();
  const years = currentYear - FOUNDATION_START_YEAR;
  return `${years}+`;
}

export function StatsProvider({ children }) {
  const [stats, setStats] = useState({
    id: null,
    // Hero Stats
    statChildrenSupported: "150+",
    statChildrenLabel: "Children Supported",
    statSchoolEnrollment: "95%",
    statSchoolLabel: "School Enrollment",
    statDonors: "500+",
    statDonorsLabel: "Donors Worldwide",
    // Auto-calculated - not editable
    statYearsOfImpact: calculateYearsOfImpact(),
    statYearsLabel: "Years of Impact",
    // Our Story Stats
    statChildrenHelped: "150+",
    statChildrenHelpedLabel: "Children Helped",
    statActiveMembers: "50+",
    statActiveMembersLabel: "Active Members",
    statPrograms: "10+",
    statProgramsLabel: "Programs",
    // Foundation info
    foundationStartYear: FOUNDATION_START_YEAR,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats on mount
  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchPageSection("STATS");
        const item = res?.result?.[0];
        if (item) {
          setStats((prev) => ({
            ...prev,
            id: item.id,
            statChildrenSupported: item.statChildrenSupported || prev.statChildrenSupported,
            statChildrenLabel: item.statChildrenLabel || prev.statChildrenLabel,
            statSchoolEnrollment: item.statSchoolEnrollment || prev.statSchoolEnrollment,
            statSchoolLabel: item.statSchoolLabel || prev.statSchoolLabel,
            statDonors: item.statDonors || prev.statDonors,
            statDonorsLabel: item.statDonorsLabel || prev.statDonorsLabel,
            // Years is auto-calculated, ignore stored value
            statYearsOfImpact: calculateYearsOfImpact(),
            statYearsLabel: item.statYearsLabel || prev.statYearsLabel,
            statChildrenHelped: item.statChildrenHelped || prev.statChildrenHelped,
            statChildrenHelpedLabel: item.statChildrenHelpedLabel || prev.statChildrenHelpedLabel,
            statActiveMembers: item.statActiveMembers || prev.statActiveMembers,
            statActiveMembersLabel: item.statActiveMembersLabel || prev.statActiveMembersLabel,
            statPrograms: item.statPrograms || prev.statPrograms,
            statProgramsLabel: item.statProgramsLabel || prev.statProgramsLabel,
            foundationStartYear: item.foundationStartYear || prev.foundationStartYear,
          }));
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  // Save stats to backend
  const saveStats = async (newStats) => {
    try {
      const dataToSave = { ...stats, ...newStats };
      if (stats.id) {
        await updatePageSection("STATS", { id: stats.id, ...dataToSave });
      } else {
        await createPageSection("STATS", dataToSave);
      }
      setStats((prev) => ({ ...prev, ...newStats }));
      return true;
    } catch (err) {
      console.error("Failed to save stats:", err);
      setError(err);
      return false;
    }
  };

  // Memoized hero stats array
  const heroStats = useMemo(
    () => [
      { key: "children", value: stats.statChildrenSupported, label: stats.statChildrenLabel },
      { key: "school", value: stats.statSchoolEnrollment, label: stats.statSchoolLabel },
      { key: "donors", value: stats.statDonors, label: stats.statDonorsLabel },
      { key: "years", value: stats.statYearsOfImpact, label: stats.statYearsLabel },
    ],
    [stats]
  );

  // Memoized story stats array
  const storyStats = useMemo(
    () => [
      { key: "helped", value: stats.statChildrenHelped, label: stats.statChildrenHelpedLabel },
      { key: "members", value: stats.statActiveMembers, label: stats.statActiveMembersLabel },
      { key: "programs", value: stats.statPrograms, label: stats.statProgramsLabel },
    ],
    [stats]
  );

  // Years of impact for standalone display
  const yearsOfImpact = useMemo(
    () => ({
      value: stats.statYearsOfImpact,
      label: stats.statYearsLabel,
    }),
    [stats]
  );

  return (
    <StatsContext.Provider
      value={{
        stats,
        heroStats,
        storyStats,
        yearsOfImpact,
        loading,
        error,
        saveStats,
        foundationStartYear: FOUNDATION_START_YEAR,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats must be used within StatsProvider");
  }
  return context;
}
