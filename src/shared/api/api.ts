import {
  type CalculationData,
  type CalculationResult,
  type PolicyCreationData,
  type PolicyCreationResult,
} from "@/shared/types/types";
import { getSportName } from "../lib/getSportName";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createPolicy = async (
  data: PolicyCreationData,
): Promise<PolicyCreationResult> => {
  console.log(`[MOCK API] POST запрос на ${data} с финальными данными:`, data);

  await delay(1500);
  if (Math.random() < 0.1) {
    throw new Error(
      "API Error: Не удалось создать полис из-за проблем с базой данных.",
    );
  }

  const result: PolicyCreationResult = {
    policyId: `POL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    creationDate: new Date().toISOString(),
  };

  console.log(`[MOCK API] Полиc успешно создан. ID: ${result.policyId}`);

  return result;
};

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

  const sportName = getSportName(data.sportType);
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
