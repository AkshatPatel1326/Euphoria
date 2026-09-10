import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { AdminRegistration, RegistrationStatus } from "@/types/admin";
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Calendar,
  CreditCard,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Ban,
  Trash2,
  MapPin,
} from "lucide-react";

interface RegistrationDetailModalProps {
  registration: AdminRegistration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
  onUpdateStatus?: (id: string, status: RegistrationStatus) => void;
  onDelete?: (registration: AdminRegistration) => void;
}

export function RegistrationDetailModal({
  registration,
  open,
  onOpenChange,
  isAdmin,
  onUpdateStatus,
  onDelete,
}: RegistrationDetailModalProps) {
  if (!registration) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20 gap-1">
            <CheckCircle className="size-3" /> Confirmed
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20 gap-1">
            <Clock className="size-3" /> Pending
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 hover:bg-red-500/20 gap-1">
            <XCircle className="size-3" /> Cancelled
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20 gap-1">
            <Ban className="size-3" /> Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status?: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
            Paid
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
            Payment Pending
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status || "Unpaid"}</Badge>;
    }
  };

  const canDelete =
    isAdmin &&
    (registration.status === "CANCELLED" || registration.status === "REJECTED") &&
    registration.payment?.status !== "SUCCESS";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                {registration.registrationNumber}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Registered on{" "}
                {new Date(registration.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(registration.status)}
              {getPaymentBadge(registration.payment?.status)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Attendee Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <User className="size-3.5" /> Participant Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-muted/40 p-3.5 rounded-lg border border-border/50">
              <div>
                <span className="text-xs text-muted-foreground block">Full Name</span>
                <span className="font-medium text-foreground">{registration.fullName}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Category</span>
                <Badge variant="secondary" className="text-xs mt-0.5">
                  {registration.participantCategory}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground shrink-0" />
                <span className="truncate">{registration.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground shrink-0" />
                <span>{registration.phone}</span>
              </div>
              {registration.collegeName && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Building className="size-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{registration.collegeName}</span>
                </div>
              )}
              {registration.scholarNumber && (
                <div>
                  <span className="text-xs text-muted-foreground block">Scholar Number</span>
                  <span>{registration.scholarNumber}</span>
                </div>
              )}
              {registration.enrollmentNumber && (
                <div>
                  <span className="text-xs text-muted-foreground block">Enrollment Number</span>
                  <span>{registration.enrollmentNumber}</span>
                </div>
              )}
              {registration.course && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="size-4 text-muted-foreground shrink-0" />
                  <span>
                    {registration.course} {registration.year ? `(${registration.year})` : ""}
                  </span>
                </div>
              )}
              {registration.city && (
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground shrink-0" />
                  <span>{registration.city}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Event Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <Calendar className="size-3.5" /> Event Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-muted/40 p-3.5 rounded-lg border border-border/50">
              <div>
                <span className="text-xs text-muted-foreground block">Event Name</span>
                <span className="font-semibold text-foreground">{registration.event.name}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Category</span>
                <span>{registration.event.category?.name || "General"}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Registration Type</span>
                <Badge variant="outline" className="text-xs">
                  {registration.event.registrationType}
                </Badge>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Event Fee</span>
                <span className="font-medium">
                  {registration.event.fee > 0 ? `₹${registration.event.fee}` : "Free"}
                </span>
              </div>
              {registration.event.venue && (
                <div className="sm:col-span-2">
                  <span className="text-xs text-muted-foreground block">Venue</span>
                  <span>{registration.event.venue}</span>
                </div>
              )}
            </div>
          </div>

          {/* Team Details (if group) */}
          {registration.team && (
            <>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Users className="size-3.5" /> Group Registration — {registration.team.name}
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {registration.team.members.length + 1} Members
                  </Badge>
                </div>
                <div className="space-y-2.5">
                  {/* Leader */}
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">Team Leader</span>
                      <span className="text-muted-foreground">{registration.fullName}</span>
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {registration.email} • {registration.phone}
                    </p>
                  </div>

                  {/* Other Members */}
                  {registration.team.members.map((member, idx) => (
                    <div
                      key={member.id || idx}
                      className="bg-muted/30 p-2.5 rounded-lg border border-border/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                    >
                      <div>
                        <span className="font-medium">{member.fullName}</span>
                        <p className="text-muted-foreground text-[11px]">
                          {member.email} • {member.phone}
                        </p>
                      </div>
                      {member.collegeName && (
                        <span className="text-muted-foreground text-[11px] truncate max-w-xs">
                          {member.collegeName}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Payment Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <CreditCard className="size-3.5" /> Payment & Transaction
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-muted/40 p-3.5 rounded-lg border border-border/50">
              <div>
                <span className="text-xs text-muted-foreground block">Amount</span>
                <span className="text-base font-semibold">
                  ₹{registration.payment?.amount ?? registration.event.fee}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Payment Status</span>
                {getPaymentBadge(registration.payment?.status)}
              </div>
              {registration.payment?.method && (
                <div>
                  <span className="text-xs text-muted-foreground block">Method</span>
                  <span>{registration.payment.method}</span>
                </div>
              )}
              {registration.payment?.transactionId && (
                <div className="sm:col-span-2">
                  <span className="text-xs text-muted-foreground block">Transaction ID</span>
                  <code className="text-xs font-mono bg-background px-1.5 py-0.5 rounded border">
                    {registration.payment.transactionId}
                  </code>
                </div>
              )}
              {registration.payment?.gatewayReference && (
                <div className="sm:col-span-2">
                  <span className="text-xs text-muted-foreground block">Gateway Reference</span>
                  <code className="text-xs font-mono bg-background px-1.5 py-0.5 rounded border">
                    {registration.payment.gatewayReference}
                  </code>
                </div>
              )}
              {registration.payment?.paidAt && (
                <div>
                  <span className="text-xs text-muted-foreground block">Paid Timestamp</span>
                  <span className="text-xs">
                    {new Date(registration.payment.paidAt).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status & Deletion Actions */}
          <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-3">
            {/* Status change actions */}
            {onUpdateStatus && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium mr-1">Status:</span>
                {registration.status !== "CONFIRMED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30 border-green-200"
                    onClick={() => onUpdateStatus(registration.id, "CONFIRMED")}
                  >
                    <CheckCircle className="size-3.5 mr-1" /> Confirm
                  </Button>
                )}
                {registration.status !== "CANCELLED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-amber-200"
                    onClick={() => onUpdateStatus(registration.id, "CANCELLED")}
                  >
                    <XCircle className="size-3.5 mr-1" /> Cancel
                  </Button>
                )}
                {registration.status !== "REJECTED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200"
                    onClick={() => onUpdateStatus(registration.id, "REJECTED")}
                  >
                    <Ban className="size-3.5 mr-1" /> Reject
                  </Button>
                )}
              </div>
            )}

            {/* Admin-only Permanent Delete */}
            {isAdmin && onDelete && (
              <Button
                size="sm"
                variant="destructive"
                disabled={!canDelete}
                title={
                  canDelete
                    ? "Permanently delete this registration"
                    : "Must be Cancelled or Rejected before deletion"
                }
                onClick={() => onDelete(registration)}
                className="gap-1.5 ml-auto"
              >
                <Trash2 className="size-3.5" /> Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
