import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminOverviewStats, AdminRegistration, AdminPassPurchase } from "@/types/admin";
import {
  Users,
  Ticket,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface AdminOverviewTabProps {
  stats: AdminOverviewStats | null;
  isAdmin: boolean;
  onSelectTab: (tab: string) => void;
  onViewRegistration: (reg: AdminRegistration) => void;
  onViewPassPurchase: (purchase: AdminPassPurchase) => void;
}

export function AdminOverviewTab({
  stats,
  isAdmin,
  onSelectTab,
  onViewRegistration,
  onViewPassPurchase,
}: AdminOverviewTabProps) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registrations */}
        <Card className="border-border/60 shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Event Registrations
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {stats.totalRegistrations}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600 font-medium">
                <CheckCircle className="size-3 mr-0.5" />
                {stats.registrationsByStatus.confirmed} confirmed
              </span>
              <span>•</span>
              <span className="inline-flex items-center text-amber-600 font-medium">
                <Clock className="size-3 mr-0.5" />
                {stats.registrationsByStatus.pending} pending
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Festival Passes — Admin Only */}
        {isAdmin && (
          <Card className="border-border/60 shadow-sm hover:shadow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Festival Passes Sold
              </CardTitle>
              <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                <Ticket className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">
                {stats.totalPassPurchases}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center text-green-600 font-medium">
                  <CheckCircle className="size-3 mr-0.5" />
                  {stats.passesByStatus.confirmed} confirmed
                </span>
                <span>•</span>
                <span className="inline-flex items-center text-amber-600 font-medium">
                  <Clock className="size-3 mr-0.5" />
                  {stats.passesByStatus.pending} pending
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Total Revenue */}
        <Card className="border-border/60 shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <IndianRupee className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              From completed & successful payments
            </p>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card className="border-border/60 shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Actions
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {stats.registrationsByStatus.pending + (isAdmin ? stats.passesByStatus.pending : 0)}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Awaiting confirmation or verification
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories & Registrations Breakdown */}
      {stats.registrationsByCategory && stats.registrationsByCategory.length > 0 && (
        <Card className="border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" /> Category Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Registration volume across Euphoria event categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.registrationsByCategory.map((cat) => {
                const percentage =
                  stats.totalRegistrations > 0
                    ? Math.round((cat.count / stats.totalRegistrations) * 100)
                    : 0;
                return (
                  <div
                    key={cat.id}
                    className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground truncate">{cat.name}</span>
                      <Badge variant="secondary" className="text-[11px]">
                        {cat.count}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-right">{percentage}%</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Activity Tables */}
      <div className={`grid grid-cols-1 ${isAdmin ? "lg:grid-cols-2" : ""} gap-6`}>
        {/* Recent Registrations */}
        <Card className="border-border/60 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Recent Registrations</CardTitle>
              <CardDescription className="text-xs">Latest event sign-ups</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectTab("registrations")}
              className="text-xs gap-1 text-primary hover:text-primary/80"
            >
              View all <ArrowRight className="size-3" />
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentRegistrations.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No registrations recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {stats.recentRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground truncate">
                          {reg.fullName}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {reg.registrationNumber}
                        </span>
                      </div>
                      <p className="text-muted-foreground truncate">
                        {reg.event?.name}
                        {reg.team && ` (${reg.team.name})`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={
                          reg.status === "CONFIRMED"
                            ? "border-green-500 text-green-600 bg-green-50/50"
                            : reg.status === "PENDING"
                            ? "border-yellow-500 text-yellow-600 bg-yellow-50/50"
                            : "border-muted text-muted-foreground"
                        }
                      >
                        {reg.status}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        onClick={() => onViewRegistration(reg)}
                        title="View details"
                      >
                        <Eye className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Pass Purchases — Admin Only */}
        {isAdmin && (
          <Card className="border-border/60 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Recent Pass Purchases</CardTitle>
                <CardDescription className="text-xs">Latest festival pass orders</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectTab("passes")}
                className="text-xs gap-1 text-primary hover:text-primary/80"
              >
                View all <ArrowRight className="size-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {stats.recentPassPurchases.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No pass purchases recorded yet.
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {stats.recentPassPurchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="py-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground truncate">
                            {purchase.fullName}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {purchase.passNumber}
                          </span>
                        </div>
                        <p className="text-muted-foreground truncate">
                          {purchase.pass?.name} • Qty: {purchase.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="outline"
                          className={
                            purchase.status === "CONFIRMED"
                              ? "border-green-500 text-green-600 bg-green-50/50"
                              : purchase.status === "PENDING"
                              ? "border-yellow-500 text-yellow-600 bg-yellow-50/50"
                              : "border-muted text-muted-foreground"
                          }
                        >
                          {purchase.status}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          onClick={() => onViewPassPurchase(purchase)}
                          title="View details"
                        >
                          <Eye className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
