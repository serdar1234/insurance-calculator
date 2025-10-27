import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  type CalculatorState,
  type CalculationData,
  type CalculationResult,
  type PersonalData,
} from "@/shared/types/types";
import { calculateInsurancePrice } from "@/shared/api/api";

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
      });
  },
});

export const {
  setCalculationData,
  nextStep,
  resetCalculator,
  setPersonalData,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
