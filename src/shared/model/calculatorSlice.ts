import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  type CalculatorState,
  type CalculationData,
  type CalculationResult,
  type PolicyCreationResult,
  type PersonalData,
  type PolicyCreationData,
} from "@/shared/types/types";
import { calculateInsurancePrice, createPolicy } from "@/shared/api/api";

export const calculatePriceThunk = createAsyncThunk<
  CalculationResult,
  CalculationData,
  { rejectValue: string }
>("calculator/calculatePrice", async (data, { rejectWithValue }) => {
  try {
    const result = await calculateInsurancePrice(data);
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ошибка при расчете";
    return rejectWithValue(message);
  }
});

export const createPolicyThunk = createAsyncThunk<
  PolicyCreationResult, // Результат в случае успеха
  PolicyCreationData, // Данные, которые мы передаем
  { rejectValue: string }
>("calculator/createPolicy", async (data, { rejectWithValue }) => {
  try {
    const result = await createPolicy(data);
    return result;
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Неизвестная ошибка при создании полиса";
    return rejectWithValue(message);
  }
});

const initialState: CalculatorState = {
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

export const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {
    setCalculationData: (state, action: PayloadAction<CalculationData>) => {
      state.calculationData = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep === 1) state.currentStep = 2;
    },
    setPersonalData: (state, action: PayloadAction<PersonalData>) => {
      state.personalData = action.payload;
    },
    resetCalculator: (state) => {
      state.currentStep = 1;
      state.calculationResult = null;
      state.isLoading = false;
      state.error = null;
      state.isSubmitting = false;
      state.submitError = null;
      state.submitResult = null;
    },
    clearSubmitResult: (state) => {
      state.submitResult = null;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculatePriceThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.calculationResult = null;
      })
      .addCase(calculatePriceThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.calculationResult = action.payload;
      })
      .addCase(calculatePriceThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Неизвестная ошибка";
      })
      .addCase(createPolicyThunk.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
        state.submitResult = null;
      })
      .addCase(createPolicyThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.submitResult = action.payload;
      })
      .addCase(createPolicyThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload ?? "Неизвестная ошибка";
      });
  },
});

export const {
  setCalculationData,
  nextStep,
  resetCalculator,
  clearSubmitResult,
  setPersonalData,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
