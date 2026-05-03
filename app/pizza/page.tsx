export const dynamic = "force-dynamic";

import { getTodayPizzaOrderData } from "@/lib/pizza";
import PizzaPage from "@/app/components/PizzaPage";
import { getCurrentUser } from "@/lib/auth";

export default async function Page() {
  const data = getTodayPizzaOrderData();
  const currentUser = await getCurrentUser();
  const isAdmin = currentUser?.role === "admin";
  return <PizzaPage initialData={data} isAdmin={isAdmin} />;
}
