import { getFullMenu, getMenuWeekLabel, getTodayDayCode } from "@/lib/menu";
import MenuPage from "@/app/components/MenuPage";

export const dynamic = "force-dynamic";

export default async function JidelnicekPage() {
  const menu = getFullMenu();
  const weekLabel = getMenuWeekLabel();
  const todayCode = getTodayDayCode();

  return (
    <MenuPage menu={menu} todayCode={todayCode} weekLabel={weekLabel} />
  );
}
