"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export const BudgetOptimizationAnimation = () => {
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Animated Budget Bars */}
        <div className="relative w-full max-w-sm space-y-4 p-8">
          <div className="text-center mb-6">
            <div className="text-2xl font-semibold text-primary">
              Budget Optimization
            </div>
            <div className="text-sm text-muted-foreground">
              AI-Powered Recommendations
            </div>
          </div>

          {/* Budget Categories */}
          {[
            {
              name: "Food",
              current: 75,
              optimized: 60,
              color: "bg-blue-500",
            },
            {
              name: "Transport",
              current: 40,
              optimized: 35,
              color: "bg-green-500",
            },
            {
              name: "Entertainment",
              current: 90,
              optimized: 70,
              color: "bg-purple-500",
            },
            {
              name: "Shopping",
              current: 85,
              optimized: 65,
              color: "bg-orange-500",
            },
          ].map((category, index) => (
            <div key={category.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-primary">{category.name}</span>
                <span className="text-muted-foreground">
                  ${category.optimized}%
                </span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={cn(category.color, "h-full rounded-full")}
                  initial={{ width: `${category.current}%` }}
                  animate={{ width: `${category.optimized}%` }}
                  transition={{
                    duration: 1.5,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>
          ))}

          <div className="mt-6 p-3 bg-accent rounded-lg">
            <div className="text-sm text-center">
              <span className="text-secondary font-semibold">+$280</span>
              <span className="text-muted-foreground"> saved this month</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const SpendingInsightsAnimation = () => {
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Spending Pattern Visualization */}
        <div className="relative w-full max-w-sm p-8">
          <div className="text-center mb-6">
            <div className="text-2xl font-semibold text-primary">
              Spending Insights
            </div>
            <div className="text-sm text-muted-foreground">
              Behavioral Pattern Analysis
            </div>
          </div>

          {/* Central Node */}
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
              <div className="text-white font-bold text-sm">YOU</div>
            </div>

            {/* Orbiting Spending Categories */}
            {[
              {
                name: "Coffee",
                angle: 0,
                distance: 60,
                size: 12,
                color: "bg-yellow-500",
              },
              {
                name: "Groceries",
                angle: 72,
                distance: 70,
                size: 16,
                color: "bg-green-500",
              },
              {
                name: "Gas",
                angle: 144,
                distance: 65,
                size: 14,
                color: "bg-red-500",
              },
              {
                name: "Dining",
                angle: 216,
                distance: 75,
                size: 18,
                color: "bg-blue-500",
              },
              {
                name: "Shopping",
                angle: 288,
                distance: 55,
                size: 10,
                color: "bg-purple-500",
              },
            ].map((item, index) => (
              <motion.div
                key={item.name}
                className={cn(
                  item.color,
                  "absolute rounded-full flex items-center justify-center text-white text-xs font-medium"
                )}
                style={{
                  width: `${item.size}px`,
                  height: `${item.size}px`,
                  left: `calc(50% + ${Math.cos((item.angle * Math.PI) / 180) * item.distance}px)`,
                  top: `calc(50% + ${Math.sin((item.angle * Math.PI) / 180) * item.distance}px)`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                {item.name.slice(0, 3)}
              </motion.div>
            ))}

            {/* Connecting Lines */}
            {[0, 72, 144, 216, 288].map((angle, index) => (
              <motion.div
                key={angle}
                className="absolute w-px bg-border opacity-30"
                style={{
                  height: "80px",
                  left: "50%",
                  top: "50%",
                  transformOrigin: "0 0",
                  transform: `rotate(${angle}deg)`,
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.5 + index * 0.05,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          <div className="mt-8 text-center space-y-2">
            <div className="text-sm text-secondary font-semibold">
              Pattern Detected
            </div>
            <div className="text-xs text-muted-foreground">
              You spend 40% more on weekends
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
