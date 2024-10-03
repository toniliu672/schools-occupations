"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FadeIn, Button, ThemeToggle, BackgroundScene } from "@/components";

export default function Home() {
  const [isZooming, setIsZooming] = useState(false);
  const router = useRouter();

  const handleMulai = () => {
    setIsZooming(true);
    // Mengatur delay sebelum berpindah ke halaman peta
    setTimeout(() => {
      router.push("/peta");
    }, 1000); // delay pindah halaman untuk memberi waktu zoom animasi
  };

  return (
    <FadeIn>
      <div className="fixed inset-0 overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <motion.div
          className="w-full h-full relative flex flex-col items-center justify-center"
          animate={{
            // Mengatur tingkat zoom
            // Tingkatkan nilai ini untuk zoom out lebih jauh, atau kurangi untuk zoom out lebih dekat
            scale: isZooming ? 10 : 1,
            opacity: isZooming ? 0 : 1,
          }}
          // Mengatur kecepatan dan jenis transisi zoom
          // Sesuaikan 'duration' untuk mengubah kecepatan zoom (dalam detik)
          transition={{ duration: .8, ease: "easeInOut" }}
        >
          <BackgroundScene />

          <AnimatePresence>
            {!isZooming && (
              <motion.div
                className="z-10 text-center px-4 sm:px-6 lg:px-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                  Peta Okupasi
                </h1>
                <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-200 mb-8 transition-colors duration-300">
                  Telusuri Okupasi SMK di Minahasa Sulawesi Utara
                </p>
                <Button
                  variant="outline"
                  size="large"
                  onClick={handleMulai}
                  className="px-8 py-3 text-lg font-semibold rounded-full border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300"
                >
                  Mulai
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <div className="fixed bottom-4 right-4 flex items-center space-x-4 z-20">
          <ThemeToggle />
        </div>
      </div>
    </FadeIn>
  );
}