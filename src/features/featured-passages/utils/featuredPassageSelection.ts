import type { FeaturedPassage } from '../types/featuredPassage';

/**
 * Returns a random featured passage, preferring a different passage when one
 * is already selected.
 */
export function getRandomFeaturedPassage(
  passages: readonly FeaturedPassage[],
  currentPassageId = '',
) {
  const otherPassages = passages.filter(
    (passage) => passage.id !== currentPassageId,
  );
  const availablePassages = otherPassages.length ? otherPassages : passages;

  return availablePassages[
    Math.floor(Math.random() * availablePassages.length)
  ];
}
