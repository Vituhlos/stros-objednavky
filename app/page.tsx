import { getTodayOrderData } from "@/lib/orders";
import { getSettings } from "@/lib/settings";
import { getMenuWeekLabel } from "@/lib/menu";
import OrderPage from "@/app/components/OrderPage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getTodayOrderData();
  const s = getSettings();
  const menuEmpty = getMenuWeekLabel() === null;
  return (
    <OrderPage
      cutoffTime={s.cutoffTime}
      defaultMealPrice={parseInt(s.defaultMealPrice) || 110}
      defaultSoupPrice={parseInt(s.defaultSoupPrice) || 30}
      extrasPrices={{
        roll: parseInt(s.priceRoll) || 5,
        breadDumpling: parseInt(s.priceBreadDumpling) || 40,
        potatoDumpling: parseInt(s.pricePotatoDumpling) || 45,
        ketchup: parseInt(s.priceKetchup) || 20,
        tatarka: parseInt(s.priceTatarka) || 20,
        bbq: parseInt(s.priceBbq) || 20,
      }}
      initialData={data}
      menuEmpty={menuEmpty}
    />
  );
}
