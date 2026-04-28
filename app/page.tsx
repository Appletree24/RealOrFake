import { QuizApp } from "@/components/quiz-app";
import { dailyChallenge } from "@/data/daily";

export default function Home() {
  return <QuizApp challenge={dailyChallenge} />;
}
