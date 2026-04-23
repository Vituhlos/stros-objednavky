import { getFullMenu, getMenuWeekLabel, getTodayDayCode, getMondayISO, getNextMondayISO } from "@/lib/menu";
import MenuPage from "@/app/components/MenuPage";

export const dynamic = "force-dynamic";

export default async function JidelnicekPage() {
  const currentWeekStart = getMondayISO();
  const nextWeekStart = getNextMondayISO();

  const currentMenu = getFullMenu(currentWeekStart);
  const currentWeekLabel = getMenuWeekLabel(currentWeekStart);
  const nextMenu = getFullMenu(nextWeekStart);
  const nextWeekLabel = getMenuWeekLabel(nextWeekStart);
  const todayCode = getTodayDayCode();

  return (
    <MenuPage
      currentMenu={currentMenu}
      currentWeekLabel={currentWeekLabel}
      currentWeekStart={currentWeekStart}
      nextMenu={nextMenu}
      nextWeekLabel={nextWeekLabel}
      nextWeekStart={nextWeekStart}
      todayCode={todayCode}
    />
  );
}
