"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getReport } from "@/lib/api";
import { getStoredReports } from "@/lib/local-store";
import type { GeneratedReport } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ReportDetailProps = {
  reportId: string;
};

export function ReportDetail({ reportId }: ReportDetailProps) {
  const [report, setReport] = useState<GeneratedReport | null>(() =>
    getStoredReports().find((entry) => entry.id === reportId) ?? null
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (report) {
      return;
    }

    getReport(reportId)
      .then((payload) => setReport(payload))
      .catch(() => setError("Could not load this report."));
  }, [report, reportId]);

  if (error) {
    return (
      <Card className="border-white/15 bg-[#0f2d44]/80 text-white">
        <CardContent className="space-y-3 pt-6">
          <p className="text-sm text-amber-200">{error}</p>
          <Link href="/reports" className={buttonVariants({ variant: "outline" })}>
            Back to reports
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card className="border-white/15 bg-[#0f2d44]/80 text-white">
        <CardContent className="space-y-3 pt-6">
          <Skeleton className="h-6 w-40 bg-white/20" />
          <Skeleton className="h-24 w-full bg-white/20" />
          <Skeleton className="h-24 w-full bg-white/20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-white">Report {report.id.slice(0, 8)}</h1>
        <Badge variant="secondary">Viability {report.viabilityScore}</Badge>
      </div>

      <Card className="border-white/15 bg-[#0f2d44]/80 text-white">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-white/85">{report.summary}</CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-white/15 bg-[#0f2d44]/80 text-white">
          <CardHeader>
            <CardTitle>Market</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/85">{report.sections.market}</CardContent>
        </Card>

        <Card className="border-white/15 bg-[#0f2d44]/80 text-white">
          <CardHeader>
            <CardTitle>Competitors</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/85">{report.sections.competitors}</CardContent>
        </Card>

        <Card className="border-white/15 bg-[#0f2d44]/80 text-white">
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/85">{report.sections.pricing}</CardContent>
        </Card>

        <Card className="border-white/15 bg-[#0f2d44]/80 text-white">
          <CardHeader>
            <CardTitle>MVP Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/85">{report.sections.roadmap}</CardContent>
        </Card>
      </div>

      <Card className="border-white/15 bg-[#0f2d44]/80 text-white">
        <CardHeader>
          <CardTitle>Investor Pitch</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-white/85">{report.sections.investorPitch}</CardContent>
      </Card>

      <Link href="/reports" className={cn(buttonVariants({ variant: "outline" }), "w-fit")}>
        Back to reports
      </Link>
    </div>
  );
}
