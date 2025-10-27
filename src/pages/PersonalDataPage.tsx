import {
  Card,
  Typography,
  Button,
  Space,
  Form,
  Input,
  Modal,
  Result,
  Alert,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/store/hooks";
import { type RootState } from "@/app/store/store";
import {
  resetCalculator,
  setPersonalData,
  prevStep,
  clearSubmitResult,
} from "@/shared/model/calculatorSlice";
import {
  type PersonalData,
  type PolicyCreationData,
} from "@/shared/types/types";
import dayjs from "dayjs";
import { getSportName } from "@/shared/lib/getSportName";
import { createPolicyThunk } from "@/shared/model/calculatorThunks";

const { Title, Text } = Typography;

const PersonalDataPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    calculationData,
    calculationResult,
    personalData,
    isSubmitting,
    submitResult,
    submitError,
  } = useSelector((state: RootState) => state.calculator);

  const [form] = Form.useForm<PersonalData>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (submitResult) {
      setIsModalOpen(true);
    }

    if (submitError) {
      notification.error({
        message: "Ошибка оформления",
        description: submitError,
        duration: 5,
      });
    }
  }, [submitResult, submitError]);

  const handleBack = async () => {
    try {
      const currentValues = form.getFieldsValue();
      dispatch(setPersonalData(currentValues));
      dispatch(prevStep());
    } catch (error) {
      console.error(
        "Ошибка при сохранении личных данных перед возвратом:",
        error,
      );
      dispatch(prevStep());
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    dispatch(clearSubmitResult());
    dispatch(resetCalculator());
  };

  const handleSubmit = (values: PersonalData) => {
    dispatch(setPersonalData(values));

    if (!calculationResult) {
      notification.error({
        message: "Ошибка",
        description:
          "Невозможно оформить полис: отсутствует результат расчета стоимости.",
      });
      return;
    }

    const finalData: PolicyCreationData = {
      calculationData: calculationData,
      personalData: values,
      price: calculationResult.price,
      currency: calculationResult.currency,
    };

    dispatch(createPolicyThunk(finalData));
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
              Предварительная стоимость: {calculationResult.price}&nbsp;
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
            Дата рождения:&nbsp;
            <strong>
              {calculationData.birthDate
                ? dayjs(calculationData.birthDate).format("DD.MM.YYYY")
                : "Не выбрана"}
            </strong>
          </Text>
          <Text>
            Вид спорта:&nbsp;
            <strong>
              {getSportName(calculationData.sportType) || "Не выбран"}
            </strong>
          </Text>
        </Space>

        <Space>
          <Button onClick={handleBack} disabled={isSubmitting}>
            Вернуться к расчёту
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            disabled={isSubmitting || !calculationResult}
          >
            Создать полис
          </Button>
        </Space>
      </Form>

      <Modal
        title="Оформление завершено"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalClose}>
            Начать новый расчет
          </Button>,
        ]}
      >
        {submitResult && (
          <Result
            status="success"
            title="Полис успешно создан!"
            subTitle={`Ваш полис № ${submitResult.policyId} оформлен.`}
            extra={
              <Space
                direction="vertical"
                style={{ width: "100%", textAlign: "center" }}
              >
                <Text strong style={{ fontSize: "1.2em", color: "#52c41a" }}>
                  Финальная стоимость: {submitResult.finalPrice} RUB
                </Text>
                <Text type="secondary">
                  Дата оформления:&nbsp;
                  {dayjs(submitResult.creationDate).format("DD.MM.YYYY HH:mm")}
                </Text>
              </Space>
            }
          />
        )}
      </Modal>
    </Card>
  );
};

export default PersonalDataPage;
