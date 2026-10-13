"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Camera } from "lucide-react";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import {
  getStoredUserDetails,
  updateUserProfile,
  DATA_CHANGED_EVENT,
} from "@/utilities/dataService";
import { User } from "@/components/MFA/DashBoardCards/interface";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(() => {
    return getStoredUserDetails();
  });
  const [name, setName] = useState<string>(() => {
    return getStoredUserDetails()?.name || "";
  });
  const [email, setEmail] = useState<string>(() => {
    return getStoredUserDetails()?.email || "";
  });
  const [phone, setPhone] = useState<string>(() => {
    return getStoredUserDetails()?.phone || "";
  });
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return getStoredUserDetails()?.profileImageUrl || "";
  });
  const [budget, setBudget] = useState<string>(() => {
    return String(getStoredUserDetails()?.monthlyBudget || 45000);
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      const updated = getStoredUserDetails();
      setUser(updated);
      setName(updated?.name || "");
      setEmail(updated?.email || "");
      setPhone(updated?.phone || "");
      setAvatarUrl(updated?.profileImageUrl || "");
      setBudget(String(updated?.monthlyBudget || 45000));
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(DATA_CHANGED_EVENT, handleUpdate);
    };
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      profileImageUrl: avatarUrl.trim(),
      monthlyBudget: Number(budget) || 45000,
    });

    setFeedback("Profile updated successfully!");
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRegenerateAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const newUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    setAvatarUrl(newUrl);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-transparent max-w-3xl w-full mx-auto">
      <div>
        <h1 className="text-heading2 lg:text-heading1 font-bold">User Profile</h1>
        <p className="text-gray-600 text-body1">
          Manage your personal information, contact details, and account settings
        </p>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 p-3 bg-success/15 border border-success/40 text-success rounded-xl font-medium text-body2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Avatar Card */}
      <div className="bg-background rounded-2xl p-6 border border-2 border-gray-200 shadow-md flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-24 h-24 rounded-full border-4 border-primary/30 bg-primary/10 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-primary/30 bg-primary flex items-center justify-center text-opposite text-heading1 font-bold">
              {name?.slice(0, 2).toUpperCase() || "ET"}
            </div>
          )}
          <button
            type="button"
            onClick={handleRegenerateAvatar}
            className="absolute bottom-0 right-0 p-2 bg-primary text-opposite rounded-full shadow-lg hover:scale-110 transition-transform"
            title="Generate New Avatar"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-heading2 font-bold">{user?.name || "User"}</h2>
          <p className="text-body2 text-gray-500">{user?.email}</p>
          <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
            <span className="text-caption px-2.5 py-0.5 bg-primary/15 text-primary rounded-full font-semibold">
              ID: {user?.userId || "USR-DEMO"}
            </span>
            <span className="text-caption px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full font-semibold">
              Member since: {user?.joinedDate || "2024-03-15"}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-background rounded-2xl p-6 border border-2 border-gray-200 shadow-md flex flex-col gap-5"
      >
        <h3 className="text-heading3 font-bold border-b border-gray-100 pb-3">
          Edit Profile Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Your Full Name"
            inputTitle="Full Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            type="email"
            placeholder="user@example.com"
            inputTitle="Email Address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="tel"
            placeholder="+91-9876543210"
            inputTitle="Phone Number"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            type="number"
            placeholder="45000"
            inputTitle="Monthly Budget (₹)"
            name="monthlyBudget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <div className="md:col-span-2">
            <Input
              type="url"
              placeholder="https://..."
              inputTitle="Avatar Image URL"
              name="profileImageUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            buttonLabel="Save Profile Changes"
            variant="brand-primary"
            tone="primary"
            customClass="text-opposite font-semibold"
          />
        </div>
      </form>
    </div>
  );
}
