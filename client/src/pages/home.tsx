import { useEffect, useState } from "react";
import MobileHome from "@/components/MobileHome";
import DesktopHome from "@/components/DesktopHome";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <MobileHome /> : <DesktopHome />;
}