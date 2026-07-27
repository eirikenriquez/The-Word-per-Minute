import { useMemo } from "react";
import type { PracticeSource } from "../../../types/app";
import type { PassageResponse } from "../../../types/passage";
import type { PracticePassage } from "../types/practice";
import { buildPracticePassage } from "../utils/practicePassage";

type UsePracticePassageParams = {
  enabled: boolean;
  featuredPassageResponse: PassageResponse | null;
  practiceSource: PracticeSource;
  savedPassageResponse: PassageResponse | null;
};

/**
 * Converts the active Practice source into one continuous passage.
 * The app decides whether Practice is enabled without exposing route concepts here.
 */
export function usePracticePassage({
  enabled,
  featuredPassageResponse,
  practiceSource,
  savedPassageResponse,
}: UsePracticePassageParams) {
  const activePassageResponse = enabled
    ? practiceSource === "featured"
      ? featuredPassageResponse
      : savedPassageResponse
    : null;

  return useMemo(
    () => getPracticePassageFromResponse(activePassageResponse),
    [activePassageResponse],
  );
}

function getPracticePassageFromResponse(response: PassageResponse | null): PracticePassage | undefined {
  if (!response) return undefined;

  return buildPracticePassage(response.bookName, response.passage.chapter, response.verses);
}
