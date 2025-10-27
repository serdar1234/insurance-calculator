import { Card, Typography, Button, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "app/store/store";
import { resetCalculator } from "@/shared/model/calculatorSlice";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const PersonalDataPage: React.FC = () => {
  const dispatch = useDispatch();
  const calculationData = useSelector(
    (state: RootState) => state.calculator.calculationData,
  );

  // Функция для возврата на первый шаг
  const handleBack = () => {
    // В данном случае мы просто сбрасываем currentStep на 1
    dispatch(resetCalculator());
  };

  return (
    <Card style={{ margin: "20px auto", maxWidth: 400 }}>
      <Title level={4}>Шаг 2: Личные данные</Title>

      <p>Здесь будет форма для ввода имени, телефона и оформления полиса.</p>

      <Title level={5}>Просмотр сохраненных данных:</Title>
      <Space direction="vertical" style={{ width: "100%", marginBottom: 20 }}>
        <Text>
          Дата рождения:{" "}
          <strong>
            {calculationData.birthDate
              ? dayjs(calculationData.birthDate).format("DD.MM.YYYY")
              : "Не выбрана"}
          </strong>
        </Text>
        <Text>
          Вид спорта:{" "}
          <strong>{calculationData.sportType || "Не выбран"}</strong>
        </Text>
      </Space>

      <Space>
        <Button onClick={handleBack}>Вернуться к расчету</Button>
        <Button type="primary" disabled>
          Оформить полис (Мок)
        </Button>
      </Space>
    </Card>
  );
};

export default PersonalDataPage;
