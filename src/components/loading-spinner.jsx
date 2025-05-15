import { mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";

const LoadingSpinner = ({ size }) => {
  return (
    <div className="loading__icon">
      <Icon path={mdiLoading} size={size || 1} />
    </div>
  );
};

export default LoadingSpinner;
