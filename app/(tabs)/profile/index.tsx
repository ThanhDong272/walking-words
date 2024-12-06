import React, { useMemo } from "react";

import ScreenRootView from "@components/ScreenRootView";

import { useGetUserInfo } from "@generated/user/user";
import LocalServices from "@services/local";

import Authenticated from "@/partial/Profile/Authenticated";
import Unauthenticated from "@/partial/Profile/Unauthenticated";

interface Props {}

const ProfileScreen: React.FC<Props> = () => {
  const userSkip = useMemo(() => LocalServices.getItem("USER_SKIP"), []);

  const { data: dataProfile } = useGetUserInfo({
    query: { retry: false },
  });

  const shouldAuthorize = useMemo(() => {
    return !userSkip && Boolean(dataProfile?.data);
  }, [dataProfile, userSkip]);

  return shouldAuthorize ? <Authenticated /> : <Unauthenticated />;
};

export default ProfileScreen;
