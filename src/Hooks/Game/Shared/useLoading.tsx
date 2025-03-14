import { useCallback, useState } from "react";
import { errorToast } from "@/Utilities/toasts";


function useLoading() {
  const [loading, setLoading] = useState(false);

  const handleLoad = useCallback(async (handle: Function) => {
    try {
      setLoading(true);
      await handle();
      setLoading(false);
    } catch (e: any) {
      errorToast(e.toString());
    }
  }, []);

  return {
    loading,
    setLoading,
    handleLoad
  }
}

export default useLoading;