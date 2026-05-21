import { mockReviewItems, mockReviewSession } from "../data/mockReviewData";
import { AppShell } from "../components/layout/AppShell";

export function App() {
  return <AppShell session={mockReviewSession} reviewItems={mockReviewItems} />;
}
