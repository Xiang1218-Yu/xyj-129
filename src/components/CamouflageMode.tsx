import { useState, useRef, useEffect } from "react";
import {
  camouflageData,
  camouflageFormulaRows,
  workTaskTemplates,
  getWorkTemplateById,
} from "@/data/camouflageData";
import { useAppStore } from "@/store/useAppStore";
import {
  ChevronDown,
  FileSpreadsheet,
  ListTodo,
  FolderKanban,
  CalendarDays,
  Bug,
  MessageSquareText,
  Save,
  CheckCircle2,
  Clock,
  BarChart3,
} from "lucide-react";

const templateIcons: Record<string, typeof FileSpreadsheet> = {
  "daily-task": ListTodo,
  "project-progress": FolderKanban,
  "weekly-plan": CalendarDays,
  "defect-track": Bug,
  "meeting-todo": MessageSquareText,
};

const statusStyles: Record<string, string> = {
  已完成: "text-green-600 font-medium",
  进行中: "text-blue-600 font-medium",
  待开始: "text-gray-500",
  已修复: "text-green-600 font-medium",
  处理中: "text-blue-600 font-medium",
  已分配: "text-purple-600 font-medium",
  新建: "text-orange-600 font-medium",
  高: "text-red-600 font-medium",
  中: "text-yellow-600 font-medium",
  低: "text-gray-500",
  严重: "text-red-600 font-medium",
  一般: "text-yellow-600 font-medium",
  轻微: "text-gray-500",
};

export default function CamouflageMode() {
  const {
    cellValues,
    setCellValue,
    setFormulaBarValue,
    setSelectedCell,
    selectedCell,
    camouflageMode,
    activeWorkTemplateId,
    setActiveWorkTemplateId,
    setWorkTemplateCellValue,
    getWorkTemplateCellValue,
    showTemplateSelector,
    toggleTemplateSelector,
    setShowTemplateSelector,
    saveWorkTemplate,
  } = useAppStore();

  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saveToast, setSaveToast] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  const isFinance = camouflageMode === "finance";
  const workTemplate = getWorkTemplateById(activeWorkTemplateId);

  const allData = isFinance
    ? [...camouflageData, ...camouflageFormulaRows]
    : workTemplate?.rows || [];

  const colCount = isFinance ? 12 : workTemplate?.colCount || 12;
  const totalRows = isFinance
    ? Math.max(allData.length + 60, 120)
    : workTemplate?.totalRows || 80;

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

  const colLabels = generateColLabels(colCount);

  const getCellKey = (row: number, col: string) => `${col}${row}`;

  const getPresetValue = (rowIdx: number, col: string): string => {
    if (rowIdx < allData.length) {
      return String(allData[rowIdx][col] ?? "");
    }
    return "";
  };

  const getEffectiveValue = (rowIdx: number, col: string): string => {
    const key = getCellKey(rowIdx + 1, col);
    if (isFinance) {
      if (cellValues[key] !== undefined) return cellValues[key];
    } else {
      const wv = getWorkTemplateCellValue(activeWorkTemplateId, rowIdx + 1, col);
      if (wv) return wv;
    }
    return getPresetValue(rowIdx, col);
  };

  const handleCellClick = (rowIdx: number, col: string) => {
    const rowNum = rowIdx + 1;
    if (editingCell) {
      if (editingCell.row === rowNum && editingCell.col === col) return;
      if (isFinance) {
        setCellValue(editingCell.row, editingCell.col, editValue);
      } else {
        setWorkTemplateCellValue(activeWorkTemplateId, editingCell.row, editingCell.col, editValue);
      }
      setEditingCell(null);
    }
    setSelectedCell({ row: rowNum, col });
    const val = getEffectiveValue(rowIdx, col);
    setFormulaBarValue(val);
    setEditingCell({ row: rowNum, col });
    setEditValue(val);
  };

  const finishEditing = (save = true) => {
    if (editingCell && save) {
      if (isFinance) {
        setCellValue(editingCell.row, editingCell.col, editValue);
      } else {
        setWorkTemplateCellValue(activeWorkTemplateId, editingCell.row, editingCell.col, editValue);
      }
      setFormulaBarValue(editValue);
    }
    setEditingCell(null);
  };

  const handleSave = () => {
    if (!isFinance) {
      saveWorkTemplate();
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2000);
    }
  };

  const getRowBg = (rIdx: number): string => {
    if (isFinance) {
      if (rIdx === 0) return "bg-excel-greenLight/30";
      if (rIdx === 1) return "bg-gray-50";
      if (rIdx === allData.length - 1) return "bg-excel-greenLight/40";
      if (rIdx === 30) return "bg-gray-100/60";
      return "";
    }
    if (rIdx === 0) return "bg-blue-50";
    if (rIdx === 1) return "bg-gray-50";
    if (rIdx === allData.length - 1) return "bg-blue-50/60";
    return "";
  };

  const getCellStyle = (rIdx: number, col: string, value: string) => {
    let extraClass = "";
    if (isFinance) {
      const isNumber =
        typeof value === "string" && (value.startsWith("¥") || value.endsWith("%"));
      if (isNumber) extraClass += " justify-end";
      else extraClass += " justify-start";
      const isTitleRow = rIdx === 0 && col === "A";
      const isGrowth = col === "H" && rIdx >= 2 && rIdx < allData.length - 2 && value;
      const isHeader = rIdx === 1;
      const isSummary = rIdx === allData.length - 1;
      let textClass = "text-gray-800";
      if (isTitleRow) textClass = "text-[15px] font-bold text-excel-green text-center w-full";
      else if (isGrowth) textClass = "text-green-600";
      else if (isHeader) textClass = "font-semibold text-gray-800";
      else if (isSummary) textClass = "font-semibold text-gray-800";
      return { extraClass, textClass };
    }
    const statusMatch = statusStyles[value];
    const isTitleRow = rIdx === 0 && col === "A";
    const isHeader = rIdx === 1;
    const isSummary = rIdx === allData.length - 1;
    let textClass = "text-gray-800";
    if (isTitleRow) textClass = "text-[15px] font-bold text-blue-700 text-center w-full";
    else if (isHeader) textClass = "font-semibold text-gray-800";
    else if (isSummary) textClass = "font-semibold text-gray-800";
    else if (statusMatch) textClass = statusMatch;
    return { extraClass: " justify-start", textClass };
  };

  const getStatusBadge = (value: string) => {
    const badges: Record<string, string> = {
      已完成: "bg-green-100 text-green-700",
      进行中: "bg-blue-100 text-blue-700",
      待开始: "bg-gray-100 text-gray-600",
      已修复: "bg-green-100 text-green-700",
      处理中: "bg-blue-100 text-blue-700",
      已分配: "bg-purple-100 text-purple-700",
      新建: "bg-orange-100 text-orange-700",
      高: "bg-red-100 text-red-700",
      中: "bg-yellow-100 text-yellow-700",
      低: "bg-gray-100 text-gray-600",
      严重: "bg-red-100 text-red-700",
      一般: "bg-yellow-100 text-yellow-700",
      轻微: "bg-gray-100 text-gray-600",
    };
    if (badges[value]) {
      return (
        <span className={`px-1.5 py-0.5 rounded text-[11px] ${badges[value]}`}>
          {value}
        </span>
      );
    }
    return null;
  };

  useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingCell]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editingCell) return;
      const rowIdx = editingCell.row - 1;
      if (e.key === "Enter") {
        e.preventDefault();
        finishEditing(true);
        const nextRow = Math.min(totalRows - 1, rowIdx + 1);
        const col = editingCell.col;
        const val = getEffectiveValue(nextRow, col);
        setSelectedCell({ row: nextRow + 1, col });
        setFormulaBarValue(val);
        setEditingCell({ row: nextRow + 1, col });
        setEditValue(val);
      } else if (e.key === "Escape") {
        e.preventDefault();
        finishEditing(false);
      } else if (e.key === "Tab") {
        e.preventDefault();
        finishEditing(true);
        const currIdx = colLabels.indexOf(editingCell.col);
        const nextCol = colLabels[Math.min(colCount - 1, currIdx + 1)];
        const val = getEffectiveValue(rowIdx, nextCol);
        setSelectedCell({ row: rowIdx + 1, col: nextCol });
        setFormulaBarValue(val);
        setEditingCell({ row: rowIdx + 1, col: nextCol });
        setEditValue(val);
      } else if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingCell, editValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setShowTemplateSelector(false);
      }
    };
    if (showTemplateSelector) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTemplateSelector]);

  return (
    <div className="flex-1 w-full no-transition bg-white flex flex-col overflow-hidden min-h-0 relative">
      {!isFinance && (
        <div className="h-[38px] min-h-[38px] flex items-center justify-between px-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative" ref={selectorRef}>
              <button
                onClick={toggleTemplateSelector}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-200 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm"
              >
                {workTemplate &&
                  (() => {
                    const IconComp = templateIcons[activeWorkTemplateId] || FileSpreadsheet;
                    return <IconComp size={16} className="text-blue-600" />;
                  })()}
                <span className="text-sm font-medium text-gray-700">
                  {workTemplate?.name || "选择模板"}
                </span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {showTemplateSelector && (
                <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                    <div className="text-xs text-gray-500 font-medium">选择工作模板</div>
                  </div>
                  <div className="py-1 max-h-80 overflow-y-auto">
                    {workTaskTemplates.map((tpl) => {
                      const IconComp = templateIcons[tpl.id] || FileSpreadsheet;
                      const isActive = tpl.id === activeWorkTemplateId;
                      return (
                        <button
                          key={tpl.id}
                          onClick={() => {
                            setActiveWorkTemplateId(tpl.id);
                            setShowTemplateSelector(false);
                            setEditingCell(null);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-blue-50 transition-colors ${
                            isActive ? "bg-blue-50 border-l-2 border-blue-500" : ""
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                            isActive ? "bg-blue-100" : "bg-gray-100"
                          }`}>
                            <IconComp size={16} className={isActive ? "text-blue-600" : "text-gray-500"} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium ${isActive ? "text-blue-700" : "text-gray-700"}`}>
                              {tpl.name}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {tpl.rows.length}行 · {tpl.colCount || 12}列
                            </div>
                          </div>
                          {isActive && <CheckCircle2 size={16} className="text-blue-500 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <BarChart3 size={13} />
              <span>共 {workTaskTemplates.length} 个模板</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock size={13} />
              <span>双击单元格可编辑</span>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm active:scale-95"
            >
              <Save size={14} />
              <span>保存</span>
              <span className="text-blue-200 text-xs">⌘S</span>
            </button>
          </div>
        </div>
      )}

      {saveToast && (
        <div className="absolute top-14 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg shadow-lg animate-in fade-in slide-in-from-right">
          <CheckCircle2 size={18} />
          <span className="text-sm font-medium">保存成功！</span>
        </div>
      )}

      <div className="flex-1 w-full flex overflow-hidden min-h-0">
        <div className="flex flex-col w-[40px] flex-shrink-0 bg-[#F3F2F1] border-r border-gray-300">
          <div className="h-[25px] min-h-[25px] border-b border-gray-300 border-r border-gray-300 flex items-center justify-center bg-[#F3F2F1]">
            <svg width="10" height="10" viewBox="0 0 10 10" className="text-gray-400">
              <polygon points="0,10 10,0 10,10" fill="currentColor" />
            </svg>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col">
              {Array.from({ length: totalRows }).map((_, idx) => {
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
                        ? isFinance
                          ? "bg-excel-green text-white font-semibold"
                          : "bg-blue-600 text-white font-semibold"
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

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <div className="h-[25px] min-h-[25px] bg-[#F3F2F1] flex border-b border-gray-300 flex-shrink-0">
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
                    ? isFinance
                      ? "bg-excel-green text-white font-semibold"
                      : "bg-blue-600 text-white font-semibold"
                    : "text-gray-700 font-medium hover:bg-gray-200"
                }`}
              >
                {col}
              </div>
            ))}
            <div className="flex-1 border-r border-gray-300" />
          </div>

          <div className="flex-1 overflow-auto">
            <div className="relative" style={{ width: `${colCount * 130 + 200}px` }}>
              {Array.from({ length: totalRows }).map((_, rIdx) => {
                const rowNum = rIdx + 1;
                const rowBg = getRowBg(rIdx);

                return (
                  <div key={rowNum} className={`flex ${rowBg}`} style={{ height: "24px" }}>
                    {colLabels.map((col) => {
                      const cellKey = getCellKey(rowNum, col);
                      const isSelected =
                        selectedCell?.row === rowNum && selectedCell?.col === col;
                      const isEditing =
                        editingCell?.row === rowNum && editingCell?.col === col;
                      const value = getEffectiveValue(rIdx, col);
                      const { extraClass, textClass } = getCellStyle(rIdx, col, value);
                      const badge = !isEditing && !isFinance ? getStatusBadge(value) : null;

                      return (
                        <div
                          key={cellKey}
                          onClick={() => handleCellClick(rIdx, col)}
                          onDoubleClick={() => handleCellClick(rIdx, col)}
                          className={`w-[130px] min-w-[130px] h-[24px] border-r border-b border-gray-200 px-2 text-[13px] flex items-center overflow-hidden relative ${
                            isSelected ? "cell-selected" : ""
                          } ${extraClass}`}
                        >
                          {isEditing ? (
                            <input
                              ref={editInputRef}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={() => finishEditing(true)}
                              className="w-full h-full bg-white outline-none text-[13px] px-1 border border-blue-500"
                            />
                          ) : badge ? (
                            <span className={`truncate whitespace-nowrap ${textClass}`}>
                              {badge}
                            </span>
                          ) : (
                            <span className={`truncate whitespace-nowrap ${textClass}`}>
                              {value}
                            </span>
                          )}
                        </div>
                      );
                    })}
                    <div className="flex-1 h-full border-b border-gray-200" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
