import { useState, useMemo } from "react";
import {
  Copy,
  Check,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ClipboardList,
} from "lucide-react";
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
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 via-white to-excel-green/5 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-excel-green flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-gray-800">
              Office 智能助手
            </h2>
            <p className="text-[12px] text-gray-500">
              职场话术一键生成，高效沟通不踩坑
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] text-gray-400 bg-white px-2 py-1 rounded border border-gray-200">
              <ClipboardList size={12} />
              <span>共 {totalPhrases} 条话术</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[160px] border-r border-gray-200 bg-gray-50/50 overflow-y-auto flex-shrink-0">
          {officePhraseCategories.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full px-3 py-3 text-left border-b border-gray-100 transition-all group ${
                  isActive
                    ? "bg-white border-l-2 border-l-excel-green"
                    : "hover:bg-white/70"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span
                    className={`text-[13px] font-medium ${
                      isActive ? "text-gray-900" : "text-gray-600 group-hover:text-gray-800"
                    }`}
                  >
                    {cat.name}
                  </span>
                </div>
                <div className="mt-1 pl-7">
                  <span
                    className={`text-[11px] ${
                      isActive ? "text-excel-green" : "text-gray-400"
                    }`}
                  >
                    {cat.phrases.length} 条
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="mb-2">
              <p className="text-[12px] text-gray-500">
                {currentCategory?.description}
              </p>
            </div>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="搜索话术标题、内容、标签..."
                className="w-full pl-9 pr-3 py-2 text-[13px] border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-excel-green focus:border-excel-green transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-gray-50/30">
            {filteredPhrases.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                <Search size={36} className="mb-3 opacity-40" />
                <p className="text-[13px]">没有找到匹配的话术</p>
                <p className="text-[11px] mt-1">换个关键词试试吧</p>
              </div>
            ) : (
              filteredPhrases.map((phrase) => {
                const isCopied = copiedId === phrase.id;
                const isExpanded = expandedId === phrase.id;
                const isLong = phrase.content.length > 80;
                return (
                  <div
                    key={phrase.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm hover:border-gray-300 transition-all group"
                  >
                    <div className="px-3.5 py-2.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[14px] font-medium text-gray-800 truncate">
                          {phrase.title}
                        </span>
                        {phrase.tags && phrase.tags.length > 0 && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {phrase.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 bg-excel-green/10 text-excel-green rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {isLong && (
                          <button
                            onClick={() => toggleExpand(phrase.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title={isExpanded ? "收起" : "展开"}
                          >
                            {isExpanded ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleCopy(phrase)}
                          className={`px-2.5 py-1.5 rounded text-[12px] font-medium flex items-center gap-1 transition-all ${
                            isCopied
                              ? "bg-green-500 text-white"
                              : "bg-excel-green/10 text-excel-green hover:bg-excel-green hover:text-white"
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check size={13} />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              复制
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="px-3.5 py-3 bg-white">
                      <pre
                        className={`text-[13px] text-gray-700 whitespace-pre-wrap leading-relaxed font-sans ${
                          !isExpanded && isLong ? "line-clamp-3" : ""
                        }`}
                      >
                        {phrase.content}
                      </pre>
                      {!isExpanded && isLong && (
                        <button
                          onClick={() => toggleExpand(phrase.id)}
                          className="text-[12px] text-excel-green hover:text-excel-greenDark mt-1.5 font-medium"
                        >
                          展开全部...
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-gray-200 bg-white text-[11px] text-gray-400 flex items-center justify-between flex-shrink-0">
            <span>点击「复制」即可将话术粘贴到微信/钉钉/邮件</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              当前显示 {filteredPhrases.length} 条
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
