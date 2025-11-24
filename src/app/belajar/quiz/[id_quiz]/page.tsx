import QuizCoverClient from "@/components/quiz/quizcoverclient";

export default async function QuizPage({ params }: { params: Promise<{ id_quiz: string }> }) {
  const { id_quiz } = await params;

  console.log("PARAMS FIXED:", id_quiz);

  return <QuizCoverClient id={id_quiz} />;
}
