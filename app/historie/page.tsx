export const dynamic = "force-dynamic";

import { getOrderList } from "@/lib/orders";
import HistoryPage from "@/app/components/HistoryPage";

export default function Page() {
  const orders = getOrderList();
  return <HistoryPage orders={orders} />;
}
