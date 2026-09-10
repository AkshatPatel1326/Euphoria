import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";
import type {
  AdminPassPurchase,
  AdminPass,
  PaginationMeta,
  RegistrationStatus,
  PaymentStatus,
} from "@/types/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PassPurchaseDetailModal } from "./PassPurchaseDetailModal";
import { AdminConfirmDialog } from "./AdminConfirmDialog";
import { toast } from "sonner";
import {
  Search,
  Download,
  FilterX,
  Loader2,
  Eye,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  Ban,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Ticket,
} from "lucide-react";

interface AdminPassesTabProps {
  isAdmin: boolean;
  passes: AdminPass[];
  selectedPassForDetail?: AdminPassPurchase | null;
  onClearSelectedPass?: () => void;
  onDataChanged?: () => void;
}

interface PassPurchasesResponse {
  status: string;
  data: {
    passPurchases: AdminPassPurchase[];
    pagination: PaginationMeta;
  };
}

interface ExportPassResponse {
  status: string;
  count: number;
  data: {
    passPurchases: AdminPassPurchase[];
  };
}

export function AdminPassesTab({
  isAdmin,
  passes,
  selectedPassForDetail,
  onClearSelectedPass,
  onDataChanged,
}: AdminPassesTabProps) {
  // If somehow accessed by non-admin, don't render content
  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Access Denied: Festival Pass management is reserved for festival administrators.
      </div>
    );
  }

  // Filters & Pagination State
  const [search, setSearch] = useState("");
  const [selectedPassId, setSelectedPassId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 15;

  // Data & Loading State
  const [purchases, setPurchases] = useState<AdminPassPurchase[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Detail Modal & Action Dialog State
  const [activePurchase, setActivePurchase] = useState<AdminPassPurchase | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Confirm Dialog State
  const [confirmAction, setConfirmAction] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    variant: "default" | "destructive";
    isLoading: boolean;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    confirmLabel: "Confirm",
    variant: "default",
    isLoading: false,
    onConfirm: () => {},
  });

  // Watch external selection from Overview tab
  useEffect(() => {
    if (selectedPassForDetail) {
      setActivePurchase(selectedPassForDetail);
      setIsDetailOpen(true);
    }
  }, [selectedPassForDetail]);

  // Fetch pass purchases
  const fetchPassPurchases = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (selectedPassId !== "all") params.append("passId", selectedPassId);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (selectedPaymentStatus !== "all") params.append("paymentStatus", selectedPaymentStatus);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const res = await apiGet<PassPurchasesResponse>(`/admin/pass-purchases?${params.toString()}`);
      setPurchases(res.data.passPurchases);
      setPagination(res.data.pagination);
    } catch (err: any) {
      toast.error(err.message || "Failed to load pass purchases");
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedPassId, selectedStatus, selectedPaymentStatus, page]);

  useEffect(() => {
    fetchPassPurchases();
  }, [fetchPassPurchases]);

  // Handle status update
  const handleUpdateStatus = async (purchaseId: string, newStatus: RegistrationStatus) => {
    try {
      await apiPatch(`/admin/pass-purchases/${purchaseId}/status`, { status: newStatus });
      toast.success(`Pass purchase marked as ${newStatus.toLowerCase()}`);
      fetchPassPurchases();
      onDataChanged?.();

      if (activePurchase?.id === purchaseId) {
        setActivePurchase((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update pass purchase status");
    }
  };

  // Handle delete pass purchase (guarded, Admin only)
  const handleDeletePassPurchase = (purchase: AdminPassPurchase) => {
    setConfirmAction({
      open: true,
      title: "Permanently Delete Pass Purchase?",
      description: `Are you sure you want to permanently delete pass purchase ${purchase.passNumber} for ${purchase.fullName}? This action cannot be undone.`,
      confirmLabel: "Delete Record",
      variant: "destructive",
      isLoading: false,
      onConfirm: async () => {
        try {
          setConfirmAction((prev) => ({ ...prev, isLoading: true }));
          await apiDelete(`/admin/pass-purchases/${purchase.id}`);
          toast.success(`Pass purchase ${purchase.passNumber} deleted.`);
          setConfirmAction((prev) => ({ ...prev, open: false, isLoading: false }));
          setIsDetailOpen(false);
          fetchPassPurchases();
          onDataChanged?.();
        } catch (err: any) {
          toast.error(err.message || "Failed to delete pass purchase");
          setConfirmAction((prev) => ({ ...prev, isLoading: false }));
        }
      },
    });
  };

  // CSV Export: Exports FULL currently filtered dataset
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (selectedPassId !== "all") params.append("passId", selectedPassId);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (selectedPaymentStatus !== "all") params.append("paymentStatus", selectedPaymentStatus);

      const res = await apiGet<ExportPassResponse>(`/admin/pass-purchases/export?${params.toString()}`);
      const data = res.data.passPurchases;

      if (!data || data.length === 0) {
        toast.info("No pass purchases match current filters to export.");
        return;
      }

      const headers = [
        "Pass Number",
        "Full Name",
        "Email",
        "Phone",
        "Category",
        "College",
        "Pass Name",
        "Quantity",
        "Status",
        "Payment Status",
        "Amount (INR)",
        "Transaction ID",
        "Purchased At",
      ];

      const escapeCSV = (val: unknown) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const rows = data.map((p) => [
        escapeCSV(p.passNumber),
        escapeCSV(p.fullName),
        escapeCSV(p.email),
        escapeCSV(p.phone),
        escapeCSV(p.participantCategory),
        escapeCSV(p.collegeName || ""),
        escapeCSV(p.pass?.name || ""),
        escapeCSV(p.quantity),
        escapeCSV(p.status),
        escapeCSV(p.payment?.status || "UNPAID"),
        escapeCSV(p.payment?.amount ?? ((p.pass?.price || 0) * p.quantity)),
        escapeCSV(p.payment?.transactionId || ""),
        escapeCSV(new Date(p.createdAt).toISOString()),
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `euphoria_pass_purchases_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${data.length} festival pass purchases to CSV`);
    } catch (err: any) {
      toast.error(err.message || "Failed to export pass purchases");
    } finally {
      setIsExporting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedPassId("all");
    setSelectedStatus("all");
    setSelectedPaymentStatus("all");
    setPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedPassId !== "all" ||
    selectedStatus !== "all" ||
    selectedPaymentStatus !== "all";

  return (
    <div className="space-y-4">
      {/* Search & Filters Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by buyer name, email, phone, or pass #..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 text-sm"
            />
          </div>

          {/* Export & Clear Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <FilterX className="size-3.5" />
                Clear
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={isExporting || pagination.total === 0}
              className="gap-1.5 text-xs"
            >
              {isExporting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              Export CSV ({pagination.total})
            </Button>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Pass Type Filter */}
          <Select
            value={selectedPassId}
            onValueChange={(val) => {
              setSelectedPassId(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Passes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Passes</SelectItem>
              {passes.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} {p.subtitle ? `(${p.subtitle})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={selectedStatus}
            onValueChange={(val) => {
              setSelectedStatus(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Status Filter */}
          <Select
            value={selectedPaymentStatus}
            onValueChange={(val) => {
              setSelectedPaymentStatus(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Payments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="SUCCESS">Paid (Success)</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table & Content */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="size-7 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Loading pass purchases...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Ticket className="size-10 mx-auto text-muted-foreground/40" />
            <h3 className="text-sm font-semibold">No pass purchases found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {hasActiveFilters
                ? "Try clearing or adjusting your search filters above."
                : "No festival pass purchases have been made yet."}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2 text-xs">
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40 text-xs">
                  <TableHead className="font-semibold">Pass Number</TableHead>
                  <TableHead className="font-semibold">Buyer</TableHead>
                  <TableHead className="font-semibold">Pass Type</TableHead>
                  <TableHead className="font-semibold">Qty</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Payment</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id} className="text-xs hover:bg-muted/30">
                    {/* Pass Number */}
                    <TableCell className="font-mono font-medium text-foreground whitespace-nowrap">
                      {purchase.passNumber}
                    </TableCell>

                    {/* Buyer */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium text-foreground">{purchase.fullName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {purchase.email} • {purchase.phone}
                        </p>
                      </div>
                    </TableCell>

                    {/* Pass Type */}
                    <TableCell>
                      <span className="font-medium text-foreground">{purchase.pass?.name}</span>
                    </TableCell>

                    {/* Quantity */}
                    <TableCell>
                      <Badge variant="secondary" className="text-[11px]">
                        {purchase.quantity}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          purchase.status === "CONFIRMED"
                            ? "border-green-500 text-green-600 bg-green-50/60 dark:bg-green-950/30"
                            : purchase.status === "PENDING"
                            ? "border-yellow-500 text-yellow-600 bg-yellow-50/60 dark:bg-yellow-950/30"
                            : purchase.status === "CANCELLED"
                            ? "border-red-500 text-red-600 bg-red-50/60 dark:bg-red-950/30"
                            : "border-rose-500 text-rose-600 bg-rose-50/60 dark:bg-rose-950/30"
                        }
                      >
                        {purchase.status}
                      </Badge>
                    </TableCell>

                    {/* Payment */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <span
                          className={`font-medium ${
                            purchase.payment?.status === "SUCCESS"
                              ? "text-green-600"
                              : "text-amber-600"
                          }`}
                        >
                          {purchase.payment?.status === "SUCCESS" ? "Paid" : "Pending"}
                        </span>
                        <p className="text-[10px] text-muted-foreground">
                          ₹{purchase.payment?.amount ?? ((purchase.pass?.price || 0) * purchase.quantity)}
                        </p>
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {new Date(purchase.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          title="View Full Details"
                          onClick={() => {
                            setActivePurchase(purchase);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="size-3.5" />
                        </Button>

                        {/* Status Change dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="size-7">
                              <MoreHorizontal className="size-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 text-xs">
                            <DropdownMenuItem
                              onClick={() => {
                                setActivePurchase(purchase);
                                setIsDetailOpen(true);
                              }}
                            >
                              <Eye className="size-3.5 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {purchase.status !== "CONFIRMED" && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(purchase.id, "CONFIRMED")}
                                className="text-green-600 focus:text-green-600"
                              >
                                <CheckCircle className="size-3.5 mr-2" /> Mark Confirmed
                              </DropdownMenuItem>
                            )}
                            {purchase.status !== "CANCELLED" && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(purchase.id, "CANCELLED")}
                                className="text-amber-600 focus:text-amber-600"
                              >
                                <XCircle className="size-3.5 mr-2" /> Mark Cancelled
                              </DropdownMenuItem>
                            )}
                            {purchase.status !== "REJECTED" && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(purchase.id, "REJECTED")}
                                className="text-rose-600 focus:text-rose-600"
                              >
                                <Ban className="size-3.5 mr-2" /> Mark Rejected
                              </DropdownMenuItem>
                            )}

                            {/* Delete — Admin only */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeletePassPurchase(purchase)}
                              className="text-destructive focus:text-destructive"
                              disabled={
                                purchase.status === "CONFIRMED" ||
                                purchase.payment?.status === "SUCCESS"
                              }
                            >
                              <Trash2 className="size-3.5 mr-2" /> Delete Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Footer */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
            <div>
              Showing page <span className="font-medium text-foreground">{pagination.page}</span>{" "}
              of <span className="font-medium text-foreground">{pagination.totalPages}</span> (
              {pagination.total} total)
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-7 px-2 text-xs"
              >
                <ChevronLeft className="size-3.5 mr-1" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="h-7 px-2 text-xs"
              >
                Next <ChevronRight className="size-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <PassPurchaseDetailModal
        purchase={activePurchase}
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) onClearSelectedPass?.();
        }}
        isAdmin={isAdmin}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeletePassPurchase}
      />

      {/* Confirmation Dialog */}
      <AdminConfirmDialog
        open={confirmAction.open}
        onOpenChange={(open) => setConfirmAction((prev) => ({ ...prev, open }))}
        title={confirmAction.title}
        description={confirmAction.description}
        confirmLabel={confirmAction.confirmLabel}
        variant={confirmAction.variant}
        isLoading={confirmAction.isLoading}
        onConfirm={confirmAction.onConfirm}
      />
    </div>
  );
}
