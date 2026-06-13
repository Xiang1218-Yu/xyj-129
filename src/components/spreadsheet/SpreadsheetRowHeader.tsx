import { useAppStore } from "@/store/useAppStore";
import { ROW_COUNT } from "@/lib/spreadsheetUtils";

export default function SpreadsheetRowHeader() {
  const { selectedCell, setSelectedCell } = useAppStore();

  return (
    <div className="flex flex-col w-[40px] flex-shrink-0 bg-[#F3F2F1] border-r border-gray-300 z-10 sticky left-0">
      <div className="h-[25px] min-h-[25px] border-b border-gray-300 border-r border-gray-300 flex items-center justify-center sticky top-0 z-20 bg-[#F3F2F1]">
        <svg width="10" height="10" viewBox="0 0 10 10" className="text-gray-400">
          <polygon points="0,10 10,0 10,10" fill="currentColor" />
        </svg>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col">
          {Array.from({ length: ROW_COUNT }).map((_, idx) => {
            const rowNum = idx + 1;
            return (
              <div
                key={rowNum}
                onClick={() =>
                  setSelectedCell({
                    row: rowNum,
                    col: selectedCell?.col || "A",
                  })
                }
                className={`h-[24px] min-h-[24px] flex items-center justify-center text-[11px] border-b border-gray-300 flex-shrink-0 cursor-default ${
                  selectedCell?.row === rowNum
                    ? "bg-excel-green text-white font-semibold"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {rowNum}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
