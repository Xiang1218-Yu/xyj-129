import { useState, useMemo } from "react";
import { Copy, Check, Search, Sparkles, ChevronDown, ChevronUp, ClipboardList } from "lucide-react";
import { officePhraseCategories } from "@/data/officePhrases";
import type { OfficePhrase } from "@/types";

export default function OfficeAssistant() {
  const [activeCategory, setActiveCategory] = useState(
    officePhraseCategories[0]?.id || "leave"
  );
  const [searchText, setSearchText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const currentCategory = officePhraseCategories.find(
    (c) => c.id === activeCategory
  );

  const filteredPhrases = useMemo(() => {
    if (!currentCategory) return [];
    if (!searchText.trim()) return currentCategory.phrases;
    const keyword = searchText.toLowerCase();
    return currentCategory.phrases.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        p.content.toLowerCase().includes(keyword) ||
        p.tags?.some((t) => t.toLowerCase().includes(keyword))
    );
  }, [currentCategory, searchText]);

  const handleCopy = async (phrase: OfficePhrase) => {
    try {
      await navigator.clipboard.writeText(phrase.content);
      setCopiedId(phrase.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = phrase.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedId(phrase.id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const totalPhrases = officePhraseCategories.reduce(
    (sum, c) => sum + c.phrases.length,
    0
  );

  return (
    <div className="h-full overflow-hidden bg-white sheet-enter flex flex-col">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-excel-green flex items-center justify-center">
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <h2 className="text-[14px] font-semibold text-gray-800">
              Office 智能助手
            </h2>
            <p className="text-[11px] text-gray-500">
              职场话术模板 · 一键复制使用
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="flex items-center gap-1 text-[11px] text-gray-500 bg-white px-2 py-0.5 border border-gray-200 rounded-sm">
              <ClipboardList size={11} />
              <span>{totalPhrases} 条模板</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white px-3 py-1.5 flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <Search size={12} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜索话术..."
            className="flex-1 min-w-0 px-2 py-1 text-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-gray-300 rounded-sm"
          />
        </div>
      </div>

      <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
        {officePhraseCategories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] border-r border-gray-200 whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-white text-excel-green font-medium border-b-2 border-b-excel-green -mb-px"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.name}</span>
              <span className={`text-[10px] ${isActive ? "text-excel-green/70" : "text-gray-400"}`}>
                ({cat.phrases.length})
              </span>
            </button>
          );
        })}
      </div>

      <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-200 text-[11px] text-gray-500 flex-shrink-0">
        {currentCategory?.description}
        <span className="ml-2 text-gray-400">
          · 当前显示 {filteredPhrases.length} 条
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredPhrases.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
            <Search size={32} className="mb-2 opacity-40" />
            <p className="text-[13px]">没有找到匹配的话术</p>
            <p className="text-[11px] mt-1">换个关键词试试吧</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredPhrases.map((phrase) => {
            const isCopied = copiedId === phrase.id;
            const isExpanded = expandedId === phrase.id;
            const isLong = phrase.content.length > 60;
            return (
              <div
                key={phrase.id}
                className="px-3 py-2 hover:bg-blue-50/50 group"
              >
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => handleCopy(phrase)}
                    className={`flex-shrink-0 mt-0.5 w-14 h-7 flex items-center justify-center gap-1 text-[11px] font-medium rounded-sm border transition-all ${
                      isCopied
                        ? "bg-excel-green text-white border-excel-green"
                        : "bg-white text-gray-600 border-gray-300 hover:border-excel-green hover:text-excel-green"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check size={12} />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        复制
                      </>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13px] font-medium text-gray-800">
                        {phrase.title}
                      </span>
                      {phrase.tags && phrase.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          {phrase.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-1.5 py-px bg-gray-100 text-gray-500 rounded-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <pre className="text-[12px] text-gray-600 whitespace-pre-wrap leading-relaxed font-sans mt-1">
                      {isLong && !isExpanded
                        ? phrase.content.slice(0, 60) + "..."
                        : phrase.content}
                    </pre>
                    {isLong && (
                      <button
                        onClick={() => toggleExpand(phrase.id)}
                        className="text-[11px] text-gray-400 hover:text-gray-600 mt-0.5"
                      >
                        {isExpanded ? (
                          <span className="flex items-center gap-0.5">
                            收起 <ChevronUp size={11} />
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            展开全部 <ChevronDown size={11} />
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>

      <div className="px-3 py-1.5 border-t border-gray-200 bg-gray-50 text-[11px] text-gray-400 text-center flex-shrink-0">
        点击左侧「复制」按钮，将话术粘贴到微信/钉钉/邮件
      </div>
    </div>
  );
}
