"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { captureLead, createIdea, getReport, queueReport } from "@/lib/api";
import {
  getStoredIdeas,
  getStoredProfile,
  getStoredReports,
  setStoredIdeas,
  setStoredReports,
} from "@/lib/local-store";
import type { CreatedIdea, GeneratedReport, IdeaInput } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const initialForm: IdeaInput = {
  ideaTitle: "",
  targetMarket: "",
  problemDescription: "",
  customerSegment: "",
};

const chatSteps: Array<{
  field: keyof IdeaInput;
  question: string;
  placeholder: string;
  multiline?: boolean;
}> = [
  {
    field: "ideaTitle",
    question: "What are you building?",
    placeholder: "AI onboarding co-pilot for product teams",
  },
  {
    field: "targetMarket",
    question: "Who is your target market?",
    placeholder: "SaaS startups with 5-50 employees",
  },
  {
    field: "problemDescription",
    question: "What painful problem are you solving?",
    placeholder:
      "Product teams struggle to turn customer interviews into testable feature hypotheses.",
    multiline: true,
  },
  {
    field: "customerSegment",
    question: "Which customer segment will you serve first?",
    placeholder: "Early-stage PM teams and founders",
  },
];

export function IdeaChat() {
  const [form, setForm] = useState<IdeaInput>(initialForm);
  const [activeStep, setActiveStep] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [lastIdea, setLastIdea] = useState<CreatedIdea | null>(null);
  const [lastReport, setLastReport] = useState<GeneratedReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const completion = useMemo(() => {
    const values = Object.values(form);
    const filled = values.filter((value) => value.trim().length > 0).length;
    return Math.round((filled / values.length) * 100);
  }, [form]);

  const isIntakeComplete = completion === 100;
  const currentStepConfig = chatSteps[activeStep] ?? null;

  const transcript = useMemo(() => {
    const messages: Array<{ role: "assistant" | "user"; content: string }> = [
      {
        role: "assistant",
        content:
          "I will collect four quick inputs and generate your startup validation report.",
      },
    ];

    for (const step of chatSteps) {
      messages.push({ role: "assistant", content: step.question });

      const answer = form[step.field].trim();
      if (answer) {
        messages.push({ role: "user", content: answer });
      } else {
        break;
      }
    }

    if (isIntakeComplete) {
      messages.push({
        role: "assistant",
        content: "Great. Your intake is complete. Generate your validation report when ready.",
      });
    }

    return messages;
  }, [form, isIntakeComplete]);

  function submitStep() {
    if (!currentStepConfig) {
      return;
    }

    const trimmed = currentAnswer.trim();
    if (!trimmed) {
      toast.error("Please answer the current question before continuing.");
      return;
    }

    setForm((prev) => ({ ...prev, [currentStepConfig.field]: trimmed }));
    setCurrentAnswer("");

    if (activeStep < chatSteps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  }

  function resetChat() {
    setForm(initialForm);
    setActiveStep(0);
    setCurrentAnswer("");
    setLastIdea(null);
    setLastReport(null);
  }

  async function onGenerate() {
    setIsGenerating(true);

    try {
      const profile = getStoredProfile();
      const createdIdea = await createIdea({
        ...form,
        userId: undefined,
      });

      const queued = await queueReport(createdIdea.id);
      const report = await getReport(queued.reportId);

      const ideas = [createdIdea, ...getStoredIdeas()];
      const reports = [report, ...getStoredReports()];
      setStoredIdeas(ideas);
      setStoredReports(reports);

      setLastIdea(createdIdea);
      setLastReport(report);

      if (profile?.email) {
        await captureLead({
          email: profile.email,
          ideaId: createdIdea.id,
        }).catch(() => null);
      }

      toast.success("Report generated", {
        description: `Viability score: ${report.viabilityScore}`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate report";
      toast.error("Generation failed", { description: message });
    } finally {
      setIsGenerating(false);
    }
  }

  async function onLeadCapture() {
    if (!leadEmail.trim()) {
      toast.error("Enter an email to continue");
      return;
    }

    try {
      await captureLead({ email: leadEmail.trim(), ideaId: lastIdea?.id });
      toast.success("Lead captured", {
        description: "You can now proceed to report download flow in Phase 4.",
      });
      setLeadEmail("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to capture lead";
      toast.error("Lead capture failed", { description: message });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Card className="border-white/15 bg-[#0f2d44]/80 text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            Idea Validation Chat
            <Badge variant="secondary" className="font-medium">
              {completion}% completed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-amber-300 transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>

          <ScrollArea className="h-[360px] rounded-lg border border-white/15 bg-[#0b2538] p-4">
            <div className="space-y-4">
              {transcript.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[92%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "assistant"
                      ? "bg-white/10 text-white"
                      : "ml-auto bg-amber-200 text-[#082135]"
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
          </ScrollArea>

          {currentStepConfig ? (
            <div className="space-y-2">
              <Label htmlFor="chatInput">Current question</Label>
              <p className="text-sm text-white/85">{currentStepConfig.question}</p>
              {currentStepConfig.multiline ? (
                <Textarea
                  id="chatInput"
                  value={currentAnswer}
                  onChange={(event) => setCurrentAnswer(event.target.value)}
                  placeholder={currentStepConfig.placeholder}
                  className="min-h-24 border-white/20 bg-white/10 text-white placeholder:text-white/65"
                />
              ) : (
                <Input
                  id="chatInput"
                  value={currentAnswer}
                  onChange={(event) => setCurrentAnswer(event.target.value)}
                  placeholder={currentStepConfig.placeholder}
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/65"
                />
              )}

              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={submitStep}>
                  Save answer <ArrowUpRight className="size-4" />
                </Button>
                <Button variant="ghost" onClick={resetChat}>
                  <RotateCcw className="mr-1 size-4" /> Reset chat
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-amber-300/35 bg-amber-200/10 p-3 text-sm text-white/90">
              Intake complete. You can generate the report now or reset and refine your idea.
            </div>
          )}

          <Button
            onClick={onGenerate}
            className="w-full bg-amber-300 text-[#082135] hover:bg-amber-200"
            disabled={isGenerating || !isIntakeComplete}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Generating Report
              </>
            ) : (
              <>
                <Sparkles className="mr-2 size-4" />
                Generate Validation Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/15 bg-[#102d45]/80 text-white">
        <CardHeader>
          <CardTitle>Latest Output</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lastReport ? (
            <>
              <div className="rounded-lg border border-amber-300/40 bg-amber-200/10 p-3">
                <p className="text-sm text-white/80">Viability Score</p>
                <p className="text-3xl font-semibold text-amber-200">{lastReport.viabilityScore}</p>
              </div>

              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="w-full bg-white/10">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="market">Market</TabsTrigger>
                  <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="mt-3 text-sm text-white/85">
                  {lastReport.summary}
                </TabsContent>
                <TabsContent value="market" className="mt-3 space-y-2 text-sm text-white/85">
                  <p>
                    <span className="font-semibold text-white">Market:</span> {lastReport.sections.market}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Competitors:</span>{" "}
                    {lastReport.sections.competitors}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Pricing:</span> {lastReport.sections.pricing}
                  </p>
                </TabsContent>
                <TabsContent value="roadmap" className="mt-3 space-y-2 text-sm text-white/85">
                  <p>
                    <span className="font-semibold text-white">MVP:</span> {lastReport.sections.roadmap}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Investor Pitch:</span>{" "}
                    {lastReport.sections.investorPitch}
                  </p>
                </TabsContent>
              </Tabs>

              <Separator className="bg-white/20" />
              <div className="space-y-2">
                <Label htmlFor="leadEmail">Unlock downloadable report</Label>
                <div className="flex gap-2">
                  <Input
                    id="leadEmail"
                    value={leadEmail}
                    onChange={(event) => setLeadEmail(event.target.value)}
                    placeholder="you@startup.com"
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/65"
                  />
                  <Button variant="secondary" onClick={onLeadCapture}>
                    Save
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-white/75">
              Complete all idea fields and generate a report. The latest result will appear here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
