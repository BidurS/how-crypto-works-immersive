import { useState, useEffect } from 'react';

export interface ChapterProgress {
  completed: boolean;
  score: number;
  totalQuestions: number;
}

export interface UserProgress {
  chapters: Record<string, ChapterProgress>;
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('crypto_book_progress');
    return saved ? JSON.parse(saved) : { chapters: {} };
  });

  useEffect(() => {
    localStorage.setItem('crypto_book_progress', JSON.stringify(progress));
  }, [progress]);

  const saveQuizResult = (slug: string, score: number, totalQuestions: number) => {
    setProgress((prev) => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        [slug]: {
          completed: true,
          score,
          totalQuestions
        }
      }
    }));
  };

  const getChapterProgress = (slug: string) => {
    return progress.chapters[slug] || { completed: false, score: 0, totalQuestions: 0 };
  };

  const calculateTotalProgress = (totalChapters: number) => {
    const completedCount = Object.values(progress.chapters).filter(c => c.completed).length;
    return Math.round((completedCount / totalChapters) * 100);
  };

  return {
    progress,
    saveQuizResult,
    getChapterProgress,
    calculateTotalProgress
  };
}
