"use client";

import { UserArmy } from "@/components/UserArmy";
import Modal from "@/components/Modal";

export default function GamePage() {
  return (
    <div className="container mx-auto px-4">
      <UserArmy />
      <Modal />
    </div>
  );
}
