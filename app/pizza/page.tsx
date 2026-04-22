export const dynamic = "force-dynamic";

import { getTodayPizzaOrderData } from "@/lib/pizza";
import PizzaPage from "@/app/components/PizzaPage";

export default function Page() {
  const data = getTodayPizzaOrderData();
  return <PizzaPage initialData={data} />;
}
