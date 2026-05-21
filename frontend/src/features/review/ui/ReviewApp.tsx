import { mockReviewItemDetails, mockReviewItems, mockReviewSession } from "../repo/mockReviewData";
import { ReviewWorkspace } from "./ReviewWorkspace";

export function ReviewApp() {
  return (
    <ReviewWorkspace
      session={mockReviewSession}
      reviewItems={mockReviewItems}
      reviewItemDetails={mockReviewItemDetails}
    />
  );
}
