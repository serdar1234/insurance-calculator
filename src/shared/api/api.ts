import {
  type CalculationData,
  type CalculationResult,
} from "@/shared/types/types";
import { SPORT_OPTIONS } from "../consts/sports";

const SPORT_NAMES: Record<string, string> = Object.fromEntries(
  (SPORT_OPTIONS ?? []).map((opt) => [
    opt?.value as string,
    opt?.label as string,
  ]),
);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const calculateInsurancePrice = async (
  data: CalculationData,
): Promise<CalculationResult> => {
  console.log(`[MOCK API] Запрос на расчет с данными:`, data);

  await delay(1000);

  let basePrice = 10000;

  if (data.sportType === "box" || data.sportType === "climbing") {
    basePrice *= 2.5;
  } else if (data.sportType === "football" || data.sportType === "skiing") {
    basePrice *= 1.8;
  }

  const birthYear = new Date(data.birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  if (age < 18) {
    basePrice *= 0.9;
  } else if (age > 45) {
    basePrice *= 1.3;
  }

  const sportName = SPORT_NAMES[data.sportType] ?? data.sportType;
  const result: CalculationResult = {
    price: Math.round(basePrice / 100) * 100,
    currency: "RUB",
    details: `Базовая стоимость с учетом возраста (${age} лет) и риска по виду спорта: ${sportName}.`,
  };

  console.log(
    `[MOCK API] Расчет завершен. Стоимость: ${result.price} ${result.currency}`,
  );

  return result;
};
