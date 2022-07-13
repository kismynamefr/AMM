import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = (type, content, idLoading) => {
  let notify;
  const toastConfig = {
    position: "top-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  const toastConfigLoading = {
    position: "top-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  switch (type) {
    case "success":
      notify = () => toast.success(content, { ...toastConfig });
      return notify();
    case "warning":
      notify = () => toast.warning(content, { ...toastConfig });
      return notify();
    case "error":
      notify = () => toast.error(content, { ...toastConfig });
      return notify();
    case "custom":
      notify = () => toast(content, { ...toastConfig });
      return notify();
    case "loading":
      const id = toast.loading(content, { ...toastConfigLoading });
      return id;
    case "update success":
      return toast.update(idLoading, {
        render: `${content}`,
        type: "success",
        isLoading: false,
        ...toastConfig,
      });
    case "update reject":
      return toast.update(idLoading, {
        render: `${content}`,
        type: "error",
        isLoading: false,
        ...toastConfig,
      });
    default:
      return null;
  }
};

export default Toast;