"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import DynamicContent from "@/components/DynamicContent";
import Footer from "@/components/Footer";

export default function HomeContent() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex flex-col min-h-screen">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />{" "}
      <main className="flex-grow ">
        <DynamicContent activeTab={activeTab} />
      </main>
      <Footer />
    </div>
  );
}
