import { useGenericContext } from "@/State/GeneralContext";
import { AuthContext } from "@/State/Auth/AuthContext";

function useAuth() {
  return useGenericContext(AuthContext);
}

export {useAuth};