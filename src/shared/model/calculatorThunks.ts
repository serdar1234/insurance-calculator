import { createAsyncThunk } from "@reduxjs/toolkit";
import { calculateInsurancePrice, createPolicy } from "../api/api";
import type {
  PolicyCreationResult,
  PolicyCreationData,
  CalculationData,
  CalculationResult,
} from "../types/types";

export const createPolicyThunk = createAsyncThunk<
  PolicyCreationResult,
  PolicyCreationData,
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
