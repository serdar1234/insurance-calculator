import { SPORT_OPTIONS } from "@/shared/consts/sports";

const SPORT_NAMES_MAP: Record<string, string> = Object.fromEntries(
  (SPORT_OPTIONS ?? [])
    .filter((opt) => opt?.value && opt?.label)
    .map((opt) => [opt!.value as string, opt!.label as string]),
);

export const getSportName = (sportType: string | undefined): string => {
  if (!sportType) {
    return "Не указан";
  }

  return SPORT_NAMES_MAP[sportType] || sportType;
};
