import { useEffect, useState } from "react";
import * as Device from "expo-device";

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<Device.DeviceType>(
    Device.DeviceType.PHONE,
  );

  useEffect(() => {
    async function getDeviceTypeAsync() {
      setDeviceType(await Device.getDeviceTypeAsync());
    }
    getDeviceTypeAsync();
  }, []);

  return deviceType;
};

export default useDeviceType;
