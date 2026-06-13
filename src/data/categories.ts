import { Category } from "@/types";

export const categories: Category[] = [
  { id: "help", name: "使用说明", order: 0 },
  { id: "office", name: "Office助手", order: 1 },
  { id: "tech", name: "科技", order: 2 },
  { id: "military", name: "军事", order: 3 },
  { id: "finance", name: "财经", order: 4 },
  { id: "entertainment", name: "娱乐", order: 5 },
  { id: "sports", name: "体育", order: 6 },
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find((c) => c.id === id);
};

export const getNextCategory = (currentId: string): Category => {
  const idx = categories.findIndex((c) => c.id === currentId);
  const nextIdx = (idx + 1) % categories.length;
  return categories[nextIdx];
};

export const getPrevCategory = (currentId: string): Category => {
  const idx = categories.findIndex((c) => c.id === currentId);
  const prevIdx = (idx - 1 + categories.length) % categories.length;
  return categories[prevIdx];
};
