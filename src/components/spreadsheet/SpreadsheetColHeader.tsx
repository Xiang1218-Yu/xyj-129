import { useAppStore } from "@/store/useAppStore";
import { COL_COUNT, generateColLabels } from "@/lib/spreadsheetUtils";

export default function SpreadsheetColHeader() {
  const { selectedCell, setSelectedCell } = useAppStore();
  const colLabels = generateColLabels(COL_COUNT);

  return (
    <div className="h-[25px] min-h-[25px] bg-[#F3F2F1] flex border-b border-gray-300 flex-shrink-0 sticky top-0 z-10">
      {colLabels.map((col) => (
        <div
          key={col}
          onClick={() =>
            setSelectedCell({
              row: selectedCell?.row || 1,
              col,
            })
          }
          className={`w-[130px] min-w-[130px] border-r border-gray-300 flex items-center justify-center text-[12px] cursor-default ${
            selectedCell?.col === col
              ? "bg-excel-green text-white font-semibold"
              : "text-gray-700 font-medium hover:bg-gray-200"
          }`}
        >
          {col}
        </div>
      ))}
      <div className="flex-1 border-r border-gray-300" />
    </div>
  );
}
