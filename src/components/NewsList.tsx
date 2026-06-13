import { useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { getNewsByCategory } from "@/data/newsData";
import { categories } from "@/data/categories";

export default function NewsList() {
  const { activeSheet, openNewsDetail, setSelectedCell } = useAppStore();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const currentCategory = categories.find((c) => c.id === activeSheet);
  const newsList = getNewsByCategory(activeSheet);

  const sources = useMemo(() => {
    const map = new Map<string, { name: string; count: number; totalHot: number }>();
    newsList.forEach((n) => {
      if (!map.has(n.source)) {
        map.set(n.source, { name: n.source, count: 0, totalHot: 0 });
      }
      const info = map.get(n.source)!;
      info.count += 1;
      info.totalHot += n.hot;
    });
    return Array.from(map.values()).sort((a, b) => b.totalHot - a.totalHot);
  }, [newsList]);

  const filteredList = useMemo(() => {
    const list = selectedSource
      ? newsList.filter((n) => n.source === selectedSource)
      : newsList;
    return [...list].sort((a, b) => b.hot - a.hot);
  }, [newsList, selectedSource]);

  const handleRowClick = (newsId: number, rowIndex: number) => {
    setSelectedCell({ row: rowIndex + 2, col: "G" });
    openNewsDetail(newsId);
  };

  if (activeSheet === "help" || newsList.length === 0) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-white sheet-enter">
      <div className="border-b border-gray-200 px-3 py-1.5 bg-gray-50">
        <div className="text-[12px] text-gray-600 leading-6">
          <span className="font-semibold text-gray-800">{currentCategory?.name}资讯</span>
          <span className="text-gray-400 mx-1">·</span>
          <span>共 {newsList.length} 篇文章 / {sources.length} 个平台</span>
          {selectedSource && (
            <>
              <span className="text-gray-400 mx-1">·</span>
              <span>
                当前筛选：
                <span className="font-medium text-gray-800">{selectedSource}</span>
                <button
                  onClick={() => setSelectedSource(null)}
                  className="ml-1 text-blue-600 hover:underline text-[11px]"
                >
                  取消筛选
                </button>
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto text-[12px]">
        <div className="border-b border-gray-200 px-3 py-1.5 bg-gray-100">
          <span className="font-semibold text-gray-700">资讯平台列表</span>
        </div>

        <div>
          {sources.map((s, idx) => (
            <div
              key={s.name}
              onClick={() => setSelectedSource(selectedSource === s.name ? null : s.name)}
              className={`flex items-center border-b border-gray-100 px-3 py-1.5 cursor-default ${
                selectedSource === s.name ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="w-6 text-right text-gray-400">{idx + 1}</div>
              <div className="flex-1 px-2 text-gray-800">{s.name}</div>
              <div className="w-16 text-right text-gray-500">{s.count} 篇</div>
            </div>
          ))}
        </div>

        <div className="border-b border-gray-200 border-t border-gray-200 px-3 py-1.5 bg-gray-100 mt-1">
          <span className="font-semibold text-gray-700">
            资讯热文列表 {selectedSource ? `（${selectedSource}）` : ""}
          </span>
        </div>

        <div>
          <div className="flex items-center border-b border-gray-200 px-3 py-1.5 bg-gray-50 text-gray-600">
            <div className="w-10 text-center">序号</div>
            <div className="flex-1 px-2">标题</div>
            <div className="w-24 text-center">热度</div>
            <div className="w-24 text-center">发布时间</div>
          </div>

          {filteredList.map((news, index) => (
            <div
              key={news.id}
              onClick={() => handleRowClick(news.id, index)}
              className="flex items-start border-b border-gray-100 px-3 py-1.5 cursor-default hover:bg-blue-50"
            >
              <div className="w-10 text-center text-gray-500 flex-shrink-0 pt-0.5">
                {index + 1}
              </div>
              <div className="flex-1 px-2 min-w-0">
                <div className="text-gray-900 leading-5 truncate">
                  {news.title}
                </div>
                <div className="text-gray-500 text-[11px] mt-0.5">
                  来源：{news.source} · 作者：{news.author}
                </div>
              </div>
              <div className="w-24 text-right text-gray-700 flex-shrink-0 pt-0.5">
                {news.hot.toLocaleString()}
              </div>
              <div className="w-24 text-right text-gray-500 flex-shrink-0 pt-0.5">
                {news.publishTime.slice(5)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
