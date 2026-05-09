import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/ProductContext";

const { resetAllFilters } = useProduct();
const navigate = useNavigate();

export default navigateWithReset = (path) => {
  resetAllFilters();
  navigate(path, { replace: true });
};