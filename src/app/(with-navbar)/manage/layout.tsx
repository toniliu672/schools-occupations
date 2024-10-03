"use client";
import { BackgroundScene } from "@/components";
import { FadeIn } from "@/components";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden ">
      {/* <BackgroundScene /> */}
      <FadeIn>
        <div className="container mx-auto p-4">{children}</div>
      </FadeIn>
    </div>
  );
}
