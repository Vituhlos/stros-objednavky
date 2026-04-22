export const dynamic = "force-dynamic";

import { getSettings } from "@/lib/settings";
import SettingsPage from "@/app/components/SettingsPage";

export default function Page() {
  const settings = getSettings();
  return <SettingsPage settings={settings} />;
}
