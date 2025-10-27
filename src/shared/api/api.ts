import {
  type CalculationData,
  type CalculationResult,
  type PolicyCreationData,
  type PolicyCreationResult,
} from "@/shared/types/types";
import { getSportName } from "../lib/getSportName";

const ONLINE_MOCK_API_URL =
  "https://53bf16ff349741a587027a9024cc48df.api.mockbin.io/";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createPolicy = async (
  data: PolicyCreationData,
): Promise<PolicyCreationResult> => {
  console.log(
    `[Mockbin API] POST запрос на ${ONLINE_MOCK_API_URL} с данными:`,
    data,
  );

  const response = await fetch(ONLINE_MOCK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMessage =
      errorBody.message ||
      `Ошибка HTTP при создании полиса: ${response.status}`;
    throw new Error(errorMessage);
  }

  const mockbinResult: { price: number } = await response.json();

  const result: PolicyCreationResult = {
    policyId: `MOCK-${Date.now()}`,
    creationDate: new Date().toISOString(),
    finalPrice: mockbinResult.price,
  };

  console.log(
    `[Mockbin API] Полиc создан. Финальная цена: ${result.finalPrice} RUB`,
  );

  return result;
};

export const calculateInsurancePrice = async (
  data: CalculationData,
): Promise<CalculationResult> => {
  console.log(`[MOCK API] Запрос на расчет с данными:`, data);

  await delay(1000);

  let basePrice = 2000;

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
