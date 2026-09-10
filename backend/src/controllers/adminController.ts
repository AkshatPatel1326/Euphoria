import type { Response, NextFunction } from "express";
import { AdminService } from "../services/adminService";
import type {
  AuthenticatedRequest,
  AdminRegistrationQuery,
  AdminPassPurchaseQuery,
} from "../types";
import { HttpError } from "../lib/errors";
import { RegistrationStatus } from "../../generated/prisma/client";

/**
 * Controller retrieving aggregated admin metrics
 * GET /api/admin/overview
 */
export const getOverviewStatsHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError("Authentication required.", 401);
    }

    const stats = await AdminService.getOverviewStats(req.user);

    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller retrieving paginated, filtered event registrations
 * GET /api/admin/registrations
 */
export const getRegistrationsHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError("Authentication required.", 401);
    }

    const query: AdminRegistrationQuery = {
      search: req.query.search as string | undefined,
      eventId: req.query.eventId as string | undefined,
      categoryId: req.query.categoryId as string | undefined,
      status: req.query.status as any,
      paymentStatus: req.query.paymentStatus as any,
      participantCategory: req.query.participantCategory as any,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
    };

    const result = await AdminService.getRegistrations(req.user, query);

    res.status(200).json({
      status: "success",
      data: {
        registrations: result.items,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller retrieving full filtered registrations dataset for CSV export
 * GET /api/admin/registrations/export
 */
export const exportRegistrationsHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError("Authentication required.", 401);
    }

    const query: AdminRegistrationQuery = {
      search: req.query.search as string | undefined,
      eventId: req.query.eventId as string | undefined,
      categoryId: req.query.categoryId as string | undefined,
      status: req.query.status as any,
      paymentStatus: req.query.paymentStatus as any,
      participantCategory: req.query.participantCategory as any,
    };

    const registrations = await AdminService.getRegistrationsForExport(
      req.user,
      query
    );

    res.status(200).json({
      status: "success",
      count: registrations.length,
      data: { registrations },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller permanently deleting a registration (Admin-only, guarded)
 * DELETE /api/admin/registrations/:id
 */
export const deleteRegistrationHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError("Authentication required.", 401);
    }

    const registrationId = req.params.id as string;
    const result = await AdminService.deleteRegistration(
      registrationId,
      req.user
    );

    res.status(200).json({
      status: "success",
      message: `Registration ${result.registrationNumber} permanently deleted.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller retrieving paginated, filtered festival pass purchases (Admin-only)
 * GET /api/admin/pass-purchases
 */
export const getPassPurchasesHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError("Authentication required.", 401);
    }

    const query: AdminPassPurchaseQuery = {
      search: req.query.search as string | undefined,
      passId: req.query.passId as string | undefined,
      status: req.query.status as any,
      paymentStatus: req.query.paymentStatus as any,
      participantCategory: req.query.participantCategory as any,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
    };

    const result = await AdminService.getPassPurchases(req.user, query);

    res.status(200).json({
      status: "success",
      data: {
        passPurchases: result.items,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller retrieving full filtered pass purchases dataset for CSV export (Admin-only)
 * GET /api/admin/pass-purchases/export
 */
export const exportPassPurchasesHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError("Authentication required.", 401);
    }

    const query: AdminPassPurchaseQuery = {
      search: req.query.search as string | undefined,
      passId: req.query.passId as string | undefined,
      status: req.query.status as any,
      paymentStatus: req.query.paymentStatus as any,
      participantCategory: req.query.participantCategory as any,
    };

    const passPurchases = await AdminService.getPassPurchasesForExport(
      req.user,
      query
    );

    res.status(200).json({
      status: "success",
      count: passPurchases.length,
      data: { passPurchases },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller retrieving single pass purchase by ID (Admin-only)
 * GET /api/admin/pass-purchases/:id
 */
export const getPassPurchaseByIdHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError("Authentication required.", 401);
    }

    const purchase = await AdminService.getPassPurchaseById(
      req.params.id as string,
      req.user
    );

    res.status(200).json({
      status: "success",
      data: { passPurchase: purchase },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller updating pass purchase status (Admin-only)
 * PATCH /api/admin/pass-purchases/:id/status
 */
export const updatePassPurchaseStatusHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError("Authentication required.", 401);
    }

    const { status } = req.body;
    if (!status || !Object.values(RegistrationStatus).includes(status)) {
      throw new HttpError(
        `Invalid status. Allowed values: ${Object.values(RegistrationStatus).join(", ")}`,
        400
      );
    }

    const updated = await AdminService.updatePassPurchaseStatus(
      req.params.id as string,
      status,
      req.user
    );

    res.status(200).json({
      status: "success",
      message: "Pass purchase status updated successfully.",
      data: { passPurchase: updated },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller permanently deleting a pass purchase (Admin-only, guarded)
 * DELETE /api/admin/pass-purchases/:id
 */
export const deletePassPurchaseHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError("Authentication required.", 401);
    }

    const result = await AdminService.deletePassPurchase(
      req.params.id as string,
      req.user
    );

    res.status(200).json({
      status: "success",
      message: `Pass purchase ${result.passNumber} permanently deleted.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
