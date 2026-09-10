import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiGet } from "@/lib/api";
import { useNavigate } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminOverviewTab } from "@/components/admin/AdminOverviewTab";
import { AdminRegistrationsTab } from "@/components/admin/AdminRegistrationsTab";
import { AdminPassesTab } from "@/components/admin/AdminPassesTab";
import type {
  AdminOverviewStats,
  AdminRegistration,
  AdminPassPurchase,
  Category,
  AdminEvent,
  AdminPass,
} from "@/types/admin";
import {
  LayoutDashboard,
  Users,
  Ticket,
  User,
  Mail,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

interface ParticipantRegistration {
  id: string;
  registrationNumber: string;
  status: string;
  participantCategory: string;
  fullName: string;
  email: string;
  event: {
    id: string;
    name: string;
    category?: { name: string; slug: string } | null;
  };
  payment?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
  } | null;
  createdAt: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "ADMIN";
  const isOrganizer = user?.role === "ORGANIZER";
  const isPrivileged = isAdmin || isOrganizer;

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Admin Portal State
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [passes, setPasses] = useState<AdminPass[]>([]);
  const [isLoadingPortal, setIsLoadingPortal] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cross-tab selection state (e.g. clicking a recent reg in Overview opens it in Registrations tab)
  const [selectedRegForDetail, setSelectedRegForDetail] = useState<AdminRegistration | null>(null);
  const [selectedPassForDetail, setSelectedPassForDetail] = useState<AdminPassPurchase | null>(null);

  // Participant fallback state
  const [participantRegistrations, setParticipantRegistrations] = useState<ParticipantRegistration[]>([]);
  const [isLoadingParticipant, setIsLoadingParticipant] = useState(true);

  // Fetch admin metadata & stats
  const fetchAdminData = useCallback(async () => {
    if (!isPrivileged) return;
    try {
      const [statsRes, catRes, eventRes, passRes] = await Promise.all([
        apiGet<{ status: string; data: AdminOverviewStats }>("/admin/overview"),
        apiGet<{ status: string; data: { categories: Category[] } }>("/categories"),
        apiGet<{ status: string; data: { events: AdminEvent[] } }>("/events"),
        isAdmin
          ? apiGet<{ status: string; data: { passes: AdminPass[] } }>("/passes")
          : Promise.resolve({ data: { passes: [] } }),
      ]);

      setStats(statsRes.data);
      setCategories(catRes.data.categories || []);
      setEvents(eventRes.data.events || []);
      if (isAdmin && passRes.data?.passes) {
        setPasses(passRes.data.passes);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load admin overview data");
    } finally {
      setIsLoadingPortal(false);
      setIsRefreshing(false);
    }
  }, [isPrivileged, isAdmin]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAdminData();
  };

  // Participant registration fetch
  useEffect(() => {
    if (isPrivileged) {
      fetchAdminData();
    } else {
      apiGet<{ status: string; data: { registrations: ParticipantRegistration[] } }>(
        "/registrations/my-registrations"
      )
        .then((res) => {
          setParticipantRegistrations(res.data.registrations);
        })
        .catch((err) => {
          console.error("Failed to load participant registrations:", err);
        })
        .finally(() => {
          setIsLoadingParticipant(false);
        });
    }
  }, [isPrivileged, fetchAdminData]);

  // Helper from Overview to jump to Registration detail
  const handleViewRegistrationFromOverview = (reg: AdminRegistration) => {
    setSelectedRegForDetail(reg);
    setActiveTab("registrations");
  };

  // Helper from Overview to jump to Pass detail
  const handleViewPassFromOverview = (purchase: AdminPassPurchase) => {
    if (!isAdmin) return;
    setSelectedPassForDetail(purchase);
    setActiveTab("passes");
  };

  // If Participant, render standard participant view
  if (!isPrivileged) {
    return (
      <main className="min-h-screen bg-background px-6 py-10 text-foreground">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Attendee Workspace</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                Welcome{user?.name ? `, ${user.name}` : ""}
              </h1>
            </div>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer gap-2 self-start"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </header>

          {/* Profile Card */}
          {user && (
            <Card className="border-border/70 shadow-none">
              <CardHeader>
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="size-5" />
                </div>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="size-4" />
                  <span>{user.name}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-4" />
                  <span>{user.email}</span>
                </div>
                {user.participantCategory && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="size-4" />
                    <span>{user.participantCategory}</span>
                  </div>
                )}
                {user.collegeName && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="size-4" />
                    <span>{user.collegeName}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Participant Registrations */}
          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <LayoutDashboard className="size-5" />
              </div>
              <CardTitle>My Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingParticipant ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : participantRegistrations.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="size-10 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No registrations yet. Browse events to get started!
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
                    Browse Events
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {participantRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border/60 bg-muted/30"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{reg.event.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {reg.registrationNumber}
                          {reg.event.category && ` • ${reg.event.category.name}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Registered{" "}
                          {new Date(reg.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {reg.payment && (
                          <span className="text-xs text-muted-foreground">
                            ₹{reg.payment.amount}
                          </span>
                        )}
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full border">
                          {reg.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Admin & Organizer Portal View
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Admin Header */}
      <AdminHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      {/* Main Portal Body */}
      <main className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
        {isLoadingPortal ? (
          <div className="py-32 flex flex-col items-center justify-center gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading Admin Portal...</p>
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);
              // Clear cross-tab selections when navigating tabs
              setSelectedRegForDetail(null);
              setSelectedPassForDetail(null);
            }}
            className="space-y-6"
          >
            {/* Tabs List — Strictly Role-Aware: Passes hidden for Organizers */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <TabsList className="bg-muted/60 p-1 h-auto flex-wrap">
                <TabsTrigger value="overview" className="gap-2 text-xs py-1.5 px-3">
                  <LayoutDashboard className="size-3.5" />
                  Overview
                </TabsTrigger>

                <TabsTrigger value="registrations" className="gap-2 text-xs py-1.5 px-3">
                  <Users className="size-3.5" />
                  Event Registrations
                  {stats && (
                    <span className="ml-1 text-[10px] bg-background/80 px-1.5 py-0.2 rounded-full border">
                      {stats.totalRegistrations}
                    </span>
                  )}
                </TabsTrigger>

                {/* Festival Passes: STRICTLY ADMIN ONLY */}
                {isAdmin && (
                  <TabsTrigger value="passes" className="gap-2 text-xs py-1.5 px-3">
                    <Ticket className="size-3.5" />
                    Festival Passes
                    {stats && (
                      <span className="ml-1 text-[10px] bg-background/80 px-1.5 py-0.2 rounded-full border">
                        {stats.totalPassPurchases}
                      </span>
                    )}
                  </TabsTrigger>
                )}

                <TabsTrigger value="profile" className="gap-2 text-xs py-1.5 px-3">
                  <User className="size-3.5" />
                  Admin Profile
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab 1: Overview */}
            <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
              <AdminOverviewTab
                stats={stats}
                isAdmin={isAdmin}
                onSelectTab={setActiveTab}
                onViewRegistration={handleViewRegistrationFromOverview}
                onViewPassPurchase={handleViewPassFromOverview}
              />
            </TabsContent>

            {/* Tab 2: Registrations */}
            <TabsContent value="registrations" className="mt-0 focus-visible:outline-none">
              <AdminRegistrationsTab
                isAdmin={isAdmin}
                categories={categories}
                events={events}
                selectedRegForDetail={selectedRegForDetail}
                onClearSelectedReg={() => setSelectedRegForDetail(null)}
                onDataChanged={fetchAdminData}
              />
            </TabsContent>

            {/* Tab 3: Festival Passes (STRICTLY ADMIN ONLY) */}
            {isAdmin && (
              <TabsContent value="passes" className="mt-0 focus-visible:outline-none">
                <AdminPassesTab
                  isAdmin={isAdmin}
                  passes={passes}
                  selectedPassForDetail={selectedPassForDetail}
                  onClearSelectedPass={() => setSelectedPassForDetail(null)}
                  onDataChanged={fetchAdminData}
                />
              </TabsContent>
            )}

            {/* Tab 4: Admin Profile */}
            <TabsContent value="profile" className="mt-0 focus-visible:outline-none">
              <div className="max-w-2xl space-y-6">
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground block">Name</span>
                        <span className="font-medium text-foreground">{user?.name}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Email</span>
                        <span className="font-medium text-foreground">{user?.email}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Role</span>
                        <span className="font-medium text-primary">{user?.role}</span>
                      </div>
                      {user?.phone && (
                        <div>
                          <span className="text-xs text-muted-foreground block">Phone</span>
                          <span className="text-foreground">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
