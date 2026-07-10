"use client";

import React, { useEffect, useState } from "react";
import { Heading, Text } from "@/components/ui/typography";
import { useAuth } from "@/features/auth";
import { mockUser } from "@/features/auth/mock/user";

export function WelcomeBanner() {
  const { user, isAuthenticated } = useAuth();
  const [greeting, setGreeting] = useState("Hello");

  const activeUser = isAuthenticated && user ? {
    firstName: user.firstName || user.name?.split(" ")[0] || "Candidate",
  } : {
    firstName: mockUser.name.split(" ")[0] || "Anshul",
  };

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="bg-surface border-[3px] border-border p-5 md:p-6 brutal-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full min-w-0">
      <div className="space-y-1">
        <Heading level="h2" className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
          {greeting}, {activeUser.firstName} 👋
        </Heading>
        <Text className="text-foreground-secondary text-sm font-medium leading-relaxed">
          Let&apos;s get you one step closer to your dream job.
        </Text>
      </div>

      <div className="md:text-right shrink-0">
        <p className="text-xs uppercase font-extrabold tracking-widest text-foreground-muted">Current Session Date</p>
        <p className="font-mono text-xs font-bold text-primary mt-0.5 bg-surface-secondary border-2 border-border px-2.5 py-1 inline-block brutal-shadow-sm">
          {formattedDate}
        </p>
      </div>
    </div>
  );
}
