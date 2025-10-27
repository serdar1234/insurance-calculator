export interface CalculationData {
  birthDate: string;
  sportType: string;
}

export interface CalculationResult {
  price: number;
  currency: string;
  details: string;
}

export interface PersonalData {
  lastName: string;
  firstName: string;
  middleName: string;
}

export interface CalculatorState {
  calculationData: CalculationData;
  currentStep: 1 | 2;
  calculationResult: CalculationResult | null;
  isLoading: boolean;
  error: string | null;
  personalData: PersonalData;
}
