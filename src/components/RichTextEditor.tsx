import { useRef, useCallback, useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Type,
  Undo2,
  Redo2,
  Palette,
  Highlighter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const FONT_COLORS = [
  "#000000",
  "#E74C3C",
  "#E67E22",
  "#F1C40F",
  "#27AE60",
  "#3498DB",
  "#9B59B6",
  "#34495E",
  "#7F8C8D",
];

const BG_COLORS = [
  "transparent",
  "#FFEB3B",
  "#CDDC39",
  "#8BC34A",
  "#00BCD4",
  "#E91E63",
  "#FF9800",
  "#9C27B0",
  "#ECEFF1",
];

const HEADING_SIZES = [
  { label: "正文", value: "p" },
  { label: "标题1", value: "h1" },
  { label: "标题2", value: "h2" },
  { label: "标题3", value: "h3" },
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "在此输入内容...",
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showFontColor, setShowFontColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);
  const [showHeading, setShowHeading] = useState(false);
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const updateActiveStates = useCallback(() => {
    try {
      setActiveStates({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikeThrough: document.queryCommandState("strikeThrough"),
        justifyLeft: document.queryCommandState("justifyLeft"),
        justifyCenter: document.queryCommandState("justifyCenter"),
        justifyRight: document.queryCommandState("justifyRight"),
        insertUnorderedList: document.queryCommandState("insertUnorderedList"),
        insertOrderedList: document.queryCommandState("insertOrderedList"),
      });
    } catch {
      // ignore
    }
  }, []);

  const execCommand = useCallback(
    (command: string, value?: string) => {
      editorRef.current?.focus();
      document.execCommand(command, false, value);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
      updateActiveStates();
    },
    [onChange, updateActiveStates]
  );

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveStates();
  }, [onChange, updateActiveStates]);

  const handleSelect = useCallback(() => {
    updateActiveStates();
  }, [updateActiveStates]);

  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveStates);
    return () => document.removeEventListener("selectionchange", updateActiveStates);
  }, [updateActiveStates]);

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition-colors",
        active && "bg-excel-green/20 text-excel-green"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className={cn("border border-gray-300 rounded-md overflow-hidden", className)}>
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setShowHeading(!showHeading);
              setShowFontColor(false);
              setShowBgColor(false);
            }}
            className="h-8 px-2 flex items-center gap-1 rounded hover:bg-gray-200 text-sm"
          >
            <Type className="w-4 h-4" />
            <span>样式</span>
            <span className="text-xs text-gray-400">▼</span>
          </button>
          {showHeading && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10 min-w-[100px]">
              {HEADING_SIZES.map((h) => (
                <button
                  key={h.value}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    execCommand("formatBlock", `<${h.value}>`);
                    setShowHeading(false);
                  }}
                  className={cn(
                    "w-full px-3 py-1.5 text-left hover:bg-gray-100",
                    h.value === "h1" && "text-2xl font-bold",
                    h.value === "h2" && "text-xl font-bold",
                    h.value === "h3" && "text-lg font-semibold",
                    h.value === "p" && "text-base"
                  )}
                >
                  {h.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton onClick={() => execCommand("undo")} title="撤销 (Ctrl+Z)">
          <Undo2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("redo")} title="重做 (Ctrl+Y)">
          <Redo2 className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => execCommand("bold")}
          active={activeStates.bold}
          title="加粗 (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("italic")}
          active={activeStates.italic}
          title="斜体 (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("underline")}
          active={activeStates.underline}
          title="下划线 (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("strikeThrough")}
          active={activeStates.strikeThrough}
          title="删除线"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <div className="relative">
          <ToolbarButton
            onClick={() => {
              setShowFontColor(!showFontColor);
              setShowBgColor(false);
              setShowHeading(false);
            }}
            title="字体颜色"
          >
            <div className="relative">
              <Palette className="w-4 h-4" />
              <div className="absolute -bottom-0.5 left-0 right-0 h-1 bg-red-500 rounded-full" />
            </div>
          </ToolbarButton>
          {showFontColor && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-10">
              <div className="grid grid-cols-9 gap-1">
                {FONT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      execCommand("foreColor", color);
                      setShowFontColor(false);
                    }}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <ToolbarButton
            onClick={() => {
              setShowBgColor(!showBgColor);
              setShowFontColor(false);
              setShowHeading(false);
            }}
            title="高亮颜色"
          >
            <Highlighter className="w-4 h-4" />
          </ToolbarButton>
          {showBgColor && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-10">
              <div className="grid grid-cols-9 gap-1">
                {BG_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      execCommand("hiliteColor", color === "transparent" ? "#ffffff" : color);
                      setShowBgColor(false);
                    }}
                    className={cn(
                      "w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform",
                      color === "transparent" && "bg-[repeating-linear-gradient(45deg,#fff,#fff_3px,#ccc_3px,#ccc_6px)]"
                    )}
                    style={{ backgroundColor: color === "transparent" ? undefined : color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => execCommand("justifyLeft")}
          active={activeStates.justifyLeft}
          title="左对齐"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("justifyCenter")}
          active={activeStates.justifyCenter}
          title="居中对齐"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("justifyRight")}
          active={activeStates.justifyRight}
          title="右对齐"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => execCommand("insertUnorderedList")}
          active={activeStates.insertUnorderedList}
          title="无序列表"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("insertOrderedList")}
          active={activeStates.insertOrderedList}
          title="有序列表"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onSelect={handleSelect}
        onMouseUp={handleSelect}
        onKeyUp={handleSelect}
        data-placeholder={placeholder}
        className="rich-text-editor min-h-[160px] p-3 text-sm text-gray-800 focus:outline-none"
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      />
    </div>
  );
}
