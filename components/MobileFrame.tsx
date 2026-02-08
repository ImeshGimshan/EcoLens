import React from "react";

interface MobileFrameProps {
  children: React.ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-gray-100">
      <div className="w-full max-w-md bg-eggshell min-h-screen relative shadow-2xl flex flex-col">
        {children}
      </div>
    </div>
  );
}
