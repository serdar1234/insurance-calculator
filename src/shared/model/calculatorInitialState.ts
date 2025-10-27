import type { CalculatorState } from "../types/types";

export const initialState: CalculatorState = {
  calculationData: {
    birthDate: "",
    sportType: "",
  },
  currentStep: 1,
  calculationResult: null,
  isLoading: false,
  error: null,
  personalData: {
    firstName: "",
    lastName: "",
    middleName: "",
  },
  isSubmitting: false,
  submitError: null,
  submitResult: null,
};
