import { Bookmark, CheckCircle2, Calculator, Eye, Maximize2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { categories, getCategoryById } from "@/data/categories";
import { getNewsByCategory } from "@/data/newsData";

export default function StatusBar() {
  const { activeSheet, isCamouflageMode, toggleCamouflageMode } = useAppStore();

  if (isCamouflageMode) {
    return (
      <div className="h-[24px] bg-excel-green flex items-center justify-between px-4 text-[11.5px] text-white no-select" style={{ height: "24px" }}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={12} />
            就绪
          </span>
          <span>平均: ¥1,273,864</span>
          <span>计数: 32</span>
          <span>求和: ¥63,693,220</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleCamouflageMode}
            className="flex items-center gap-1 hover:bg-white/10 px-2 py-0.5 rounded"
            title="按 Ctrl+H 返回浏览模式"
          >
            <Eye size={12} />
            <span>伪装模式已启用</span>
          </button>
          <div className="flex items-center gap-1 border-l border-white/20 pl-3">
            <Maximize2 size={11} />
            <span>100%</span>
          </div>
        </div>
      </div>
    );
  }

  const currentCat = getCategoryById(activeSheet);
  const newsCount =
    activeSheet === "help" ? 0 : getNewsByCategory(activeSheet).length;

  return (
    <div className="h-[24px] bg-excel-green flex items-center justify-between px-4 text-[11.5px] text-white no-select" style={{ height: "24px" }}>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <CheckCircle2 size={12} />
          就绪
        </span>

        {currentCat && activeSheet !== "help" && (
          <>
            <span className="flex items-center gap-1 opacity-90">
              <Bookmark size={11} />
              {currentCat.name}资讯
            </span>
            <span className="opacity-80">
              共 <strong>{newsCount}</strong> 条内容
            </span>
            <span className="flex items-center gap-1 opacity-75">
              <Calculator size={11} />
              平均热度: {(getNewsByCategory(activeSheet).reduce((a, b) => a + b.hot, 0) / Math.max(1, newsCount) / 10000).toFixed(0)}万
            </span>
          </>
        )}

        {activeSheet === "help" && (
          <span className="opacity-80">使用说明 · 掌握快捷键，摸鱼更高效</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1 opacity-85">
          <span>分类: {categories.filter(c => c.id !== 'help').length}</span>
        </div>

        <button
          onClick={toggleCamouflageMode}
          className="flex items-center gap-1 px-2.5 py-0.5 bg-white/15 hover:bg-white/25 rounded transition-colors"
          title="切换伪装模式 (Ctrl/⌘+H)"
        >
          <Eye size={12} />
          <span>伪装模式</span>
          <kbd className="ml-1 bg-white/20 px-1 rounded text-[10px] font-mono">
            Ctrl+H
          </kbd>
        </button>

        <div className="w-px h-4 bg-white/25" />

        <div className="flex items-center gap-1">
          <Maximize2 size={11} />
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
