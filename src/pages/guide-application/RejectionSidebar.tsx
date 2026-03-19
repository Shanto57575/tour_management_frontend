import { useState } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";
import type { IGuideApplication } from "@/redux/features/guide/guide.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RejectedHistoryEntry } from "./types";
import { findLatestRejectedReason } from "./utils";

interface Props {
  allRejectedHistory: RejectedHistoryEntry[];
  reapplyTarget: IGuideApplication | undefined;
}

export function RejectionSidebar({ allRejectedHistory, reapplyTarget }: Props) {
  const [historyExpanded, setHistoryExpanded] = useState(false);

  return (
    <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
      <Card className="border-rose-200/80 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900/70 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <CardTitle className="text-sm font-semibold leading-snug">Application Rejected</CardTitle>
            </div>
            <span className="shrink-0 inline-flex items-center rounded-full bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              {allRejectedHistory.length} {allRejectedHistory.length === 1 ? "rejection" : "rejections"}
            </span>
          </div>
          <CardDescription className="text-rose-600 dark:text-rose-400 text-xs mt-1">
            Review the feedback below, fix your application, and resubmit.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-white/70 dark:bg-black/20 p-3 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-500 dark:text-rose-400">
              Latest Feedback
            </p>
            <p className="text-sm text-rose-900 dark:text-rose-100 leading-relaxed">
              {reapplyTarget ? findLatestRejectedReason(reapplyTarget) : "No feedback available"}
            </p>
          </div>

          {allRejectedHistory.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setHistoryExpanded((prev) => !prev)}
                className="w-full flex items-center justify-between gap-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition-colors py-1"
              >
                <span>
                  {historyExpanded ? "Hide" : "Show"} all {allRejectedHistory.length}{" "}
                  {allRejectedHistory.length === 1 ? "attempt" : "attempts"}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                    historyExpanded && "rotate-180",
                  )}
                />
              </button>
              {historyExpanded && (
                <div className="mt-2 space-y-2">
                  {allRejectedHistory.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="text-sm bg-white/60 dark:bg-black/20 p-3 rounded-md border border-rose-100 dark:border-rose-800/50"
                    >
                      <p className="text-xs font-semibold mb-1 text-rose-700 dark:text-rose-300">
                        Attempt {index + 1}
                      </p>
                      <p className="mb-1 text-rose-900 dark:text-rose-100">{entry.reason}</p>
                      <p className="text-xs text-rose-600/80 dark:text-rose-400/80">
                        {entry.changedAt ? new Date(entry.changedAt).toLocaleString() : "Unknown date"}
                        {entry.changedBy ? ` · ${entry.changedBy}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
