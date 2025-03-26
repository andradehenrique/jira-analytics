import IssueDetails from "@/components/page/IssueDetails";

// Tipagem correta para parâmetros de rota no Next.js
interface IssuePageProps {
  params: Promise<{
    issueKey: string;
  }>;
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { issueKey } = await params;
  return <IssueDetails issueKey={issueKey} />;
}