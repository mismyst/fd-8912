"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, UserRound } from "lucide-react";
import { z } from "zod";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStoredProfile, setStoredProfile } from "@/lib/local-store";
import type { SessionProfile } from "@/lib/types";

const emailSchema = z.email();

type EmailAuthProps = {
  onProfileChange?: (profile: SessionProfile | null) => void;
};

export function EmailAuth({ onProfileChange }: EmailAuthProps) {
  const [profile, setProfile] = useState<SessionProfile | null>(() => getStoredProfile());
  const [emailInput, setEmailInput] = useState(() => getStoredProfile()?.email ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    onProfileChange?.(profile);
  }, [onProfileChange, profile]);

  const initials = useMemo(() => {
    const source = profile?.email ?? "founder";
    return source.slice(0, 2).toUpperCase();
  }, [profile]);

  function saveEmail() {
    const parsed = emailSchema.safeParse(emailInput.trim());

    if (!parsed.success) {
      setError("Enter a valid email address.");
      return;
    }

    const nextProfile = { email: parsed.data };
    setStoredProfile(nextProfile);
    setProfile(nextProfile);
    setError("");
    onProfileChange?.(nextProfile);
  }

  function signOut() {
    setStoredProfile(null);
    setProfile(null);
    setEmailInput("");
    setError("");
    onProfileChange?.(null);
  }

  if (!profile) {
    return (
      <div className="flex w-full max-w-xs flex-col gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="founder@email.com"
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
            className="border-white/20 bg-white/10 text-white placeholder:text-white/60"
          />
          <Button variant="secondary" onClick={saveEmail}>
            Save
          </Button>
        </div>
        {error ? <p className="text-xs text-amber-200">{error}</p> : null}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" className="gap-2" />}>
        <Avatar className="size-6">
          <AvatarFallback className="bg-[#0f2d44] text-xs text-white">{initials}</AvatarFallback>
        </Avatar>
        <span className="max-w-36 truncate text-xs sm:text-sm">{profile.email}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2">
          <UserRound className="size-4" /> Session Profile
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="size-4" />
            <span className="truncate">{profile.email}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="outline" className="w-full" onClick={signOut}>
            Clear Email Session
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
