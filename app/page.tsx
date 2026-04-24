import { getTodayOrderData } from "@/lib/orders";
import { getSettings } from "@/lib/settings";
import { getMenuWeekLabel } from "@/lib/menu";
import OrderPage from "@/app/components/OrderPage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getTodayOrderData();
  const { cutoffTime, defaultSoupPrice, defaultMealPrice } = getSettings();
  const menuEmpty = getMenuWeekLabel() === null;
  return (
    <OrderPage
      cutoffTime={cutoffTime}
      defaultMealPrice={parseInt(defaultMealPrice) || 110}
      defaultSoupPrice={parseInt(defaultSoupPrice) || 30}
      initialData={data}
      menuEmpty={menuEmpty}
    />
  );
}
