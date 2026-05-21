import { AppShell } from "../components/layout/AppShell";
import { mockReviewItemDetails, mockReviewItems, mockReviewSession } from "../data/mockReviewData";

export function App() {
  return (
    <AppShell
      session={mockReviewSession}
      reviewItems={mockReviewItems}
      activeDetail={mockReviewItemDetails[mockReviewItems[0].review_item_id]}
    />
  );
}
