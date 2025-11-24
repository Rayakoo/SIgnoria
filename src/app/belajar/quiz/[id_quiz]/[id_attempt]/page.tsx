import QuizDetailClient from "@/components/quiz/quizdetailclient";

export default async function Page(
  { params }: { params: Promise<{ id_quiz: string; id_attempt: string }> }
) {
  const { id_quiz, id_attempt } = await params;

  console.log("Page params:", { id_quiz, id_attempt }); // Log params

  return (
    <QuizDetailClient
      id={id_quiz}
      attemptId={id_attempt}
    />
  );
}
