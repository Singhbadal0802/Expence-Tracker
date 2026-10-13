"use client";

import React, { useState, useEffect } from "react";
import { Target, Sparkles, Trash2 } from "lucide-react";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

const DEFAULT_GOALS: Goal[] = [
  {
    id: "g-1",
    title: "Emergency Fund",
    targetAmount: 200000,
    currentAmount: 145000,
    targetDate: "2026-12-31",
    category: "Security",
  },
  {
    id: "g-2",
    title: "New Laptop",
    targetAmount: 120000,
    currentAmount: 90000,
    targetDate: "2026-11-30",
    category: "Gadgets",
  },
  {
    id: "g-3",
    title: "Holiday Vacation",
    targetAmount: 80000,
    currentAmount: 45000,
    targetDate: "2027-01-15",
    category: "Travel",
  },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("savings_goals");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return DEFAULT_GOALS;
  });

  const [isAddingGoal, setIsAddingGoal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newTarget, setNewTarget] = useState<string>("");
  const [newCurrent, setNewCurrent] = useState<string>("");
  const [newDate, setNewDate] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("savings_goals", JSON.stringify(goals));
    }
  }, [goals]);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget || Number(newTarget) <= 0) return;

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      targetAmount: Number(newTarget),
      currentAmount: Number(newCurrent) || 0,
      targetDate: newDate || "2026-12-31",
      category: "Personal",
    };

    setGoals((prev) => [newGoal, ...prev]);
    setIsAddingGoal(false);
    setNewTitle("");
    setNewTarget("");
    setNewCurrent("");
    setNewDate("");
  };

  const handleAddFunds = (goalId: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updated = Math.min(g.targetAmount, g.currentAmount + amount);
          return { ...g, currentAmount: updated };
        }
        return g;
      })
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-transparent max-w-7xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-heading2 lg:text-heading1 font-bold">Savings Goals</h1>
          <p className="text-gray-600 text-body1">
            Track and achieve your milestone savings goals
          </p>
        </div>
        <Button
          buttonLabel={isAddingGoal ? "Close Form" : "+ New Goal"}
          variant="brand-primary"
          tone="primary"
          onClick={() => setIsAddingGoal(!isAddingGoal)}
          customClass="text-opposite font-semibold"
        />
      </div>

      {/* Overview Card */}
      <div className="bg-background rounded-2xl p-6 border border-3 border-gray-200 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-warning/20 text-warning rounded-2xl">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <span className="text-caption text-gray-500 font-medium">
              Overall Savings Progress
            </span>
            <p className="text-heading1 font-bold text-foreground">
              ₹{totalSaved.toLocaleString("en-IN")}{" "}
              <span className="text-heading3 font-normal text-gray-400">
                / ₹{totalTarget.toLocaleString("en-IN")}
              </span>
            </p>
          </div>
        </div>
        <div className="w-full md:w-64">
          <div className="flex justify-between items-center mb-1 text-body2 font-semibold">
            <span>Completed</span>
            <span className="text-primary font-bold">{overallProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, overallProgress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Goal Form */}
      {isAddingGoal && (
        <form
          onSubmit={handleCreateGoal}
          className="bg-background rounded-xl p-6 border border-2 border-primary/40 shadow-lg flex flex-col gap-4 animate-in fade-in"
        >
          <h2 className="text-heading3 font-bold text-primary">Create New Goal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="e.g. New Car, Down Payment"
              inputTitle="Goal Title"
              name="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="100000"
              inputTitle="Target Amount (₹)"
              name="targetAmount"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="0"
              inputTitle="Initial Amount Saved (₹)"
              name="currentAmount"
              value={newCurrent}
              onChange={(e) => setNewCurrent(e.target.value)}
            />
            <Input
              type="date"
              placeholder=""
              inputTitle="Target Completion Date"
              name="targetDate"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsAddingGoal(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <Button
              buttonLabel="Save Goal"
              variant="brand-primary"
              tone="primary"
              customClass="text-opposite font-semibold"
              onClick={() => {}}
            />
          </div>
        </form>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress =
            goal.targetAmount > 0
              ? (goal.currentAmount / goal.targetAmount) * 100
              : 0;
          const isComplete = progress >= 100;

          return (
            <div
              key={goal.id}
              className="bg-background rounded-2xl p-6 border border-2 border-gray-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        isComplete
                          ? "bg-success/15 text-success"
                          : "bg-primary/15 text-primary"
                      }`}
                    >
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-heading3">{goal.title}</h3>
                      <span className="text-caption text-gray-400">
                        Target: {goal.targetDate}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-gray-300 hover:text-danger transition-colors p-1"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-heading2 font-bold text-foreground">
                      ₹{goal.currentAmount.toLocaleString("en-IN")}
                    </span>
                    <span className="text-body2 text-gray-400 font-medium">
                      of ₹{goal.targetAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isComplete ? "bg-success" : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-caption mt-1 text-gray-500">
                    <span>{progress.toFixed(0)}% reached</span>
                    <span>
                      {isComplete
                        ? "Completed! 🎉"
                        : `₹${(goal.targetAmount - goal.currentAmount).toLocaleString("en-IN")} left`}
                    </span>
                  </div>
                </div>
              </div>

              {!isComplete && (
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleAddFunds(goal.id, 500)}
                    className="flex-1 py-1.5 px-2 bg-surface hover:bg-gray-200 border border-gray-200 rounded-lg text-caption font-semibold transition-colors"
                  >
                    +₹500
                  </button>
                  <button
                    onClick={() => handleAddFunds(goal.id, 2000)}
                    className="flex-1 py-1.5 px-2 bg-surface hover:bg-gray-200 border border-gray-200 rounded-lg text-caption font-semibold transition-colors"
                  >
                    +₹2,000
                  </button>
                  <button
                    onClick={() => handleAddFunds(goal.id, 5000)}
                    className="flex-1 py-1.5 px-2 bg-surface hover:bg-gray-200 border border-gray-200 rounded-lg text-caption font-semibold transition-colors"
                  >
                    +₹5,000
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
