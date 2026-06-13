import { useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { getNewsByCategory } from "@/data/newsData";
import { categories } from "@/data/categories";
import {
  Eye,
  EyeOff,
  TrendingUp,
  Clock,
  ChevronDown,
  Check,
  X,
  Filter,
  BarChart3,
  ArrowUpDown,
  RefreshCw,
  BookOpenCheck,
} from "lucide-react";

type ReadFilter = "all" | "unread" | "read";
type TimeFilter = "all" | "today" | "week" | "older";
type SortBy = "hot" | "time" | "timeAsc" | "progressAsc" | "progressDesc";

export default function NewsList() {
  const {
    activeSheet,
    openNewsDetail,
    setSelectedCell,
    newsReadStatus,
    markNewsAsRead,
    markNewsAsUnread,
    markAllNewsAsRead,
    clearAllReadStatus,
  } = useAppStore();

  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("hot");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const currentCategory = categories.find((c) => c.id === activeSheet);
  const newsList = getNewsByCategory(activeSheet);

  const sources = useMemo(() => {
    const map = new Map<string, { name: string; count: number; totalHot: number; readCount: number }>();
    newsList.forEach((n) => {
      if (!map.has(n.source)) {
        map.set(n.source, { name: n.source, count: 0, totalHot: 0, readCount: 0 });
      }
      const info = map.get(n.source)!;
      info.count += 1;
      info.totalHot += n.hot;
      if (newsReadStatus[n.id]?.read) info.readCount += 1;
    });
    return Array.from(map.values()).sort((a, b) => b.totalHot - a.totalHot);
  }, [newsList, newsReadStatus]);

  const stats = useMemo(() => {
    let readCount = 0;
    let unreadCount = 0;
    let avgProgress = 0;
    newsList.forEach((n) => {
      const s = newsReadStatus[n.id];
      if (s?.read) {
        readCount += 1;
        avgProgress += s.progress;
      } else {
        unreadCount += 1;
      }
    });
    avgProgress = readCount > 0 ? Math.round(avgProgress / readCount) : 0;
    return { readCount, unreadCount, total: newsList.length, avgProgress };
  }, [newsList, newsReadStatus]);

  const filteredList = useMemo(() => {
    let list = [...newsList];

    if (selectedSource) {
      list = list.filter((n) => n.source === selectedSource);
    }

    if (readFilter === "read") {
      list = list.filter((n) => newsReadStatus[n.id]?.read);
    } else if (readFilter === "unread") {
      list = list.filter((n) => !newsReadStatus[n.id]?.read);
    }

    if (timeFilter !== "all") {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const weekStart = todayStart - 7 * 86400000;

      list = list.filter((n) => {
        const t = new Date(n.publishTime).getTime();
        if (timeFilter === "today") return t >= todayStart;
        if (timeFilter === "week") return t >= weekStart;
        if (timeFilter === "older") return t < weekStart;
        return true;
      });
    }

    list.sort((a, b) => {
      if (sortBy === "hot") return b.hot - a.hot;
      if (sortBy === "time") {
        return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
      }
      if (sortBy === "timeAsc") {
        return new Date(a.publishTime).getTime() - new Date(b.publishTime).getTime();
      }
      const pa = newsReadStatus[a.id]?.progress || 0;
      const pb = newsReadStatus[b.id]?.progress || 0;
      if (sortBy === "progressDesc") return pb - pa;
      return pa - pb;
    });

    return list;
  }, [newsList, selectedSource, readFilter, timeFilter, sortBy, newsReadStatus]);

  const handleRowClick = (newsId: number, rowIndex: number) => {
    setSelectedCell({ row: rowIndex + 2, col: "G" });
    openNewsDetail(newsId);
  };

  const handleToggleReadStatus = (e: React.MouseEvent, newsId: number) => {
    e.stopPropagation();
    if (newsReadStatus[newsId]?.read) {
      markNewsAsUnread(newsId);
    } else {
      markNewsAsRead(newsId);
    }
  };

  const hasActiveFilters =
    selectedSource !== null ||
    readFilter !== "all" ||
    timeFilter !== "all" ||
    sortBy !== "hot";

  const resetFilters = () => {
    setSelectedSource(null);
    setReadFilter("all");
    setTimeFilter("all");
    setSortBy("hot");
  };

  if (activeSheet === "help" || newsList.length === 0) {
    return null;
  }

  const FilterChip = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
        active
          ? "bg-excel-green/10 text-excel-green border-excel-green/30"
          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-white sheet-enter">
      <div className="border-b border-gray-200 px-3 py-1.5 bg-gray-50">
        <div className="text-[12px] text-gray-600 leading-6">
          <span className="font-semibold text-gray-800">{currentCategory?.name}资讯</span>
          <span className="text-gray-400 mx-1">·</span>
          <span>共 {newsList.length} 篇 / 已读 {stats.readCount} 篇 / 未读 {stats.unreadCount} 篇</span>
          <span className="text-gray-400 mx-1">·</span>
          <span>
            <span className="inline-flex items-center gap-0.5">
              <BarChart3 size={11} />
              平均阅读进度 {stats.avgProgress}%
            </span>
          </span>
          {hasActiveFilters && (
            <>
              <span className="text-gray-400 mx-1">·</span>
              <span>
                当前显示 <span className="font-medium text-gray-800">{filteredList.length}</span> 条
                <button
                  onClick={resetFilters}
                  className="ml-1 text-blue-600 hover:underline text-[11px] inline-flex items-center gap-0.5"
                >
                  <X size={11} />
                  重置筛选
                </button>
              </span>
            </>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200 px-3 py-2 bg-white flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-gray-400 mr-1">阅读状态：</span>
          <FilterChip
            active={readFilter === "all"}
            onClick={() => setReadFilter("all")}
          >
            全部
          </FilterChip>
          <FilterChip
            active={readFilter === "unread"}
            onClick={() => setReadFilter("unread")}
          >
            <EyeOff size={11} />
            未读 ({stats.unreadCount})
          </FilterChip>
          <FilterChip
            active={readFilter === "read"}
            onClick={() => setReadFilter("read")}
          >
            <Eye size={11} />
            已读 ({stats.readCount})
          </FilterChip>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-gray-400 mr-1">时间：</span>
          <FilterChip
            active={timeFilter === "all"}
            onClick={() => setTimeFilter("all")}
          >
            全部时间
          </FilterChip>
          <FilterChip
            active={timeFilter === "today"}
            onClick={() => setTimeFilter("today")}
          >
            <Clock size={11} />
            今天
          </FilterChip>
          <FilterChip
            active={timeFilter === "week"}
            onClick={() => setTimeFilter("week")}
          >
            近一周
          </FilterChip>
          <FilterChip
            active={timeFilter === "older"}
            onClick={() => setTimeFilter("older")}
          >
            更早
          </FilterChip>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-gray-400 mr-1">排序：</span>
          <FilterChip
            active={sortBy === "hot"}
            onClick={() => setSortBy("hot")}
          >
            <TrendingUp size={11} />
            热度
          </FilterChip>
          <FilterChip
            active={sortBy === "time"}
            onClick={() => setSortBy("time")}
          >
            <ArrowUpDown size={11} />
            时间↓
          </FilterChip>
          <FilterChip
            active={sortBy === "timeAsc"}
            onClick={() => setSortBy("timeAsc")}
          >
            <ArrowUpDown size={11} />
            时间↑
          </FilterChip>
          <FilterChip
            active={sortBy === "progressDesc"}
            onClick={() => setSortBy("progressDesc")}
          >
            <BookOpenCheck size={11} />
            进度↓
          </FilterChip>
          <FilterChip
            active={sortBy === "progressAsc"}
            onClick={() => setSortBy("progressAsc")}
          >
            <BookOpenCheck size={11} />
            进度↑
          </FilterChip>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] border transition-colors ${
              showFilterPanel
                ? "bg-excel-green/10 text-excel-green border-excel-green/30"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Filter size={11} />
            平台筛选
            <ChevronDown
              size={10}
              className={`transition-transform ${showFilterPanel ? "rotate-180" : ""}`}
            />
          </button>
          <button
            onClick={markAllNewsAsRead}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
          >
            <Check size={11} />
            全部标已读
          </button>
          <button
            onClick={clearAllReadStatus}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={11} />
            清除记录
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto text-[12px]">
        {showFilterPanel && (
          <>
            <div className="border-b border-gray-200 px-3 py-1.5 bg-gray-100">
              <span className="font-semibold text-gray-700">资讯平台列表</span>
              {selectedSource && (
                <button
                  onClick={() => setSelectedSource(null)}
                  className="ml-2 text-blue-600 hover:underline text-[11px]"
                >
                  取消平台筛选
                </button>
              )}
            </div>

            <div>
              {sources.map((s, idx) => {
                const isSelected = selectedSource === s.name;
                const unreadCount = s.count - s.readCount;
                return (
                  <div
                    key={s.name}
                    onClick={() => setSelectedSource(isSelected ? null : s.name)}
                    className={`flex items-center border-b border-gray-100 px-3 py-1.5 cursor-default ${
                      isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-6 text-right text-gray-400">{idx + 1}</div>
                    <div className="flex-1 px-2 text-gray-800">
                      <span className="flex items-center gap-2">
                        {s.name}
                        {isSelected && (
                          <Check size={12} className="text-blue-600" />
                        )}
                      </span>
                    </div>
                    <div className="w-28 text-right">
                      <span className="text-gray-500">{s.count} 篇</span>
                      <span className="text-gray-300 mx-1">|</span>
                      <span className="text-green-600">读 {s.readCount}</span>
                      <span className="text-gray-300 mx-1">|</span>
                      <span className="text-orange-600">未读 {unreadCount}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-b border-gray-200 border-t border-gray-200 px-3 py-1.5 bg-gray-100 mt-1">
              <span className="font-semibold text-gray-700">
                资讯热文列表 {selectedSource ? `（${selectedSource}）` : ""}
              </span>
            </div>
          </>
        )}

        <div>
          <div className="flex items-center border-b border-gray-200 px-3 py-1.5 bg-gray-50 text-gray-600">
            <div className="w-10 text-center">序号</div>
            <div className="flex-1 px-2">标题</div>
            <div className="w-16 text-center">状态</div>
            <div className="w-20 text-center">进度</div>
            <div className="w-20 text-center">热度</div>
            <div className="w-24 text-center">发布时间</div>
          </div>

          {filteredList.length === 0 ? (
            <div className="px-3 py-12 text-center text-gray-400">
              <Filter size={32} className="mx-auto mb-2 text-gray-300" />
              <div className="text-[13px]">没有符合筛选条件的文章</div>
              <button
                onClick={resetFilters}
                className="mt-3 text-blue-600 hover:underline text-[12px]"
              >
                重置筛选条件
              </button>
            </div>
          ) : (
            filteredList.map((news, index) => {
              const status = newsReadStatus[news.id];
              const isRead = status?.read;
              const progress = status?.progress || 0;

              const progressColor =
                progress >= 100
                  ? "bg-green-500"
                  : progress >= 60
                  ? "bg-excel-green"
                  : progress >= 30
                  ? "bg-yellow-500"
                  : progress > 0
                  ? "bg-blue-500"
                  : "bg-gray-200";

              return (
                <div
                  key={news.id}
                  onClick={() => handleRowClick(news.id, index)}
                  className={`flex items-start border-b border-gray-100 px-3 py-1.5 cursor-default transition-colors ${
                    isRead
                      ? "bg-gray-50/50 hover:bg-blue-50/50"
                      : "hover:bg-blue-50"
                  }`}
                >
                  <div className={`w-10 text-center flex-shrink-0 pt-0.5 ${
                    isRead ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {index + 1}
                  </div>

                  <div className="flex-1 px-2 min-w-0">
                    <div className={`leading-5 truncate ${
                      isRead
                        ? "text-gray-500 font-normal"
                        : "text-gray-900 font-medium"
                    }`}>
                      {!isRead && (
                        <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 align-middle flex-shrink-0 mb-0.5" />
                      )}
                      {news.title}
                    </div>
                    <div className={`text-[11px] mt-0.5 flex items-center gap-2 flex-wrap ${
                      isRead ? "text-gray-400" : "text-gray-500"
                    }`}>
                      <span>来源：{news.source}</span>
                      <span>·</span>
                      <span>作者：{news.author}</span>
                      {progress > 0 && progress < 100 && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <span>阅读中 {progress}%</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="w-16 text-center flex-shrink-0 pt-0.5">
                    <button
                      onClick={(e) => handleToggleReadStatus(e, news.id)}
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                        isRead
                          ? "text-green-600 bg-green-50 hover:bg-green-100"
                          : "text-orange-600 bg-orange-50 hover:bg-orange-100"
                      }`}
                      title={isRead ? "点击标记为未读" : "点击标记为已读"}
                    >
                      {isRead ? (
                        <>
                          <Eye size={11} />
                          已读
                        </>
                      ) : (
                        <>
                          <EyeOff size={11} />
                          未读
                        </>
                      )}
                    </button>
                  </div>

                  <div className="w-20 text-center flex-shrink-0 pt-0.5">
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${progressColor}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className={`text-[10px] ${
                        progress >= 80
                          ? "text-green-600"
                          : progress > 0
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}>
                        {progress}%
                      </span>
                    </div>
                  </div>

                  <div className={`w-20 text-right flex-shrink-0 pt-0.5 ${
                    isRead ? "text-gray-400" : "text-gray-700"
                  }`}>
                    {news.hot.toLocaleString()}
                  </div>

                  <div className={`w-24 text-right flex-shrink-0 pt-0.5 ${
                    isRead ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {news.publishTime.slice(5)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
