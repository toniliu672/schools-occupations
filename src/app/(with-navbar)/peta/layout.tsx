"use client";

import { useState, useEffect } from 'react';
import { FadeIn, Sidebar, Loading } from "@/components";
import React from 'react';

export default function PetaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust this time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <FadeIn>
      <div className="flex flex-col h-screen">
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <Loading size={60} className="p-4" />
            </div>
          ) : (
            <>
              <main className="absolute inset-0 z-30">{children}</main>
              <Sidebar
                initiallyExpanded={true}
                className="z-40"
                children={undefined}
              />
            </>
          )}
        </div>
      </div>
    </FadeIn>
  );
}