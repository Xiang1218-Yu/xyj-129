import { useState } from "react";
import {
  ArrowLeft,
  X,
  Share2,
  Bookmark,
  Clock,
  User,
  Flame,
  Newspaper,
  ThumbsUp,
  MessageSquare,
  Send,
  Check,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { getNewsById } from "@/data/newsData";
import { categories } from "@/data/categories";

export default function NewsDetail() {
  const {
    showDetail,
    selectedNewsId,
    closeNewsDetail,
    activeSheet,
    likedNews,
    newsLikeCount,
    newsCommentCount,
    commentInputVisible,
    toggleLikeNews,
    toggleCommentInput,
    addComment,
  } = useAppStore();

  const [commentText, setCommentText] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!showDetail || !selectedNewsId) return null;

  const news = getNewsById(selectedNewsId);
  if (!news) return null;

  const category = categories.find((c) => c.id === news.category);
  const isCurrentCategory = activeSheet === news.category;

  const isLiked = likedNews[news.id];
  const likeCount = newsLikeCount[news.id] || 0;
  const commentCount = newsCommentCount[news.id] || 0;
  const showCommentInput = commentInputVisible[news.id];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const handleLike = () => {
    toggleLikeNews(news.id);
    showToast(isLiked ? "已取消点赞" : "点赞成功 ♥");
  };

  const handleCommentToggle = () => {
    if (!showCommentInput) {
      setCommentText("");
    }
    toggleCommentInput(news.id);
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) {
      showToast("请输入评论内容");
      return;
    }
    addComment(news.id);
    setCommentText("");
    showToast("评论发表成功");
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    showToast(!bookmarked ? "已加入收藏" : "已取消收藏");
  };

  const handleShare = () => {
    showToast("分享链接已复制到剪贴板");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[60] bg-gray-900/90 text-white px-5 py-2 rounded-full text-[13px] shadow-lg detail-enter">
          {toast}
        </div>
      )}

      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col detail-enter border border-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-4 py-3 rounded-t-lg">
          <button
            onClick={closeNewsDetail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={15} />
            <span>返回列表</span>
            <span className="text-[11px] text-gray-400 ml-1">(Esc)</span>
          </button>

          <div className="ml-3 flex items-center gap-2">
            {!isCurrentCategory && (
              <span className="inline-flex items-center text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                <Newspaper size={10} className="mr-0.5" />
                {category?.name}
              </span>
            )}
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-md transition-colors ${
                bookmarked
                  ? "text-excel-green bg-excel-green/10"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
              title={bookmarked ? "取消收藏" : "收藏"}
            >
              <Bookmark size={17} fill={bookmarked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title="分享"
            >
              <Share2 size={17} />
            </button>
            <button
              onClick={closeNewsDetail}
              className="p-2 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors ml-1"
              title="关闭 (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-[24px] font-bold text-gray-900 leading-tight mb-4">
              {news.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 pb-4 border-b border-gray-100 text-[12.5px] text-gray-500">
              <div className="flex items-center gap-1.5">
                <Newspaper size={13} className="text-excel-green" />
                <span>{news.source}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User size={13} />
                <span>{news.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} />
                <span>{news.publishTime}</span>
              </div>
              <div className="flex items-center gap-1.5 text-red-500 font-medium">
                <Flame size={14} />
                <span>热度 {news.hot.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-white border-l-4 border-excel-green rounded-r-lg p-4 mb-6">
              <div className="text-[12px] font-semibold text-excel-green mb-1.5">
                📌 文章摘要
              </div>
              <p className="text-[14px] text-gray-700 leading-relaxed italic">
                {news.summary}
              </p>
            </div>

            <div
              className="news-content text-[15px] text-gray-800"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

            {showCommentInput && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-[13px] font-semibold text-gray-700 mb-2">
                  发表评论：
                </div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="说说你的看法..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md text-[13px] outline-none focus:border-excel-green focus:ring-1 focus:ring-excel-green/30 resize-none"
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === "Enter") {
                      handleSubmitComment();
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="text-[11px] text-gray-400">Ctrl+Enter 快速发表</div>
                  <button
                    onClick={handleSubmitComment}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-excel-green text-white text-[12.5px] hover:bg-excel-greenDark transition-colors"
                  >
                    <Send size={13} />
                    发表评论
                  </button>
                </div>
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[13px] transition-colors ${
                      isLiked
                        ? "bg-gradient-to-r from-red-100 to-orange-100 text-red-600 border-red-300"
                        : "bg-gradient-to-r from-red-50 to-orange-50 text-red-600 border-red-200 hover:from-red-100 hover:to-orange-100"
                    }`}
                  >
                    {isLiked ? (
                      <>
                        <Check size={15} />
                        已点赞 ({likeCount.toLocaleString()})
                      </>
                    ) : (
                      <>
                        <ThumbsUp size={15} />
                        有道理 ({likeCount.toLocaleString()})
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCommentToggle}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[13px] transition-colors ${
                      showCommentInput
                        ? "bg-excel-green/10 text-excel-green border-excel-green/40"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <MessageSquare size={15} />
                    评论 ({commentCount.toLocaleString()})
                  </button>
                </div>
                <button
                  onClick={closeNewsDetail}
                  className="px-4 py-2 rounded-md bg-excel-green text-white text-[13px] font-medium hover:bg-excel-greenDark transition-colors"
                >
                  继续浏览 →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-6 py-2.5 rounded-b-lg flex items-center justify-between">
          <div className="text-[11.5px] text-gray-500">
            提示：按 Esc 键可快速返回列表，按 Ctrl+H 切换伪装模式
          </div>
          <div className="text-[11px] text-gray-400">
            内容仅供娱乐，数据为模拟演示
          </div>
        </div>
      </div>
    </div>
  );
}
