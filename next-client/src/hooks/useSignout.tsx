import { errorToast, successToast } from "@/components/ui/toast";
import { useSignoutMutation } from "@/redux/apis/authApiSlice";
import { parseError } from "@/utils/helpers";

export const useSignout = () => {
  const [signout, { isLoading }] = useSignoutMutation();

  const handleSignout = async () => {
    try {
      const res = await signout({}).unwrap();
      if (res.success) {
        successToast(res.message);
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  return { handleSignout, isLoading };
};
