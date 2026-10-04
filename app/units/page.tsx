import { redirect } from "next/navigation";

// Only Year 1 exists so far; send /units there until an all-units directory is built.
export default function UnitsIndexPage() {
  redirect("/years/year-1");
}
