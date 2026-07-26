import type { PassageReference } from "../../../types/passage";

export type FeaturedPassage = PassageReference & {
  id: string;
};

export type FeaturedPassageListResponse = {
  passages: FeaturedPassage[];
};
