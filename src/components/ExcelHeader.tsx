import { FileSpreadsheet, Minus, Square, X, RefreshCw } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function ExcelHeader() {
  const { isCamouflageMode, toggleCamouflageMode } = useAppStore();

  return (
    <div
      className="h-[30px] bg-excel-green flex items-center justify-between text-white text-xs px-2 select-none no-select"
      style={{ height: "30px" }}
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 flex items-center justify-center">
          <FileSpreadsheet size={18} />
        </div>
        <span className="text-[13px] font-medium opacity-95">
          年度财务报表.xlsx - Excel
        </span>
      </div>

      <div className="flex items-center h-full">
        <div
          className="flex items-center gap-3 px-3 h-full cursor-default hover:bg-white/10"
          onClick={toggleCamouflageMode}
          title={isCamouflageMode ? "取消伪装模式 (Ctrl+H)" : "切换伪装模式 (Ctrl+H)"}
        >
          <RefreshCw size={14} className={isCamouflageMode ? "animate-spin" : ""} />
          <span className="text-[12px]">
            {isCamouflageMode ? "编辑模式" : "伪装模式"}
          </span>
        </div>

        <div className="flex items-center h-full">
          <button className="w-[46px] h-full flex items-center justify-center hover:bg-white/15 transition-colors">
            <Minus size={14} />
          </button>
          <button className="w-[46px] h-full flex items-center justify-center hover:bg-white/15 transition-colors">
            <Square size={12} />
          </button>
          <button className="w-[46px] h-full flex items-center justify-center hover:bg-red-600 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
