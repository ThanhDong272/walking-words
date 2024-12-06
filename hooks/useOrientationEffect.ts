import { useEffect, useState } from "react";
import { OrientationType } from "react-native-orientation-locker";
import { Accelerometer } from "expo-sensors";

const useOrientationEffect = (delay = 500) => {
  let timeout: any;

  const [orientation, setOrientation] = useState(OrientationType["PORTRAIT"]);
  const [orientationUpdated, setOrientationUpdated] = useState(
    OrientationType["PORTRAIT"],
  );

  useEffect(() => {
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      let newOrientation;
      if (Math.abs(x) > Math.abs(y) && Math.abs(x) > Math.abs(z)) {
        newOrientation =
          x > 0
            ? OrientationType["LANDSCAPE-RIGHT"]
            : OrientationType["LANDSCAPE-LEFT"];
      } else if (Math.abs(y) > Math.abs(x) && Math.abs(y) > Math.abs(z)) {
        newOrientation = OrientationType["PORTRAIT"];
      } else {
        newOrientation = OrientationType["UNKNOWN"];
      }

      setOrientation(newOrientation);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (orientation !== OrientationType["UNKNOWN"]) {
      timeout = setTimeout(() => {
        setOrientationUpdated(orientation);
      }, delay);
    }

    return () => clearTimeout(timeout);
  }, [orientation]);

  return orientationUpdated;
};

export default useOrientationEffect;
