import { verseService } from "../../../lib/bible/verseService";
import type { PassageResponse } from "../../../types/passage";
import featuredPassagesData from "../data/featuredPassages.json";
import type {
  FeaturedPassage,
  FeaturedPassageListResponse,
} from "../types/featuredPassage";

const featuredPassages = featuredPassagesData.passages as FeaturedPassage[];

/**
 * Provides the curated passage list and resolves selections through the Bible service.
 */
export const featuredPassageService = {
  async getFeaturedPassages(): Promise<FeaturedPassageListResponse> {
    return {
      passages: featuredPassages,
    };
  },

  async getPassage(passageId: string): Promise<PassageResponse> {
    const passage = featuredPassages.find(
      (availablePassage) => availablePassage.id === passageId,
    );

    if (!passage) {
      throw new Error(`Passage not found: ${passageId}`);
    }

    return verseService.getReferencePassage(passage);
  },
};
