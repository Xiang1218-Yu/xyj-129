import { useAppStore } from "@/store/useAppStore";
import HelpPanel from "@/components/HelpPanel";
import NewsList from "@/components/NewsList";
import CamouflageMode from "@/components/CamouflageMode";
import NewsDetail from "@/components/NewsDetail";

export default function Spreadsheet() {
  const { activeSheet, isCamouflageMode, selectedCell, setSelectedCell } =
    useAppStore();

  const generateColLabels = (count: number): string[] => {
    const labels: string[] = [];
    for (let i = 0; i < count; i++) {
      let col = "";
      let n = i;
      while (n >= 0) {
        col = String.fromCharCode(65 + (n % 26)) + col;
        n = Math.floor(n / 26) - 1;
      }
      labels.push(col);
    }
    return labels;
  };

  const colLabels = generateColLabels(12);
  const visibleCols = colLabels.slice(0, 8);

  const handleCellClick = (row: number, col: string) => {
    setSelectedCell({ row, col });
  };

  if (isCamouflageMode) {
    return (
      <div className="flex-1 overflow-hidden bg-white">
        <CamouflageMode />
        <NewsDetail />
      </div>
    );
  }

  const showHelp = activeSheet === "help";

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex flex-col w-[40px] flex-shrink-0 bg-[#F3F2F1] border-r border-gray-300">
          <div className="h-[25px] border-b border-gray-300 border-r border-gray-300 flex items-center justify-center">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              className="text-gray-400"
            >
              <polygon points="0,10 10,0 10,10" fill="currentColor" />
            </svg>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex flex-col">
              {Array.from({ length: 100 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-[24px] flex items-center justify-center text-[11px] border-b border-gray-300 flex-shrink-0 cursor-default ${
                    selectedCell?.row === idx + 1
                      ? "bg-excel-green text-white font-semibold"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() =>
                    setSelectedCell({
                      row: idx + 1,
                      col: selectedCell?.col || "A",
                    })
                  }
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-[25px] bg-[#F3F2F1] flex border-b border-gray-300 flex-shrink-0 no-select">
            {visibleCols.map((col) => (
              <div
                key={col}
                className={`flex-1 min-w-[100px] border-r border-gray-300 flex items-center justify-center text-[12px] cursor-default ${
                  selectedCell?.col === col
                    ? "bg-excel-green text-white font-semibold"
                    : "text-gray-700 font-medium hover:bg-gray-200"
                }`}
                onClick={() =>
                  setSelectedCell({
                    row: selectedCell?.row || 1,
                    col,
                  })
                }
              >
                {col}
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-hidden flex">
            {showHelp ? (
              <div className="w-full h-full border-r border-gray-300">
                <HelpPanel />
              </div>
            ) : (
              <>
                <div className="w-[42%] min-w-[380px] h-full border-r border-gray-300 overflow-hidden">
                  <HelpPanel />
                </div>

                <div className="flex-1 min-w-0 h-full overflow-hidden">
                  <NewsList />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="hidden">
        {visibleCols.map((col) =>
          Array.from({ length: 50 }).map((_, rIdx) => (
            <div
              key={`hidden-${col}-${rIdx}`}
              onClick={() => handleCellClick(rIdx + 1, col)}
            />
          ))
        )}
      </div>

      <NewsDetail />
    </div>
  );
}
