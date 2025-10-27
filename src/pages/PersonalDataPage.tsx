import {
  Card,
  Typography,
  Button,
  Space,
  Form,
  Input,
  Alert,
  notification,
} from "antd";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/store/hooks";
import { type RootState } from "@/app/store/store";
import {
  resetCalculator,
  setPersonalData,
} from "@/shared/model/calculatorSlice";
import { type PersonalData } from "@/shared/types/types";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const PersonalDataPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { calculationData, calculationResult, personalData } = useSelector(
    (state: RootState) => state.calculator,
  );

  const [form] = Form.useForm<PersonalData>();

  const handleBack = () => {
    dispatch(resetCalculator());
  };

  const handleSubmit = (values: PersonalData) => {
    dispatch(setPersonalData(values));

    const finalData = {
      calculationData,
      calculationResult,
      personalData: values,
    };

    console.log("--- ФИНАЛЬНЫЙ СУММАРНЫЙ ОБЪЕКТ ДАННЫХ ДЛЯ API ---");
    console.log(finalData);
    notification.success({
      message: "Оформление завершено (мок)",
      description: `Данные для полиса на имя ${values.lastName} ${values.firstName} сохранены.`,
      duration: 4,
    });
  };

  const initialValues: PersonalData = personalData;

  return (
    <Card style={{ margin: "20px auto", maxWidth: 400 }}>
      <Title level={4}>Шаг 2: Личные данные</Title>

      {calculationResult && (
        <Alert
          type="success"
          message={
            <Text strong>
              Итоговая стоимость: {calculationResult.price}{" "}
              {calculationResult.currency}
            </Text>
          }
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label="Фамилия"
          name="lastName"
          rules={[{ required: true, message: "Введите фамилию" }]}
        >
          <Input placeholder="Введите фамилию" />
        </Form.Item>

        <Form.Item
          label="Имя"
          name="firstName"
          rules={[{ required: true, message: "Введите имя" }]}
        >
          <Input placeholder="Введите имя" />
        </Form.Item>

        <Form.Item label="Отчество" name="middleName">
          <Input placeholder="Введите отчество (необязательно)" />
        </Form.Item>

        <Title level={5} style={{ marginTop: 24 }}>
          Данные из расчёта:
        </Title>

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
          <Button onClick={handleBack}>Вернуться к расчёту</Button>
          <Button type="primary" htmlType="submit">
            Отправить (мок)
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

export default PersonalDataPage;
