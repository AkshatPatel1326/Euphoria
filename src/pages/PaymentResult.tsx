import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Navbar } from "@/components/euphoria/Navbar";
import { Footer } from "@/components/euphoria/Footer";
import { SmoothCursor } from "@/components/magicui/smooth-cursor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Ticket,
  ArrowRight,
  RotateCcw,
  Home,
  ShieldCheck,
} from "lucide-react";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = (searchParams.get("status") || "unknown").toLowerCase();
  const txnid = searchParams.get("txnid") || "";
  const type = searchParams.get("type") || "REGISTRATION";
  const number = searchParams.get("number") || "";
  const errorMsg = searchParams.get("error") || "";

  // Reset scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const isSuccess = status === "success";
  const isCancelled = status === "cancelled" || status === "usercancelled";
  const isFailed = status === "failed" || !isSuccess && !isCancelled;

  return (
    <div className="min-h-screen bg-euphoria-dark text-white flex flex-col selection:bg-euphoria-aqua/30 selection:text-white">
      <SmoothCursor />
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full flex items-center justify-center">
        <div className="w-full glass-card rounded-2xl p-6 sm:p-10 border border-white/[0.08] shadow-2xl text-center space-y-6">
          {/* Status Icon */}
          {isSuccess && (
            <div className="size-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 animate-in zoom-in-50 duration-500">
              <CheckCircle2 className="size-10" />
            </div>
          )}

          {isCancelled && (
            <div className="size-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 animate-in zoom-in-50 duration-500">
              <AlertTriangle className="size-10" />
            </div>
          )}

          {isFailed && (
            <div className="size-20 rounded-full bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 animate-in zoom-in-50 duration-500">
              <XCircle className="size-10" />
            </div>
          )}

          {/* Heading & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {isSuccess && "Payment Confirmed!"}
              {isCancelled && "Payment Cancelled"}
              {isFailed && "Payment Unsuccessful"}
            </h1>
            <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
              {isSuccess &&
                "Your payment was processed successfully. Your registration is confirmed and ready."}
              {isCancelled &&
                "The transaction was cancelled on the checkout page. Your registration is saved as pending and you can complete payment anytime."}
              {isFailed &&
                (errorMsg ||
                  "The bank or payment gateway was unable to complete the transaction. You can retry payment anytime.")}
            </p>
          </div>

          {/* Transaction Metadata Card */}
          {(txnid || number) && (
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-xs space-y-2.5 max-w-md mx-auto text-left">
              {number && (
                <div className="flex items-center justify-between">
                  <span className="text-white/45">
                    {type === "PASS" ? "Pass Number:" : "Registration Number:"}
                  </span>
                  <span className="font-mono font-semibold text-euphoria-aqua">{number}</span>
                </div>
              )}
              {txnid && (
                <div className="flex items-center justify-between">
                  <span className="text-white/45">Transaction ID:</span>
                  <span className="font-mono text-white/80">{txnid}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-white/45">Payment Status:</span>
                <Badge
                  variant="outline"
                  className={
                    isSuccess
                      ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                      : isCancelled
                      ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                      : "border-rose-500/30 text-rose-400 bg-rose-500/10"
                  }
                >
                  {status.toUpperCase()}
                </Badge>
              </div>
            </div>
          )}

          {/* Guidance / Next Steps */}
          {isSuccess && (
            <div className="p-3.5 rounded-xl bg-euphoria-aqua/10 border border-euphoria-aqua/20 text-xs text-euphoria-aqua/90 flex items-center justify-center gap-2 max-w-md mx-auto">
              <ShieldCheck className="size-4 shrink-0 text-euphoria-aqua" />
              <span>A confirmation email has been sent to your registered address.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            {isSuccess && (
              <>
                <Button
                  className="w-full sm:w-auto bg-euphoria-aqua text-black hover:bg-euphoria-aqua/90 font-semibold gap-2"
                  onClick={() => navigate("/my-registrations")}
                >
                  <Ticket className="size-4" /> View My Tickets
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 gap-1.5"
                  onClick={() => navigate("/")}
                >
                  <Home className="size-4" /> Home
                </Button>
              </>
            )}

            {!isSuccess && (
              <>
                <Button
                  className="w-full sm:w-auto bg-euphoria-aqua text-black hover:bg-euphoria-aqua/90 font-semibold gap-2"
                  onClick={() => navigate("/my-registrations")}
                >
                  <RotateCcw className="size-4" /> Access / Retry in My Tickets
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 gap-1.5"
                  onClick={() => navigate("/")}
                >
                  <Home className="size-4" /> Browse Events
                </Button>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
