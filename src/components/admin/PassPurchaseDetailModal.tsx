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
import type { AdminPassPurchase, RegistrationStatus } from "@/types/admin";
import {
  User,
  Mail,
  Phone,
  Building,
  CreditCard,
  Ticket,
  CheckCircle,
  Clock,
  XCircle,
  Ban,
  Trash2,
} from "lucide-react";

interface PassPurchaseDetailModalProps {
  purchase: AdminPassPurchase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
  onUpdateStatus?: (id: string, status: RegistrationStatus) => void;
  onDelete?: (purchase: AdminPassPurchase) => void;
}

export function PassPurchaseDetailModal({
  purchase,
  open,
  onOpenChange,
  isAdmin,
  onUpdateStatus,
  onDelete,
}: PassPurchaseDetailModalProps) {
  if (!purchase) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 gap-1">
            <CheckCircle className="size-3" /> Confirmed
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 gap-1">
            <Clock className="size-3" /> Pending
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 gap-1">
            <XCircle className="size-3" /> Cancelled
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 gap-1">
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
            Pending
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
    (purchase.status === "CANCELLED" || purchase.status === "REJECTED") &&
    purchase.payment?.status !== "SUCCESS";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                {purchase.passNumber}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Purchased on{" "}
                {new Date(purchase.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(purchase.status)}
              {getPaymentBadge(purchase.payment?.status)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Buyer Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <User className="size-3.5" /> Buyer Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-muted/40 p-3.5 rounded-lg border border-border/50">
              <div>
                <span className="text-xs text-muted-foreground block">Full Name</span>
                <span className="font-medium text-foreground">{purchase.fullName}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Category</span>
                <Badge variant="secondary" className="text-xs mt-0.5">
                  {purchase.participantCategory}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground shrink-0" />
                <span className="truncate">{purchase.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground shrink-0" />
                <span>{purchase.phone}</span>
              </div>
              {purchase.collegeName && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Building className="size-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{purchase.collegeName}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Pass Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <Ticket className="size-3.5" /> Pass Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-muted/40 p-3.5 rounded-lg border border-border/50">
              <div>
                <span className="text-xs text-muted-foreground block">Pass Name</span>
                <span className="font-semibold text-foreground">{purchase.pass.name}</span>
                {purchase.pass.subtitle && (
                  <span className="text-xs text-muted-foreground block">
                    {purchase.pass.subtitle}
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Quantity</span>
                <span className="font-medium text-base">{purchase.quantity}</span>
              </div>
              {purchase.pass.features && purchase.pass.features.length > 0 && (
                <div className="sm:col-span-2">
                  <span className="text-xs text-muted-foreground block mb-1">Included Features</span>
                  <div className="flex flex-wrap gap-1.5">
                    {purchase.pass.features.map((feat, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-background px-2 py-0.5 rounded border border-border/70 text-muted-foreground"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Payment & Transaction */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <CreditCard className="size-3.5" /> Payment Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-muted/40 p-3.5 rounded-lg border border-border/50">
              <div>
                <span className="text-xs text-muted-foreground block">Total Amount</span>
                <span className="text-base font-semibold">
                  ₹{purchase.payment?.amount ?? ((purchase.pass.price || 0) * purchase.quantity)}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Payment Status</span>
                {getPaymentBadge(purchase.payment?.status)}
              </div>
              {purchase.payment?.method && (
                <div>
                  <span className="text-xs text-muted-foreground block">Payment Method</span>
                  <span>{purchase.payment.method}</span>
                </div>
              )}
              {purchase.payment?.transactionId && (
                <div className="sm:col-span-2">
                  <span className="text-xs text-muted-foreground block">Transaction ID</span>
                  <code className="text-xs font-mono bg-background px-1.5 py-0.5 rounded border">
                    {purchase.payment.transactionId}
                  </code>
                </div>
              )}
              {purchase.payment?.paidAt && (
                <div className="sm:col-span-2">
                  <span className="text-xs text-muted-foreground block">Paid Timestamp</span>
                  <span className="text-xs">
                    {new Date(purchase.payment.paidAt).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-3">
            {onUpdateStatus && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium mr-1">Status:</span>
                {purchase.status !== "CONFIRMED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30 border-green-200"
                    onClick={() => onUpdateStatus(purchase.id, "CONFIRMED")}
                  >
                    <CheckCircle className="size-3.5 mr-1" /> Confirm
                  </Button>
                )}
                {purchase.status !== "CANCELLED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-amber-200"
                    onClick={() => onUpdateStatus(purchase.id, "CANCELLED")}
                  >
                    <XCircle className="size-3.5 mr-1" /> Cancel
                  </Button>
                )}
                {purchase.status !== "REJECTED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200"
                    onClick={() => onUpdateStatus(purchase.id, "REJECTED")}
                  >
                    <Ban className="size-3.5 mr-1" /> Reject
                  </Button>
                )}
              </div>
            )}

            {isAdmin && onDelete && (
              <Button
                size="sm"
                variant="destructive"
                disabled={!canDelete}
                title={
                  canDelete
                    ? "Permanently delete this pass purchase"
                    : "Must be Cancelled or Rejected before deletion"
                }
                onClick={() => onDelete(purchase)}
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
