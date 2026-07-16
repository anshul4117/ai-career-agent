"use client";

import React, { useEffect } from "react";
import { AlertOctagon } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Fatal Root App Crash caught by GlobalError:", error);
  }, [error]);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <html lang="en" className="dark">
      <head>
        <title>Fatal Application Error</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#0d1117] text-[#c9d1d9] font-sans antialiased px-4 text-center select-none">
        <div className="max-w-md w-full border-[3px] border-[#30363d] bg-[#161b22] p-8 rounded-sm shadow-[8px_8px_0px_0px_#000] space-y-6">
          <div className="inline-flex p-3 bg-red-500/10 border-2 border-red-500 text-red-400 rounded-sm mx-auto">
            <AlertOctagon className="h-12 w-12 stroke-[2.5px]" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl font-black uppercase tracking-tight text-white leading-none">
              Fatal System Crash
            </h1>
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
              Something went wrong globally
            </h3>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed font-semibold max-w-xs mx-auto">
            A fatal layout or rendering crash occurred in the core layer of the application. The system was forced to stop to protect your session.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => reset()}
              className="h-10 px-5 text-xs font-black uppercase tracking-wider bg-white text-black border-2 border-black active:translate-x-0 active:translate-y-0 active:shadow-none hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all shadow-[4px_4px_0px_0px_#000] rounded-sm flex items-center justify-center gap-1.5"
            >
              Try Recovery
            </button>
            <button
              onClick={handleReload}
              className="h-10 px-5 text-xs font-black uppercase tracking-wider bg-transparent text-white border-2 border-[#30363d] hover:bg-[#21262d] transition-colors rounded-sm flex items-center justify-center gap-1.5"
            >
              Reload App
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
