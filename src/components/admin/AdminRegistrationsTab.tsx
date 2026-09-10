import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";
import type {
  AdminRegistration,
  PaginationMeta,
  RegistrationStatus,
  PaymentStatus,
  Category,
  AdminEvent,
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
import { RegistrationDetailModal } from "./RegistrationDetailModal";
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
  Users,
  Calendar,
} from "lucide-react";

interface AdminRegistrationsTabProps {
  isAdmin: boolean;
  categories: Category[];
  events: AdminEvent[];
  selectedRegForDetail?: AdminRegistration | null;
  onClearSelectedReg?: () => void;
  onDataChanged?: () => void;
}

interface RegistrationsResponse {
  status: string;
  data: {
    registrations: AdminRegistration[];
    pagination: PaginationMeta;
  };
}

interface ExportResponse {
  status: string;
  count: number;
  data: {
    registrations: AdminRegistration[];
  };
}

export function AdminRegistrationsTab({
  isAdmin,
  categories,
  events,
  selectedRegForDetail,
  onClearSelectedReg,
  onDataChanged,
}: AdminRegistrationsTabProps) {
  // Filters & Pagination State
  const [search, setSearch] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 15;

  // Data & Loading State
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Detail Modal & Action Dialog State
  const [activeReg, setActiveReg] = useState<AdminRegistration | null>(null);
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
    if (selectedRegForDetail) {
      setActiveReg(selectedRegForDetail);
      setIsDetailOpen(true);
    }
  }, [selectedRegForDetail]);

  // Fetch registrations
  const fetchRegistrations = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (selectedEventId !== "all") params.append("eventId", selectedEventId);
      if (selectedCategoryId !== "all") params.append("categoryId", selectedCategoryId);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (selectedPaymentStatus !== "all") params.append("paymentStatus", selectedPaymentStatus);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const res = await apiGet<RegistrationsResponse>(`/admin/registrations?${params.toString()}`);
      setRegistrations(res.data.registrations);
      setPagination(res.data.pagination);
    } catch (err: any) {
      toast.error(err.message || "Failed to load registrations");
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedEventId, selectedCategoryId, selectedStatus, selectedPaymentStatus, page]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Handle status update
  const handleUpdateStatus = async (registrationId: string, newStatus: RegistrationStatus) => {
    try {
      await apiPatch(`/registrations/${registrationId}/status`, { status: newStatus });
      toast.success(`Registration marked as ${newStatus.toLowerCase()}`);
      fetchRegistrations();
      onDataChanged?.();

      // If active modal is open for this reg, update it
      if (activeReg?.id === registrationId) {
        setActiveReg((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update registration status");
    }
  };

  // Handle delete registration (guarded, Admin only)
  const handleDeleteRegistration = (reg: AdminRegistration) => {
    if (!isAdmin) return;

    setConfirmAction({
      open: true,
      title: "Permanently Delete Registration?",
      description: `Are you sure you want to permanently delete registration ${reg.registrationNumber} for ${reg.fullName}? This action cannot be undone.`,
      confirmLabel: "Delete Record",
      variant: "destructive",
      isLoading: false,
      onConfirm: async () => {
        try {
          setConfirmAction((prev) => ({ ...prev, isLoading: true }));
          await apiDelete(`/admin/registrations/${reg.id}`);
          toast.success(`Registration ${reg.registrationNumber} deleted.`);
          setConfirmAction((prev) => ({ ...prev, open: false, isLoading: false }));
          setIsDetailOpen(false);
          fetchRegistrations();
          onDataChanged?.();
        } catch (err: any) {
          toast.error(err.message || "Failed to delete registration");
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
      if (selectedEventId !== "all") params.append("eventId", selectedEventId);
      if (selectedCategoryId !== "all") params.append("categoryId", selectedCategoryId);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (selectedPaymentStatus !== "all") params.append("paymentStatus", selectedPaymentStatus);

      const res = await apiGet<ExportResponse>(`/admin/registrations/export?${params.toString()}`);
      const data = res.data.registrations;

      if (!data || data.length === 0) {
        toast.info("No registrations match current filters to export.");
        return;
      }

      // Build CSV
      const headers = [
        "Registration Number",
        "Full Name",
        "Email",
        "Phone",
        "Category",
        "Scholar No",
        "Enrollment No",
        "College",
        "Course",
        "Year",
        "City",
        "Event Name",
        "Event Category",
        "Registration Type",
        "Team Name",
        "Team Members",
        "Registration Status",
        "Payment Status",
        "Amount (INR)",
        "Transaction ID",
        "Gateway Ref",
        "Registered At",
      ];

      const escapeCSV = (val: unknown) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const rows = data.map((r) => {
        const teamMembers = r.team?.members.map((m) => `${m.fullName} (${m.email})`).join("; ") || "";
        return [
          escapeCSV(r.registrationNumber),
          escapeCSV(r.fullName),
          escapeCSV(r.email),
          escapeCSV(r.phone),
          escapeCSV(r.participantCategory),
          escapeCSV(r.scholarNumber || ""),
          escapeCSV(r.enrollmentNumber || ""),
          escapeCSV(r.collegeName || ""),
          escapeCSV(r.course || ""),
          escapeCSV(r.year || ""),
          escapeCSV(r.city || ""),
          escapeCSV(r.event?.name || ""),
          escapeCSV(r.event?.category?.name || ""),
          escapeCSV(r.event?.registrationType || ""),
          escapeCSV(r.team?.name || ""),
          escapeCSV(teamMembers),
          escapeCSV(r.status),
          escapeCSV(r.payment?.status || "UNPAID"),
          escapeCSV(r.payment?.amount ?? r.event?.fee ?? 0),
          escapeCSV(r.payment?.transactionId || ""),
          escapeCSV(r.payment?.gatewayReference || ""),
          escapeCSV(new Date(r.createdAt).toISOString()),
        ].join(",");
      });

      const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `euphoria_registrations_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${data.length} registrations to CSV`);
    } catch (err: any) {
      toast.error(err.message || "Failed to export registrations");
    } finally {
      setIsExporting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedEventId("all");
    setSelectedCategoryId("all");
    setSelectedStatus("all");
    setSelectedPaymentStatus("all");
    setPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedEventId !== "all" ||
    selectedCategoryId !== "all" ||
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
              placeholder="Search by participant name, email, phone, reg #, or team..."
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

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Category Filter */}
          <Select
            value={selectedCategoryId}
            onValueChange={(val) => {
              setSelectedCategoryId(val);
              setSelectedEventId("all");
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Event Filter */}
          <Select
            value={selectedEventId}
            onValueChange={(val) => {
              setSelectedEventId(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs truncate">
              <SelectValue placeholder="All Events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {events
                .filter((ev) => selectedCategoryId === "all" || ev.categoryId === selectedCategoryId)
                .map((ev) => (
                  <SelectItem key={ev.id} value={ev.id}>
                    {ev.name}
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
            <p className="text-xs text-muted-foreground">Loading registrations...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Calendar className="size-10 mx-auto text-muted-foreground/40" />
            <h3 className="text-sm font-semibold">No registrations found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {hasActiveFilters
                ? "Try clearing or adjusting your search filters above."
                : "No attendee registrations have been created yet."}
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
                  <TableHead className="font-semibold">Reg Number</TableHead>
                  <TableHead className="font-semibold">Participant</TableHead>
                  <TableHead className="font-semibold">Event</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Payment</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg) => (
                  <TableRow key={reg.id} className="text-xs hover:bg-muted/30">
                    {/* Reg Number */}
                    <TableCell className="font-mono font-medium text-foreground whitespace-nowrap">
                      {reg.registrationNumber}
                    </TableCell>

                    {/* Participant */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium text-foreground">{reg.fullName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {reg.email} • {reg.phone}
                        </p>
                      </div>
                    </TableCell>

                    {/* Event */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium text-foreground">{reg.event.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {reg.event.category?.name || "General"}
                        </p>
                      </div>
                    </TableCell>

                    {/* Type & Team */}
                    <TableCell>
                      {reg.team ? (
                        <Badge variant="secondary" className="text-[10px] gap-1 font-normal">
                          <Users className="size-3" /> {reg.team.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">Solo</span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          reg.status === "CONFIRMED"
                            ? "border-green-500 text-green-600 bg-green-50/60 dark:bg-green-950/30"
                            : reg.status === "PENDING"
                            ? "border-yellow-500 text-yellow-600 bg-yellow-50/60 dark:bg-yellow-950/30"
                            : reg.status === "CANCELLED"
                            ? "border-red-500 text-red-600 bg-red-50/60 dark:bg-red-950/30"
                            : "border-rose-500 text-rose-600 bg-rose-50/60 dark:bg-rose-950/30"
                        }
                      >
                        {reg.status}
                      </Badge>
                    </TableCell>

                    {/* Payment */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <span
                          className={`font-medium ${
                            reg.payment?.status === "SUCCESS"
                              ? "text-green-600"
                              : "text-amber-600"
                          }`}
                        >
                          {reg.payment?.status === "SUCCESS" ? "Paid" : "Pending"}
                        </span>
                        <p className="text-[10px] text-muted-foreground">
                          ₹{reg.payment?.amount ?? reg.event.fee}
                        </p>
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {new Date(reg.createdAt).toLocaleDateString("en-IN", {
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
                            setActiveReg(reg);
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
                                setActiveReg(reg);
                                setIsDetailOpen(true);
                              }}
                            >
                              <Eye className="size-3.5 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {reg.status !== "CONFIRMED" && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(reg.id, "CONFIRMED")}
                                className="text-green-600 focus:text-green-600"
                              >
                                <CheckCircle className="size-3.5 mr-2" /> Mark Confirmed
                              </DropdownMenuItem>
                            )}
                            {reg.status !== "CANCELLED" && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(reg.id, "CANCELLED")}
                                className="text-amber-600 focus:text-amber-600"
                              >
                                <XCircle className="size-3.5 mr-2" /> Mark Cancelled
                              </DropdownMenuItem>
                            )}
                            {reg.status !== "REJECTED" && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(reg.id, "REJECTED")}
                                className="text-rose-600 focus:text-rose-600"
                              >
                                <Ban className="size-3.5 mr-2" /> Mark Rejected
                              </DropdownMenuItem>
                            )}

                            {/* Delete — Admin only */}
                            {isAdmin && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteRegistration(reg)}
                                  className="text-destructive focus:text-destructive"
                                  disabled={
                                    reg.status === "CONFIRMED" ||
                                    reg.payment?.status === "SUCCESS"
                                  }
                                >
                                  <Trash2 className="size-3.5 mr-2" /> Delete Record
                                </DropdownMenuItem>
                              </>
                            )}
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
      <RegistrationDetailModal
        registration={activeReg}
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) onClearSelectedReg?.();
        }}
        isAdmin={isAdmin}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteRegistration}
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
