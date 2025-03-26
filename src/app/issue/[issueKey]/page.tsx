import IssueDetails from "@/components/page/IssueDetails";

// Tipagem correta para parâmetros de rota no Next.js
interface IssuePageProps {
  params: {
    issueKey: string;
  };
}

export default async function IssuePage({ params }: IssuePageProps) {
  // Esta é uma página server-side que passa o parâmetro para o componente client
  return <IssueDetails issueKey={params.issueKey} />;
}