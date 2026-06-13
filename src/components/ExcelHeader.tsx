import {
  FileSpreadsheet,
  Minus,
  Square,
  X,
  RefreshCw,
  ChevronDown,
  ListTodo,
  BarChart3,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { getWorkTemplateById } from "@/data/camouflageData";
import { useRef, useState, useEffect } from "react";

export default function ExcelHeader() {
  const {
    isCamouflageMode,
    toggleCamouflageMode,
    camouflageMode,
    setCamouflageMode,
    activeWorkTemplateId,
  } = useAppStore();

  const [showModeMenu, setShowModeMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const workTemplate = getWorkTemplateById(activeWorkTemplateId);

  const displayTitle =
    camouflageMode === "finance"
      ? "年度财务报表.xlsx - Excel"
      : workTemplate
      ? `${workTemplate.name}.xlsx - Excel`
      : "工作任务追踪.xlsx - Excel";

  const handleSelectMode = (mode: "finance" | "workTask") => {
    setCamouflageMode(mode);
    setShowModeMenu(false);
    if (!isCamouflageMode) {
      toggleCamouflageMode();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowModeMenu(false);
      }
    };
    if (showModeMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModeMenu]);

  return (
    <div
      className="h-[30px] bg-excel-green flex items-center justify-between text-white text-xs px-2 select-none no-select"
      style={{ height: "30px" }}
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 flex items-center justify-center">
          <FileSpreadsheet size={18} />
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowModeMenu((v) => !v)}
            className="flex items-center gap-1 hover:bg-white/10 px-2 py-1 rounded transition-colors"
          >
            <span className="text-[13px] font-medium opacity-95">
              {displayTitle}
            </span>
            <ChevronDown size={12} className="opacity-70" />
          </button>
          {showModeMenu && (
            <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2.5 bg-gradient-to-r from-excel-green to-excel-green/80 text-white">
                <div className="text-xs opacity-80">切换伪装模板</div>
                <div className="text-sm font-medium mt-0.5">选择一个伪装场景</div>
              </div>
              <div className="py-1.5">
                <button
                  onClick={() => handleSelectMode("finance")}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    camouflageMode === "finance" ? "bg-green-50 border-l-4 border-excel-green" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      camouflageMode === "finance" ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <BarChart3
                      size={20}
                      className={
                        camouflageMode === "finance" ? "text-excel-green" : "text-gray-500"
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-semibold ${
                        camouflageMode === "finance" ? "text-excel-green" : "text-gray-700"
                      }`}
                    >
                      财务报表
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      年度销售数据 · 利润表 · 季度对比
                    </div>
                  </div>
                  {camouflageMode === "finance" && (
                    <div className="w-2 h-2 rounded-full bg-excel-green" />
                  )}
                </button>
                <div className="h-px bg-gray-100 mx-4" />
                <button
                  onClick={() => handleSelectMode("workTask")}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    camouflageMode === "workTask" ? "bg-blue-50 border-l-4 border-blue-500" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      camouflageMode === "workTask" ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <ListTodo
                      size={20}
                      className={
                        camouflageMode === "workTask" ? "text-blue-600" : "text-gray-500"
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-semibold ${
                        camouflageMode === "workTask" ? "text-blue-600" : "text-gray-700"
                      }`}
                    >
                      工作任务追踪
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      5个模板 · 任务/项目/缺陷/计划
                    </div>
                  </div>
                  {camouflageMode === "workTask" && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </button>
              </div>
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                <div className="text-[11px] text-gray-400 flex items-center gap-1">
                  <span>💡</span>
                  <span>切换后将自动进入伪装模式</span>
                </div>
              </div>
            </div>
          )}
        </div>
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
