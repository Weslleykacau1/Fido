"use client";

import { PawPrint, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-[600px] w-full max-w-md mx-auto">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="mb-6"
      >
        <PawPrint className="h-20 w-20 text-primary" />
      </motion.div>
      <div className="flex items-center text-lg font-headline text-muted-foreground">
        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
        Carregando...
      </div>
    </div>
  );
}
