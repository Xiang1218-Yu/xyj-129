import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { X, Plus, Trash2, Tag, CheckSquare, Square, StickyNote, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_TAG_COLORS } from "@/lib/noteCodec";
import RichTextEditor from "@/components/RichTextEditor";

export default function NotePanel() {
  const {
    showNotePanel,
    notePanelCell,
    closeNotePanel,
    getCellNote,
    updateNoteContent,
    addNoteTag,
    removeNoteTag,
    addTodo,
    toggleTodo,
    removeTodo,
    allTags,
    deleteCellNote,
    hasCellNote,
  } = useAppStore();

  const [todoInput, setTodoInput] = useState("");
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(DEFAULT_TAG_COLORS[0]);
  const [showNewTagForm, setShowNewTagForm] = useState(false);

  const note = notePanelCell ? getCellNote(notePanelCell.row, notePanelCell.col) : null;
  const hasNote = notePanelCell ? hasCellNote(notePanelCell.row, notePanelCell.col) : false;

  if (!showNotePanel || !notePanelCell) {
    return null;
  }

  const cellRef = `${notePanelCell.col}${notePanelCell.row}`;

  const handleContentChange = (value: string) => {
    updateNoteContent(notePanelCell.row, notePanelCell.col, value);
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoInput.trim()) return;
    addTodo(notePanelCell.row, notePanelCell.col, todoInput.trim());
    setTodoInput("");
  };

  const handleToggleTodo = (todoId: string) => {
    toggleTodo(notePanelCell.row, notePanelCell.col, todoId);
  };

  const handleRemoveTodo = (todoId: string) => {
    removeTodo(notePanelCell.row, notePanelCell.col, todoId);
  };

  const handleAddTag = (tag: { id: string; name: string; color: string }) => {
    addNoteTag(notePanelCell.row, notePanelCell.col, tag);
    setShowTagPicker(false);
  };

  const handleRemoveTag = (tagId: string) => {
    removeNoteTag(notePanelCell.row, notePanelCell.col, tagId);
  };

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    const { addGlobalTag } = useAppStore.getState();
    const newTag = {
      id: `tag_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      name: newTagName.trim(),
      color: newTagColor,
    };
    addGlobalTag(newTagName.trim(), newTagColor);
    addNoteTag(notePanelCell.row, notePanelCell.col, newTag);
    setNewTagName("");
    setShowNewTagForm(false);
    setShowTagPicker(false);
  };

  const handleDeleteNote = () => {
    if (confirm("确定要删除这条笔记吗？")) {
      deleteCellNote(notePanelCell.row, notePanelCell.col);
      closeNotePanel();
    }
  };

  const noteTags = note?.tags || [];
  const availableTags = allTags.filter((t) => !noteTags.some((nt) => nt.id === t.id));
  const todos = note?.todos || [];
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={closeNotePanel}>
      <div
        className="bg-white rounded-lg shadow-2xl w-[520px] max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-excel-green" />
            <span className="font-semibold text-gray-800">单元格笔记 - {cellRef}</span>
          </div>
          <div className="flex items-center gap-1">
            {hasNote && (
              <button
                onClick={handleDeleteNote}
                className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                title="删除笔记"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={closeNotePanel}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {noteTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {noteTags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                  <button
                    onClick={() => handleRemoveTag(tag.id)}
                    className="hover:bg-white/30 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div>
            <RichTextEditor
              value={note?.content || ""}
              onChange={handleContentChange}
              placeholder="在此输入笔记内容..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">标签</span>
              </div>
              <button
                onClick={() => setShowTagPicker(!showTagPicker)}
                className="text-xs text-excel-green hover:text-excel-greenDark font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                添加标签
              </button>
            </div>

            {showTagPicker && (
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 space-y-2">
                {availableTags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {availableTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleAddTag(tag)}
                        className="px-2 py-0.5 rounded-full text-xs font-medium text-white hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: tag.color }}
                      >
                        + {tag.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">没有可用的标签</p>
                )}

                {!showNewTagForm ? (
                  <button
                    onClick={() => setShowNewTagForm(true)}
                    className="text-xs text-gray-600 hover:text-gray-800 underline"
                  >
                    + 创建新标签
                  </button>
                ) : (
                  <form onSubmit={handleCreateTag} className="space-y-2 pt-2 border-t border-gray-200">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="标签名称"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-excel-green"
                      autoFocus
                    />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {DEFAULT_TAG_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewTagColor(color)}
                          className={cn(
                            "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                            newTagColor === color ? "border-gray-800 scale-110" : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-3 py-1 text-xs bg-excel-green text-white rounded hover:bg-excel-greenDark transition-colors"
                      >
                        创建
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewTagForm(false)}
                        className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                      >
                        取消
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">待办事项</span>
                {todos.length > 0 && (
                  <span className="text-xs text-gray-500">
                    ({completedCount}/{todos.length})
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleAddTodo} className="flex gap-2">
              <input
                type="text"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                placeholder="添加待办事项..."
                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-excel-green/50 focus:border-excel-green"
              />
              <button
                type="submit"
                disabled={!todoInput.trim()}
                className="px-3 py-1.5 bg-excel-green text-white text-sm rounded hover:bg-excel-greenDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                添加
              </button>
            </form>

            {todos.length > 0 && (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded group hover:bg-gray-50 transition-colors",
                      todo.completed && "opacity-60"
                    )}
                  >
                    <button
                      onClick={() => handleToggleTodo(todo.id)}
                      className="flex-shrink-0 text-gray-500 hover:text-excel-green transition-colors"
                    >
                      {todo.completed ? (
                        <Check className="w-5 h-5 text-excel-green" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                    <span
                      className={cn(
                        "flex-1 text-sm text-gray-800",
                        todo.completed && "line-through text-gray-500"
                      )}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => handleRemoveTodo(todo.id)}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {todos.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">暂无待办事项</p>
            )}
          </div>
        </div>

        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-right">
          <span className="text-xs text-gray-500">
            笔记自动保存 · 内容伪装为公式
          </span>
        </div>
      </div>
    </div>
  );
}
