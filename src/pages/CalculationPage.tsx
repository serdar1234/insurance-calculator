import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  Form,
  DatePicker,
  Select,
  Card,
  Typography,
  Spin,
  Alert,
  Flex,
  Button,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import type { RuleObject } from "antd/es/form";

import {
  calculatePriceThunk,
  setCalculationData,
  nextStep,
} from "@/shared/model/calculatorSlice";
import { type RootState } from "@/app/store/store";
import { SPORT_OPTIONS } from "@/shared/consts/sports";
import { type CalculationData } from "@/shared/types/types";

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

const { Title, Text } = Typography;

const MIN_AGE_GENERAL = 3;
const MIN_AGE_BOXING = 5;

const CalculationPage: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { calculationResult, isLoading, error, calculationData } =
    useAppSelector((state: RootState) => state.calculator);

  const isOlderThan = (date: dayjs.Dayjs, years: number): boolean => {
    const minBirthDate = dayjs().subtract(years, "year");
    return date.isBefore(minBirthDate) || date.isSame(minBirthDate, "day");
  };

  const validateBirthDate = (_: RuleObject, value: dayjs.Dayjs) => {
    if (!value) return Promise.reject("Выберите дату рождения");

    const sportType = form.getFieldValue("sportType");
    if (!isOlderThan(value, MIN_AGE_GENERAL)) {
      return Promise.reject("Минимальный возраст для страхования — 3 года");
    }
    if (sportType === "box" && !isOlderThan(value, MIN_AGE_BOXING)) {
      return Promise.reject("Для бокса минимальный возраст — 5 лет");
    }

    return Promise.resolve();
  };

  const values = Form.useWatch([], form);

  useEffect(() => {
    const recalc = async () => {
      if (!values?.birthDate || !values?.sportType) return;

      try {
        await form.validateFields();

        const data: CalculationData = {
          birthDate: values.birthDate.toISOString(),
          sportType: values.sportType,
        };

        dispatch(setCalculationData(data));
        dispatch(calculatePriceThunk(data));
      } catch {
        console.log("Ошибка валидации");
      }
    };
    console.log("asdadasdasd", dayjs(calculationData.birthDate));
    recalc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.birthDate, values?.sportType]);

  const disabledDate = (current: dayjs.Dayjs) =>
    current && current > dayjs().endOf("day");

  return (
    <Card style={{ margin: "20px auto", width: 400 }}>
      <Title level={4}>Расчет стоимости страхования</Title>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          birthDate: calculationData.birthDate
            ? dayjs(calculationData.birthDate)
            : undefined,
          sportType: calculationData.sportType || undefined,
        }}
      >
        <Form.Item
          label="Дата рождения"
          name="birthDate"
          rules={[
            { required: true, message: "Выберите дату рождения" },
            { validator: validateBirthDate },
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            value={
              calculationData.birthDate
                ? dayjs(calculationData.birthDate)
                : null
            }
            format="DD.MM.YYYY"
            placeholder="Выберите дату"
            disabledDate={disabledDate}
          />
        </Form.Item>

        <Form.Item
          label="Вид спорта"
          name="sportType"
          rules={[{ required: true, message: "Выберите вид спорта" }]}
        >
          <Select placeholder="Выберите вид спорта" options={SPORT_OPTIONS} />
        </Form.Item>
      </Form>

      <div style={{ marginTop: 20 }}>
        {isLoading && (
          <Flex justify="center">
            <Spin size="large" />
          </Flex>
        )}

        {error && <Alert type="error" message={error} showIcon />}

        {!isLoading && calculationResult && (
          <div>
            <Text strong style={{ fontSize: "1.2em" }}>
              Итоговая стоимость: {calculationResult.price}{" "}
              {calculationResult.currency}
            </Text>
            <p style={{ fontSize: "0.8em", color: "#888" }}>
              {calculationResult.details}
            </p>
          </div>
        )}

        {!calculationResult && !isLoading && !error && (
          <Alert
            type="info"
            message="Выберите дату рождения и вид спорта для расчета."
            showIcon
          />
        )}
      </div>
      <Flex justify="end" style={{ marginTop: "1rem" }}>
        <Button
          type="primary"
          disabled={!calculationResult || isLoading}
          onClick={() => dispatch(nextStep())}
        >
          Далее
        </Button>
      </Flex>
    </Card>
  );
};

export default CalculationPage;
