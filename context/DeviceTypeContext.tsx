import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as Device from "expo-device";

type DeviceTypeContextType = Device.DeviceType | null;

const DeviceTypeContext = createContext<DeviceTypeContextType>(null);

interface DeviceTypeProviderProps {
  children: ReactNode;
}

export const DeviceTypeProvider: React.FC<DeviceTypeProviderProps> = ({
  children,
}) => {
  const [deviceType, setDeviceType] = useState<Device.DeviceType>(
    Device.DeviceType.PHONE,
  );

  useEffect(() => {
    const fetchDeviceType = async () => {
      try {
        const type = await Device.getDeviceTypeAsync();
        setDeviceType(type);
      } catch (error) {
        console.error("Failed to fetch device type:", error);
      }
    };
    fetchDeviceType();
  }, []);

  return (
    <DeviceTypeContext.Provider value={deviceType}>
      {children}
    </DeviceTypeContext.Provider>
  );
};

export const useDeviceType = () => {
  const context = useContext(DeviceTypeContext);
  if (context === null) {
    throw new Error("useDeviceType must be used within a DeviceTypeProvider");
  }
  return context;
};
