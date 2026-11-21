import React from "react";
import { readDb } from "@/lib/db";
import { UsersClient } from "./UsersClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Registered Users & Sign-Up Analytics — Samad Expo Admin",
};

export default function AdminUsersPage() {
  const db = readDb();
  const users = db.users || [];
  const projects = db.hostedProjects || [];

  return <UsersClient users={users} projects={projects} />;
}
