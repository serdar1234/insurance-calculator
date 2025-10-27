import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type CalculationData, type PersonalData } from "@/shared/types/types";
import { calculatePriceThunk, createPolicyThunk } from "./calculatorThunks";
import { initialState } from "./calculatorInitialState";

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
    prevStep: (state) => {
      if (state.currentStep === 2) state.currentStep = 1;
    },
    setPersonalData: (state, action: PayloadAction<PersonalData>) => {
      state.personalData = action.payload;
    },
    resetCalculator: () => {
      return initialState;
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
  prevStep,
  resetCalculator,
  clearSubmitResult,
  setPersonalData,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
