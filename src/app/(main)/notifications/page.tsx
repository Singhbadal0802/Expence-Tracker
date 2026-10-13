"use client";

import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Check,
  Trash2,
} from "lucide-react";
import Button from "@/components/UI/Button";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "warning" | "success" | "info" | "alert";
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Budget Alert: Shopping Exceeded",
    message: "You have reached 92% of your monthly Shopping category budget.",
    date: "2 hours ago",
    type: "warning",
    isRead: false,
  },
  {
    id: "notif-2",
    title: "Monthly Statement Ready",
    message: "Your monthly financial breakdown for last month is now available for download.",
    date: "1 day ago",
    type: "info",
    isRead: false,
  },
  {
    id: "notif-3",
    title: "Emergency Fund Milestone",
    message: "Congratulations! You have reached over 70% of your Emergency Fund goal.",
    date: "3 days ago",
    type: "success",
    isRead: true,
  },
  {
    id: "notif-4",
    title: "Electricity Bill Due Soon",
    message: "Your upcoming utility bill payment is due in 4 days. Plan your expenses accordingly.",
    date: "5 days ago",
    type: "alert",
    isRead: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("app_notifications");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [filter, setFilter] = useState<"all" | "unread">("all");

  const saveNotifications = (items: NotificationItem[]) => {
    setNotifications(items);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("app_notifications", JSON.stringify(items));
    }
  };

  const handleMarkAllRead = () => {
    saveNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleToggleRead = (id: string) => {
    saveNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleDelete = (id: string) => {
    saveNotifications(notifications.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-transparent max-w-4xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-heading2 lg:text-heading1 font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-danger text-opposite rounded-full text-caption font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-gray-600 text-body1">
            Stay updated with budget alerts, bills, and savings milestones
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            buttonLabel="Mark all as read"
            variant="brand-secondary"
            tone="primary"
            onClick={handleMarkAllRead}
            customClass="text-body2 font-semibold"
          />
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-lg text-body2 font-medium transition-colors ${
            filter === "all"
              ? "bg-primary text-opposite font-bold"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-1.5 rounded-lg text-body2 font-medium transition-colors ${
            filter === "unread"
              ? "bg-primary text-opposite font-bold"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col bg-background rounded-2xl border border-2 border-gray-200 shadow-lg divide-y divide-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
            <Bell className="w-12 h-12 stroke-[1.5] mb-2" />
            <p className="font-semibold text-heading3">No notifications</p>
            <p className="text-body2">You are all caught up!</p>
          </div>
        ) : (
          filtered.map((item) => {
            const getIcon = () => {
              if (item.type === "warning") return <AlertTriangle className="w-5 h-5 text-warning" />;
              if (item.type === "success") return <CheckCircle2 className="w-5 h-5 text-success" />;
              if (item.type === "alert") return <Calendar className="w-5 h-5 text-danger" />;
              return <Sparkles className="w-5 h-5 text-primary" />;
            };

            return (
              <div
                key={item.id}
                className={`flex items-start justify-between p-5 gap-4 transition-colors ${
                  !item.isRead ? "bg-primary/5" : "hover:bg-gray-50/50"
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-surface rounded-xl border border-gray-200 flex-shrink-0 mt-0.5">
                    {getIcon()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-body1 font-bold ${
                          !item.isRead ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {item.title}
                      </h3>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-body2 text-gray-600 mt-1">{item.message}</p>
                    <span className="text-caption text-gray-400 mt-2 block">
                      {item.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleRead(item.id)}
                    className="p-2 text-gray-400 hover:text-primary rounded-lg transition-colors"
                    title={item.isRead ? "Mark as unread" : "Mark as read"}
                  >
                    <Check className={`w-4 h-4 ${item.isRead ? "text-gray-300" : "text-primary font-bold"}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-danger rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
