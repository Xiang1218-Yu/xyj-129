import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { categories } from "@/data/categories";

export default function SheetTabs() {
  const { activeSheet, setActiveSheet, isCamouflageMode } = useAppStore();

  if (isCamouflageMode) {
    return (
      <div className="h-[28px] flex items-center border-t border-gray-300 bg-white px-2 no-select">
        <div className="flex items-end">
          {[
            { id: "sheet1", name: "销售汇总" },
            { id: "sheet2", name: "利润表" },
            { id: "sheet3", name: "资产负债表" },
            { id: "sheet4", name: "现金流" },
          ].map((s, idx) => (
            <div
              key={s.id}
              className={`px-4 h-[26px] flex items-center text-[12px] border-t-2 -mt-0.5 rounded-t-sm ${
                idx === 0
                  ? "border-t-excel-green bg-white border-x border-b-0 border-gray-300 font-medium"
                  : "border-t-transparent bg-gray-50 hover:bg-gray-100 text-gray-600"
              }`}
            >
              {s.name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[28px] flex items-center border-t border-gray-300 bg-white px-1 no-select" style={{ height: "28px" }}>
      <div className="flex items-center gap-0.5 mr-1">
        <button className="w-[22px] h-[22px] flex items-center justify-center rounded hover:bg-gray-100 text-gray-600">
          <ChevronLeft size={14} />
        </button>
        <button className="w-[22px] h-[22px] flex items-center justify-center rounded hover:bg-gray-100 text-gray-600">
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex items-end gap-0.5 flex-1 overflow-x-auto">
        {categories.map((cat, index) => {
          const isActive = activeSheet === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveSheet(cat.id)}
              className={`relative px-4 py-0 h-[25px] flex items-center text-[12.5px] whitespace-nowrap rounded-t-sm transition-colors group ${
                isActive
                  ? "bg-white border-t-2 border-x border-b-0 border-t-excel-green border-gray-300 font-medium text-gray-900"
                  : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
              title={`Ctrl/⌘ + ${index + 1}`}
            >
              <span
                className={`absolute top-0 left-0.5 text-[9px] opacity-40 ${
                  isActive ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {index + 1}
              </span>
              {cat.name}
              {isActive && (
                <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-excel-green" />
              )}
            </button>
          );
        })}

        <button className="w-[28px] h-[25px] flex items-center justify-center rounded-t-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 ml-1">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
