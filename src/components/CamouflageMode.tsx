import { camouflageData, camouflageFormulaRows } from "@/data/camouflageData";

export default function CamouflageMode() {
  const allData = [...camouflageData, ...camouflageFormulaRows];

  return (
    <div className="h-full w-full overflow-auto no-transition bg-white">
      <div className="min-w-[800px]">
        <table className="w-full border-collapse text-[13px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#F3F2F1]">
              <th className="w-10 h-[25px] border border-gray-300 text-[11px] font-normal text-gray-500">
                {/* 左上角空白 */}
              </th>
              {["A", "B", "C", "D", "E", "F", "G", "H"].map((col) => (
                <th
                  key={col}
                  className="w-[120px] h-[25px] border border-gray-300 text-[12px] font-medium text-gray-700"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allData.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={
                  rowIdx === 0
                    ? "bg-excel-greenLight/30"
                    : rowIdx === 1
                    ? "bg-gray-50 font-semibold"
                    : rowIdx === allData.length - 1
                    ? "bg-excel-greenLight/40 font-semibold"
                    : "hover:bg-blue-50/50"
                }
              >
                <td className="h-[24px] border border-gray-300 bg-[#F3F2F1] text-center text-[11px] text-gray-600 font-medium">
                  {rowIdx + 1}
                </td>
                {["A", "B", "C", "D", "E", "F", "G", "H"].map((col) => {
                  const cellValue = row[col] ?? "";
                  const isNumber =
                    typeof cellValue === "string" &&
                    (cellValue.startsWith("¥") || cellValue.endsWith("%"));
                  return (
                    <td
                      key={col}
                      className={`h-[24px] px-2 border border-gray-300 whitespace-nowrap ${
                        isNumber ? "text-right" : "text-left"
                      } ${
                        rowIdx === 0 && col === "A"
                          ? "text-[16px] font-bold text-excel-green text-center py-2"
                          : ""
                      } ${
                        col === "H" && rowIdx >= 2 && rowIdx < allData.length - 2
                          ? "text-green-600"
                          : ""
                      }`}
                    >
                      {cellValue}
                    </td>
                  );
                })}
              </tr>
            ))}

            {Array.from({ length: 15 }).map((_, extraIdx) => (
              <tr key={`empty-${extraIdx}`} className="hover:bg-blue-50/50">
                <td className="h-[24px] border border-gray-300 bg-[#F3F2F1] text-center text-[11px] text-gray-500 font-medium">
                  {allData.length + extraIdx + 1}
                </td>
                {["A", "B", "C", "D", "E", "F", "G", "H"].map((col) => (
                  <td
                    key={col}
                    className="h-[24px] border border-gray-300 px-2"
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
