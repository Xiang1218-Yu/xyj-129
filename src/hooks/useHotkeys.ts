import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function useHotkeys() {
  const {
    toggleCamouflageMode,
    nextSheet,
    prevSheet,
    goToSheetIndex,
    closeNewsDetail,
    showDetail,
    isCamouflageMode,
  } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      if (e.key === "Escape") {
        if (showDetail) {
          e.preventDefault();
          closeNewsDetail();
        } else if (isCamouflageMode) {
          e.preventDefault();
          toggleCamouflageMode();
        }
        return;
      }

      if (!ctrlOrCmd) return;

      switch (e.key.toLowerCase()) {
        case "h":
          e.preventDefault();
          toggleCamouflageMode();
          break;

        case "arrowleft":
          e.preventDefault();
          prevSheet();
          break;

        case "arrowright":
          e.preventDefault();
          nextSheet();
          break;

        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6": {
          e.preventDefault();
          const index = parseInt(e.key) - 1;
          goToSheetIndex(index);
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    toggleCamouflageMode,
    nextSheet,
    prevSheet,
    goToSheetIndex,
    closeNewsDetail,
    showDetail,
    isCamouflageMode,
  ]);
}
