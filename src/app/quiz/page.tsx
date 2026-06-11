import type { Metadata } from "next";
import { QuizPageApp } from "@/components/quiz-page";

export const metadata: Metadata = {
  title: "Подбор кондиционера за 1 минуту — НеваКлимат",
  description: "Ответьте на 4 вопроса и получите рекомендацию модели кондиционера с ценой под ключ."
};

export default function QuizPage() {
  return <QuizPageApp />;
}
