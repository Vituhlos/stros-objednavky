export const dynamic = "force-dynamic";

import { getOrderList } from "@/lib/orders";
import { getPizzaOrderList } from "@/lib/pizza";
import HistoryPage from "@/app/components/HistoryPage";

export default function Page() {
  const orders = getOrderList();
  const pizzaOrders = getPizzaOrderList();
  return <HistoryPage orders={orders} pizzaOrders={pizzaOrders} />;
}
