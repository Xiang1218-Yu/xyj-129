import { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Merge,
  Grid3x3,
  Undo2,
  Redo2,
  Paintbrush,
  Copy,
  Scissors,
  Clipboard,
  BarChart3,
  PieChart,
  Image,
  Table,
  Link2,
  FunctionSquare,
  Filter,
  SortAsc,
  Eye,
  Printer,
  ZoomIn,
  Type,
  Palette,
} from "lucide-react";

const tabs = ["文件", "开始", "插入", "页面布局", "公式", "数据", "审阅", "视图"];

export default function ExcelRibbon() {
  const [activeTab, setActiveTab] = useState("开始");

  return (
    <div className="flex flex-col no-select" style={{ height: "138px" }}>
      <div className="flex items-end bg-excel-green h-[36px] px-1 text-white text-[13px]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 h-[30px] rounded-t transition-colors ${
              activeTab === tab
                ? "bg-white text-gray-800 font-medium"
                : "hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "开始" && (
        <div className="flex-1 bg-white border-b border-gray-200 px-2 py-1 flex items-start gap-1 overflow-x-auto">
          <div className="flex flex-col items-center border-r border-gray-200 px-2 h-full">
            <div className="text-[11px] text-gray-500 mb-1">剪贴板</div>
            <div className="flex gap-1">
              <div className="ribbon-btn">
                <Clipboard size={22} className="text-excel-green" />
                <span className="text-[11px] mt-0.5">粘贴</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="ribbon-btn !py-1 !min-w-0 flex-row gap-1 !px-2">
                  <Scissors size={14} />
                  <span className="text-[11px]">剪切</span>
                </div>
                <div className="ribbon-btn !py-1 !min-w-0 flex-row gap-1 !px-2">
                  <Copy size={14} />
                  <span className="text-[11px]">复制</span>
                </div>
                <div className="ribbon-btn !py-1 !min-w-0 flex-row gap-1 !px-2">
                  <Paintbrush size={14} />
                  <span className="text-[11px]">格式刷</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center border-r border-gray-200 px-2 h-full">
            <div className="text-[11px] text-gray-500 mb-1">字体</div>
            <div className="flex flex-wrap gap-0.5 w-[220px]">
              <div className="flex items-center border border-gray-300 rounded-sm px-2 h-[28px] text-[12px] bg-white w-[110px]">
                <Type size={14} className="mr-1 text-gray-500" />
                微软雅黑
              </div>
              <div className="flex items-center border border-gray-300 rounded-sm px-2 h-[28px] text-[12px] bg-white w-[60px] justify-between">
                <span>11</span>
              </div>
              <div className="flex gap-0.5 ml-0.5">
                <div className="w-[28px] h-[28px] flex items-center justify-center rounded-sm hover:bg-gray-100 border border-gray-200">
                  <Bold size={14} />
                </div>
                <div className="w-[28px] h-[28px] flex items-center justify-center rounded-sm hover:bg-gray-100 border border-gray-200">
                  <Italic size={14} />
                </div>
                <div className="w-[28px] h-[28px] flex items-center justify-center rounded-sm hover:bg-gray-100 border border-gray-200">
                  <Underline size={14} />
                </div>
                <div className="w-[28px] h-[28px] flex items-center justify-center rounded-sm hover:bg-gray-100 border border-gray-200">
                  <Strikethrough size={14} />
                </div>
              </div>
              <div className="flex gap-0.5 mt-1">
                <div className="w-[28px] h-[28px] flex items-center justify-center rounded-sm hover:bg-gray-100 border border-gray-200">
                  <Palette size={14} className="text-red-500" />
                </div>
                <div className="w-[28px] h-[28px] flex items-center justify-center rounded-sm hover:bg-gray-100 border border-gray-200">
                  <div className="w-4 h-4 bg-yellow-300 border border-gray-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center border-r border-gray-200 px-2 h-full">
            <div className="text-[11px] text-gray-500 mb-1">对齐方式</div>
            <div className="flex flex-wrap gap-0.5 w-[130px]">
              <div className="w-[28px] h-[28px] flex items-center justify-center rounded-sm hover:bg-gray-100 border border-gray-200">
                <AlignLeft size={14} />
              </div>
              <div className="w-[28px] h-[28px] flex items-center justify-center rounded-sm hover:bg-gray-100 border border-gray-200 bg-blue-50">
                <AlignCenter size={14} />
              </div>
              <div className="w-[28px] h-[28px] flex items-center justify-center rounded-sm hover:bg-gray-100 border border-gray-200">
                <AlignRight size={14} />
              </div>
              <div className="w-[28px] h-[28px] flex items-center justify-center rounded-sm hover:bg-gray-100 border border-gray-200">
                <AlignJustify size={14} />
              </div>
              <div className="w-[28px] h-[28px] flex items-center justify-center rounded-sm hover:bg-gray-100 border border-gray-200">
                <Merge size={14} />
              </div>
              <div className="w-[28px] h-[28px] flex items-center justify-center rounded-sm hover:bg-gray-100 border border-gray-200">
                <Grid3x3 size={14} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center border-r border-gray-200 px-2 h-full">
            <div className="text-[11px] text-gray-500 mb-1">数字</div>
            <div className="flex gap-0.5">
              <div className="flex items-center border border-gray-300 rounded-sm px-2 h-[28px] text-[12px] bg-white w-[120px] justify-between">
                <span>常规</span>
                <span className="text-gray-400">▼</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="ribbon-btn !py-1 !min-w-0 flex-row gap-1 !px-2">
                  <span className="text-[12px] font-bold">%</span>
                  <span className="text-[11px]">%</span>
                </div>
                <div className="ribbon-btn !py-1 !min-w-0 flex-row gap-1 !px-2">
                  <span className="text-[12px]">0.00</span>
                  <span className="text-[11px]">,0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center border-r border-gray-200 px-2 h-full">
            <div className="text-[11px] text-gray-500 mb-1">样式</div>
            <div className="flex gap-0.5">
              <div className="ribbon-btn">
                <Table size={20} className="text-excel-green" />
                <span className="text-[11px] mt-0.5">条件格式</span>
              </div>
              <div className="ribbon-btn">
                <Palette size={20} className="text-orange-500" />
                <span className="text-[11px] mt-0.5">套用格式</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center px-2 h-full">
            <div className="text-[11px] text-gray-500 mb-1">单元格</div>
            <div className="flex gap-0.5">
              <div className="ribbon-btn">
                <Undo2 size={20} className="text-blue-500" />
                <span className="text-[11px] mt-0.5">插入</span>
              </div>
              <div className="ribbon-btn">
                <Redo2 size={20} className="text-red-500" />
                <span className="text-[11px] mt-0.5">删除</span>
              </div>
              <div className="ribbon-btn">
                <Filter size={20} className="text-gray-600" />
                <span className="text-[11px] mt-0.5">格式</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "插入" && (
        <div className="flex-1 bg-white border-b border-gray-200 px-2 py-1 flex items-start gap-1 overflow-x-auto">
          <div className="flex flex-col items-center border-r border-gray-200 px-2 h-full">
            <div className="text-[11px] text-gray-500 mb-1">表格</div>
            <div className="flex gap-1">
              <div className="ribbon-btn">
                <Table size={22} className="text-excel-green" />
                <span className="text-[11px] mt-0.5">表格</span>
              </div>
              <div className="ribbon-btn">
                <BarChart3 size={22} className="text-blue-600" />
                <span className="text-[11px] mt-0.5">数据透视表</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center border-r border-gray-200 px-2 h-full">
            <div className="text-[11px] text-gray-500 mb-1">图表</div>
            <div className="flex gap-1">
              <div className="ribbon-btn">
                <BarChart3 size={22} className="text-blue-500" />
                <span className="text-[11px] mt-0.5">柱形图</span>
              </div>
              <div className="ribbon-btn">
                <PieChart size={22} className="text-orange-500" />
                <span className="text-[11px] mt-0.5">饼图</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center px-2 h-full">
            <div className="text-[11px] text-gray-500 mb-1">插图</div>
            <div className="flex gap-1">
              <div className="ribbon-btn">
                <Image size={22} className="text-purple-500" />
                <span className="text-[11px] mt-0.5">图片</span>
              </div>
              <div className="ribbon-btn">
                <Link2 size={22} className="text-gray-600" />
                <span className="text-[11px] mt-0.5">链接</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "数据" && (
        <div className="flex-1 bg-white border-b border-gray-200 px-2 py-1 flex items-start gap-1 overflow-x-auto">
          <div className="flex flex-col items-center px-2 h-full">
            <div className="text-[11px] text-gray-500 mb-1">排序和筛选</div>
            <div className="flex gap-1">
              <div className="ribbon-btn">
                <SortAsc size={22} className="text-excel-green" />
                <span className="text-[11px] mt-0.5">排序</span>
              </div>
              <div className="ribbon-btn">
                <Filter size={22} className="text-blue-500" />
                <span className="text-[11px] mt-0.5">筛选</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "公式" && (
        <div className="flex-1 bg-white border-b border-gray-200 px-2 py-1 flex items-start gap-1 overflow-x-auto">
          <div className="flex flex-col items-center px-2 h-full">
            <div className="text-[11px] text-gray-500 mb-1">函数库</div>
            <div className="flex gap-1">
              <div className="ribbon-btn">
                <FunctionSquare size={22} className="text-excel-green" />
                <span className="text-[11px] mt-0.5">fx 插入函数</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "视图" && (
        <div className="flex-1 bg-white border-b border-gray-200 px-2 py-1 flex items-start gap-1 overflow-x-auto">
          <div className="flex flex-col items-center px-2 h-full">
            <div className="text-[11px] text-gray-500 mb-1">工作簿视图</div>
            <div className="flex gap-1">
              <div className="ribbon-btn bg-blue-50">
                <Eye size={22} className="text-excel-green" />
                <span className="text-[11px] mt-0.5">普通</span>
              </div>
              <div className="ribbon-btn">
                <Printer size={22} className="text-gray-600" />
                <span className="text-[11px] mt-0.5">页面布局</span>
              </div>
              <div className="ribbon-btn">
                <ZoomIn size={22} className="text-gray-600" />
                <span className="text-[11px] mt-0.5">缩放</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {["文件", "页面布局", "审阅"].includes(activeTab) && (
        <div className="flex-1 bg-white border-b border-gray-200 px-2 py-1 flex items-center justify-center">
          <span className="text-gray-400 text-sm">「{activeTab}」选项卡功能区</span>
        </div>
      )}
    </div>
  );
}
