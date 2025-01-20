import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  children: React.ReactNode;
  swipeProgress: number;
  className?: string;
  selectedDate: Date;
}

export function HabitCard({ children, swipeProgress, selectedDate, className }: HabitCardProps) {
  // Calculate the rotation and scale based on swipe progress
  const rotate = swipeProgress * 2; // Even smoother rotation
  const scale = Math.max(0.98, 1 - Math.abs(swipeProgress) * 0.03); // More subtle scale

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={selectedDate.toISOString()}
          initial={{ opacity: 0, x: swipeProgress < 0 ? 200 : -200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: swipeProgress < 0 ? -200 : 200 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 20,
            mass: 0.6,
          }}
          className={cn(
            "relative bg-background overflow-hidden",
            className
          )}
          style={{
            rotate,
            scale,
            x: swipeProgress * 75,
          }}
        >
          {children}

          {/* Left/Right Swipe Indicators */}
          {swipeProgress !== 0 && (
            <>
              <motion.div
                className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-primary/20 to-transparent pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: swipeProgress < 0 ? Math.abs(swipeProgress) * 0.6 : 0 }}
              />
              <motion.div
                className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-primary/20 to-transparent pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: swipeProgress > 0 ? Math.abs(swipeProgress) * 0.6 : 0 }}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 