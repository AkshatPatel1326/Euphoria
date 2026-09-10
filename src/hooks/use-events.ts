// ─────────────────────────────────────────────────────────────
// useEvents — fetches events from GET /api/events and maps
// backend EventDetail shape → frontend EuphoriaEvent shape.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api";
import type { EuphoriaEvent, EventCategory, RegistrationType } from "@/data/events";

// Shape returned by backend GET /api/events (verified from Prisma schema + eventService)
interface BackendCategory {
  id: string;
  slug: string;
  name: string;
  number: string | null;
  color: string | null;
  description: string | null;
  keywords: string | null;
  posterUrl: string | null;
}

interface BackendEvent {
  id: string;
  slug: string | null;
  name: string;
  description: string;
  posterUrl: string | null;
  categoryId: string;
  category: BackendCategory;
  fee: number;
  registrationType: "INDIVIDUAL" | "GROUP";
  minTeamSize: number;
  maxTeamSize: number;
  registrationOpen: boolean;
  capacity: number | null;
  status: string;
  date: string | null;
  day: string | null;
  time: string | null;
  venue: string | null;
  prizes: string | null;
  rules: string | null;
}

interface EventsResponse {
  status: string;
  count: number;
  data: {
    events: BackendEvent[];
  };
}

/**
 * Maps a backend EventDetail to the frontend EuphoriaEvent interface.
 * All field name differences and case normalization handled here.
 */
function mapBackendEvent(e: BackendEvent): EuphoriaEvent {
  return {
    id: e.id,
    name: e.name,
    category: e.category.slug as EventCategory,
    description: e.description,
    poster: e.posterUrl ?? null,
    fee: e.fee,
    registrationType: e.registrationType.toLowerCase() as RegistrationType,
    minTeamSize: e.minTeamSize,
    maxTeamSize: e.maxTeamSize,
    registrationOpen: e.registrationOpen,
    registrationFee: e.fee === 0 ? "Free" : `₹${e.fee.toLocaleString("en-IN")}`,
    date: e.date ?? "TBA",
    day: e.day ?? "",
    time: e.time ?? "TBA",
    venue: e.venue ?? "TBA",
    teamSize:
      e.minTeamSize === e.maxTeamSize
        ? String(e.minTeamSize)
        : `${e.minTeamSize}–${e.maxTeamSize}`,
    prizes: e.prizes ?? "TBA",
    rules: e.rules ?? "",
  };
}

/**
 * Hook to fetch events from the backend, optionally filtered by category slug.
 */
export function useEvents(category?: string) {
  const [events, setEvents] = useState<EuphoriaEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const queryParams = category ? `?category=${encodeURIComponent(category)}` : "";

    apiGet<EventsResponse>(`/events${queryParams}`)
      .then((res) => {
        setEvents(res.data.events.map(mapBackendEvent));
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load events");
        setEvents([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [category]);

  return { events, isLoading, error };
}
