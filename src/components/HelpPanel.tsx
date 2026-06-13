import { HelpCircle, Keyboard, Eye, BookOpen, Zap } from "lucide-react";
import type { HelpSection } from "@/types";

const helpSections: HelpSection[] = [
  {
    title: "快捷键操作",
    items: [
      { keys: "Ctrl/⌘ + H", description: "切换伪装/编辑模式（老板键）" },
      { keys: "Ctrl/⌘ + Shift + N", description: "打开/关闭单元格笔记面板" },
      { keys: "Ctrl/⌘ + →", description: "切换到下一个资讯分类" },
      { keys: "Ctrl/⌘ + ←", description: "切换到上一个资讯分类" },
      { keys: "Ctrl/⌘ + 1~6", description: "快速跳转到第N个分类标签" },
      { keys: "Esc", description: "关闭弹窗 / 退出伪装模式" },
    ],
  },
  {
    title: "笔记功能",
    items: [
      { keys: "1", description: "右键点击单元格，选择「添加/编辑笔记」" },
      { keys: "2", description: "或使用快捷键 Ctrl/⌘ + Shift + N 打开笔记面板" },
      { keys: "3", description: "也可点击审阅选项卡的「新建批注」按钮" },
      { keys: "4", description: "笔记内容会自动伪装成 Excel 公式保存在单元格中" },
      { keys: "5", description: "可添加多个标签对待办事项进行分类标记" },
      { keys: "6", description: "支持待办清单，可勾选标记完成状态" },
    ],
  },
  {
    title: "使用指南",
    items: [
      { keys: "1", description: "底部 Sheet 标签对应不同资讯分类" },
      { keys: "2", description: "点击右侧资讯标题可查看完整文章" },
      { keys: "3", description: "察觉有人靠近时，按 Ctrl+H 切换伪装" },
      { keys: "4", description: "伪装模式显示真实财务表格数据" },
      { keys: "5", description: "伪装模式下再次按 Ctrl+H 恢复浏览" },
    ],
  },
  {
    title: "伪装技巧",
    items: [
      { keys: "★", description: "伪装模式下按 Esc 也可恢复" },
      { keys: "★", description: "切换伪装无动画效果，瞬间切换" },
      { keys: "★", description: "页面标题始终显示 Excel 文件名" },
      { keys: "★", description: "可在伪装模式下假装编辑公式栏" },
      { keys: "★", description: "伪装模式下可正常滚动查看财务数据" },
    ],
  },
];

const helpTips = [
  {
    icon: Zap,
    title: "热闻提示",
    content: "红色热度标识越高，文章越热门",
    color: "text-red-500",
  },
  {
    icon: Eye,
    title: "伪装提示",
    content: "Ctrl/⌘+H 是最重要的快捷键，务必熟记",
    color: "text-excel-green",
  },
  {
    icon: BookOpen,
    title: "浏览说明",
    content: "资讯内容每小时自动刷新（模拟效果）",
    color: "text-blue-500",
  },
];

export default function HelpPanel() {
  return (
    <div className="h-full overflow-y-auto bg-white sheet-enter">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <HelpCircle size={18} className="text-excel-green" />
          <h2 className="text-[15px] font-semibold text-gray-800">
            Excel摸鱼助手 · 使用说明
          </h2>
        </div>
        <p className="text-[12px] text-gray-500 mt-1 ml-7">
          掌握以下技巧，摸鱼更安全、更高效
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {helpTips.map((tip, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <tip.icon size={16} className={tip.color} />
                <span className="text-[13px] font-medium text-gray-700">
                  {tip.title}
                </span>
              </div>
              <p className="text-[12px] text-gray-600 leading-relaxed pl-6">
                {tip.content}
              </p>
            </div>
          ))}
        </div>

        {helpSections.map((section, sIdx) => (
          <div
            key={sIdx}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-excel-green/10 to-excel-green/5 px-4 py-2.5 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Keyboard size={15} className="text-excel-green" />
                <h3 className="text-[14px] font-semibold text-gray-800">
                  {section.title}
                </h3>
                <span className="ml-auto text-[11px] text-gray-500">
                  共 {section.items.length} 项
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {section.items.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="flex items-start px-4 py-2.5 hover:bg-gray-50/80 transition-colors"
                >
                  <div className="w-[30px] h-[26px] flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] text-gray-400 font-mono">
                      {String(iIdx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex-shrink-0 min-w-[130px]">
                    <kbd className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-gradient-to-b from-white to-gray-50 border border-gray-300 text-gray-700 shadow-sm">
                      {item.keys}
                    </kbd>
                  </div>
                  <div className="flex-1 pl-3">
                    <span className="text-[13px] text-gray-700">
                      {item.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-gradient-to-r from-excel-green/5 to-blue-50 border border-excel-green/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-excel-green/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div className="flex-1">
              <h4 className="text-[14px] font-semibold text-gray-800 mb-1">
                进阶建议
              </h4>
              <ul className="text-[12.5px] text-gray-600 space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-excel-green mt-0.5">●</span>
                  <span>
                    建议将本网站收藏到名为「工作资料」的收藏夹文件夹中
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-excel-green mt-0.5">●</span>
                  <span>
                    使用浏览器全屏模式（F11）可获得更逼真的 Excel 体验
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-excel-green mt-0.5">●</span>
                  <span>
                    公共场合建议使用耳机，避免系统通知音效暴露身份
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-excel-green mt-0.5">●</span>
                  <span>
                    本工具仅供个人学习研究使用，请合理安排工作时间
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
