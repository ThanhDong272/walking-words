import { useEffect } from "react";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";

import { useGetUserInfo } from "@generated/user/user";
import LocalServices from "@services/local";

export default function Main() {
  const router = useRouter();
  const isSkipped = LocalServices.getItem("USER_SKIP");
  const isAuthorized = LocalServices.getItem("ACCESS_TOKEN");
  const { data, isPending } = useGetUserInfo({
    query: {
      retry: false,
    },
  });

  useEffect(() => {
    let redirectPath = null;

    if (!isPending) {
      const { firstName, lastName } = data?.data || {};
      if (firstName === null || lastName === null) {
        redirectPath = "/(tabs)/profile/update_name";
      }
      if (redirectPath === null) {
        if (isAuthorized || isSkipped) {
          redirectPath = "/(tabs)/home";
        } else {
          redirectPath = "/(auth)/login";
        }
      }
      if (redirectPath === "/(tabs)/profile/update_name") {
        router.navigate({
          pathname: "/(screens)/update_name",
          params: {
            firstName: firstName || "",
            lastName: lastName || "",
            forceLogout: "forceLogout",
          },
        });
      } else {
        router.replace(redirectPath as Href);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, isSkipped, isAuthorized]);

  return <></>;
}
