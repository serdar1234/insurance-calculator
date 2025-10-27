import { useSelector } from "react-redux";
import { type RootState } from "@/app/store/store";

import CalculationPage from "@/pages/CalculationPage";
import PersonalDataPage from "@/pages/PersonalDataPage";
import "./App.css";

const App: React.FC = () => {
  const currentStep = useSelector(
    (state: RootState) => state.calculator.currentStep,
  );

  return (
    <section className="form-section">
      <h1 className="form-title">Калькулятор расчета страхового полиса</h1>
      {currentStep === 1 && <CalculationPage />}
      {currentStep === 2 && <PersonalDataPage />}
    </section>
  );
};

export default App;
