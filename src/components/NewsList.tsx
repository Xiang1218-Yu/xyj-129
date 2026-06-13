import {
  Flame,
  ExternalLink,
  Clock,
  Newspaper,
  TrendingUp,
  User,
  Search,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { getNewsByCategory, formatHotNumber } from "@/data/newsData";
import { categories } from "@/data/categories";

export default function NewsList() {
  const { activeSheet, openNewsDetail, setSelectedCell } = useAppStore();
  const [searchKeyword, setSearchKeyword] = useState("");

  const currentCategory = categories.find((c) => c.id === activeSheet);
  const newsList = getNewsByCategory(activeSheet);

  const filteredList = useMemo(() => {
    if (!searchKeyword.trim()) return newsList;
    const kw = searchKeyword.toLowerCase();
    return newsList.filter(
      (n) =>
        n.title.toLowerCase().includes(kw) ||
        n.summary.toLowerCase().includes(kw) ||
        n.source.toLowerCase().includes(kw)
    );
  }, [newsList, searchKeyword]);

  const sortedList = useMemo(
    () => [...filteredList].sort((a, b) => b.hot - a.hot),
    [filteredList]
  );

  const handleRowClick = (newsId: number, rowIndex: number) => {
    setSelectedCell({ row: rowIndex + 2, col: "C" });
    openNewsDetail(newsId);
  };

  if (activeSheet === "help" || newsList.length === 0) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-white sheet-enter">
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Newspaper size={18} className="text-excel-green" />
            <h2 className="text-[15px] font-semibold text-gray-800">
              {currentCategory?.name}资讯 · 热文榜
            </h2>
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              共 {newsList.length} 篇
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-500">
            <TrendingUp size={13} className="text-red-500" />
            <span>实时热度</span>
            <span className="text-green-600 ml-1">● 更新中</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-[13px] outline-none focus:border-excel-green focus:ring-1 focus:ring-excel-green/30 transition-colors"
              placeholder={`搜索${currentCategory?.name}相关资讯...`}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <div className="text-[12px] text-gray-500">
            {searchKeyword && `已筛选：${filteredList.length} 条结果`}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200 px-4 py-2 text-[12px] font-semibold text-gray-600 no-select">
          <div className="w-[50px] text-center flex-shrink-0">排名</div>
          <div className="flex-1 min-w-0 px-2">标题 / 摘要</div>
          <div className="w-[100px] flex-shrink-0 px-2 flex items-center gap-1">
            <Flame size={13} className="text-orange-500" />
            热度
          </div>
          <div className="w-[100px] flex-shrink-0 px-2 flex items-center gap-1">
            <User size={12} />
            来源
          </div>
          <div className="w-[130px] flex-shrink-0 px-2 flex items-center gap-1">
            <Clock size={12} />
            发布时间
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sortedList.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 py-16">
              <div className="text-center">
                <Search size={40} className="mx-auto mb-2 text-gray-300" />
                <p className="text-[14px]">未找到相关资讯</p>
                <p className="text-[12px] text-gray-400 mt-1">
                  尝试更换关键词或清空搜索
                </p>
              </div>
            </div>
          ) : (
            sortedList.map((news, index) => (
              <div
                key={news.id}
                className="news-row border-b border-gray-100 px-4 py-3 cursor-pointer transition-colors group"
                onClick={() => handleRowClick(news.id, index)}
              >
                <div className="flex items-start">
                  <div className="w-[50px] flex-shrink-0 flex items-center justify-center pt-1">
                    {index < 3 ? (
                      <span
                        className={`w-[26px] h-[26px] rounded-md flex items-center justify-center text-[13px] font-bold text-white shadow-sm ${
                          index === 0
                            ? "bg-gradient-to-br from-red-500 to-orange-500"
                            : index === 1
                            ? "bg-gradient-to-br from-orange-400 to-yellow-500"
                            : "bg-gradient-to-br from-yellow-500 to-amber-400"
                        }`}
                      >
                        {index + 1}
                      </span>
                    ) : (
                      <span className="text-[14px] font-medium text-gray-400">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 px-2">
                    <div className="flex items-start gap-2 mb-1">
                      <h3 className="text-[14px] font-medium text-gray-900 leading-snug group-hover:text-excel-green transition-colors line-clamp-1 flex-1">
                        {news.title}
                      </h3>
                      <ExternalLink
                        size={13}
                        className="text-gray-400 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <p className="text-[12.5px] text-gray-500 leading-relaxed line-clamp-2">
                      {news.summary}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {index < 5 && (
                        <span className="inline-flex items-center gap-0.5 text-[10.5px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                          <Flame size={10} /> 热
                        </span>
                      )}
                      {news.hot >= 8000000 && (
                        <span className="inline-flex items-center text-[10.5px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                          🔥 爆
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-[100px] flex-shrink-0 px-2 pt-0.5">
                    <div
                      className={`text-[14px] font-bold flex items-center gap-1 ${
                        news.hot >= 8000000
                          ? "text-red-500"
                          : news.hot >= 5000000
                          ? "text-orange-500"
                          : "text-gray-600"
                      }`}
                    >
                      <Flame size={13} className="flex-shrink-0" />
                      {formatHotNumber(news.hot)}
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-400 to-orange-400 rounded-full"
                        style={{
                          width: `${Math.min(100, (news.hot / 10000000) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="w-[100px] flex-shrink-0 px-2 pt-1">
                    <span className="inline-block text-[12px] text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                      {news.source}
                    </span>
                  </div>

                  <div className="w-[130px] flex-shrink-0 px-2 pt-1">
                    <span className="text-[12px] text-gray-500">
                      {news.publishTime}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
