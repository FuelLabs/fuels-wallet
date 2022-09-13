import { useNavigate } from "react-router-dom";

export function useFaucetDialog() {
  const navigate = useNavigate();

  const close = () => {
    navigate("/");
  };

  return {
    handlers: {
      close,
    },
  };
}
