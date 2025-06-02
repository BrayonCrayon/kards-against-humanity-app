import { useCallback, useState } from "react";
import { useToasts } from "@/Hooks/Notification/useToasts";

function useLoading() {
  const [loading, setLoading] = useState(false);
  const { errorToast } = useToasts();

  const handleLoad = useCallback(async (handle: Function) => {
    try {
      setLoading(true);
      await handle();
    } catch (e: any) {
      errorToast(e.toString());
    }
    setLoading(false);
  }, []);

  return {
    loading,
    setLoading,
    handleLoad,
  };
}

export default useLoading;
