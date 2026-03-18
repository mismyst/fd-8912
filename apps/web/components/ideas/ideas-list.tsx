"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoredIdeas } from "@/lib/local-store";
import type { CreatedIdea } from "@/lib/types";

export function IdeasList() {
  const [ideas] = useState<CreatedIdea[]>(() => getStoredIdeas());

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">Ideas</h1>
        <p className="text-sm text-white/75">Recent ideas captured from the chat intake flow.</p>
      </div>

      {ideas.length === 0 ? (
        <Card className="border-white/15 bg-[#0f2d44]/80 text-white">
          <CardContent className="pt-6 text-sm text-white/75">
            No ideas yet. Submit one from the chat page.
          </CardContent>
        </Card>
      ) : (
        ideas.map((idea) => (
          <Card key={idea.id} className="border-white/15 bg-[#0f2d44]/80 text-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3 text-lg">
                <span>{idea.ideaTitle}</span>
                <Badge variant="secondary">{idea.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-white/85 md:grid-cols-2">
              <p>
                <span className="font-medium text-white">Market:</span> {idea.targetMarket}
              </p>
              <p>
                <span className="font-medium text-white">Segment:</span> {idea.customerSegment}
              </p>
              <p className="md:col-span-2">
                <span className="font-medium text-white">Problem:</span> {idea.problemDescription}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
