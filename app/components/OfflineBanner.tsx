"use client";

import { useEffect, useState } from "react";
import MIcon from "./MIcon";

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div aria-live="assertive" role="alert" className="k-offline">
      <MIcon name="wifi_off" size={14} />
      <span>Jste offline — objednávky se neuloží</span>
    </div>
  );
}
