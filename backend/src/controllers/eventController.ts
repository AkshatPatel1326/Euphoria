import type { Request, Response, NextFunction } from "express";
import { EventService } from "../services/eventService";
import type { EventFilterQuery, AuthenticatedRequest } from "../types";
import { HttpError } from "../lib/errors";

/**
 * Controller retrieving all published events with optional filtering
 * GET /api/events
 */
export const getEventsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters: EventFilterQuery = {
      category: req.query.category as string | undefined,
      registrationType: req.query.registrationType as string | undefined,
      registrationOpen: req.query.registrationOpen as string | undefined,
      search: req.query.search as string | undefined,
    };

    const events = await EventService.getEvents(filters);

    res.status(200).json({
      status: "success",
      count: events.length,
      data: { events },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller retrieving a single event by ID or slug
 * GET /api/events/:idOrSlug
 */
export const getEventByIdOrSlugHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const idOrSlug = req.params.idOrSlug as string;
    const event = await EventService.getEventByIdOrSlug(idOrSlug);

    res.status(200).json({
      status: "success",
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller updating registrationOpen status for an event (Admin or assigned Organizer)
 * PATCH /api/events/:id/registration-status
 */
export const updateEventRegistrationStatusHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError("Authentication required", 401);
    }

    const id = req.params.id as string;
    const { registrationOpen } = req.body;

    if (typeof registrationOpen !== "boolean") {
      throw new HttpError("Field 'registrationOpen' must be a boolean", 400);
    }

    const updatedEvent = await EventService.updateRegistrationStatus(
      id,
      registrationOpen,
      req.user
    );

    res.status(200).json({
      status: "success",
      message: `Event registration is now ${registrationOpen ? "open" : "closed"}`,
      data: { event: updatedEvent },
    });
  } catch (error) {
    next(error);
  }
};

