import { IdeaChat } from "@/components/chat/idea-chat";

export default function Home() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">
          Validate your startup idea
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">
          Answer guided prompts to generate a structured validation report with market, competitor,
          pricing, roadmap, and investor sections.
        </p>
      </div>
      <IdeaChat />
    </div>
  );
}
