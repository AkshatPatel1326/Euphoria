import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ShieldAlert, RefreshCw, ExternalLink, LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

interface AdminHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AdminHeader({ onRefresh, isRefreshing = false }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="border-b border-border/60 bg-card/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
            <Sparkles className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Euphoria Admin Portal
              </h1>
              <Badge
                variant={isAdmin ? "default" : "secondary"}
                className={`text-[11px] font-semibold tracking-wide ${
                  isAdmin
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {user?.role || "PORTAL"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Logged in as <span className="font-medium text-foreground">{user?.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {onRefresh && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="gap-1.5 text-xs h-8"
            >
              <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-1.5 text-xs h-8 text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="size-3.5" />
            Website
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="gap-1.5 text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <LogOut className="size-3.5" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
