/**
 * Default home page - redirects to pricing page
 */
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/pricing");
}
