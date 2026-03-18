"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoredReports } from "@/lib/local-store";
import { cn } from "@/lib/utils";
import type { GeneratedReport } from "@/lib/types";

export function ReportsList() {
  const [reports] = useState<GeneratedReport[]>(() => getStoredReports());

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">Reports</h1>
        <p className="text-sm text-white/75">Validation reports generated from your idea sessions.</p>
      </div>

      {reports.length === 0 ? (
        <Card className="border-white/15 bg-[#0f2d44]/80 text-white">
          <CardContent className="pt-6 text-sm text-white/75">
            No reports yet. Generate one from the chat page.
          </CardContent>
        </Card>
      ) : (
        reports.map((report) => (
          <Card key={report.id} className="border-white/15 bg-[#0f2d44]/80 text-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3 text-lg">
                <span className="truncate">Report {report.id.slice(0, 8)}</span>
                <Badge variant="secondary">Score {report.viabilityScore}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-white/85">{report.summary}</p>
              <Link
                href={`/reports/${report.id}`}
                className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
              >
                Open report
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
