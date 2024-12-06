import React from "react";
import { useTranslation } from "react-i18next";

import ListBooks from "@components/ListBooks";

import { useGetMyNovelsInfinite } from "@generated/books/books";
import useDeviceType from "@hooks/useDeviceType";
import LocalServices from "@services/local";
import { EQueryUser } from "@constants/queries";

const MyNovels: React.FC = () => {
  const { t } = useTranslation();
  const deviceType = useDeviceType();
  const isAuthorize = LocalServices.getItem("ACCESS_TOKEN");

  const { data, hasNextPage, fetchNextPage, status } = useGetMyNovelsInfinite(
    {
      page: 0,
      perPage: 10,
    },
    {
      query: {
        queryKey: [EQueryUser.MY_NOVELS],
        enabled: true,
        getNextPageParam: (lastPage) => {
          if (
            (lastPage?.data?.meta?.currentPage ?? 0) <
            (lastPage?.data?.meta?.total ?? 0)
          ) {
            return (lastPage?.data?.meta?.currentPage ?? 0) + 1;
          }
          return undefined;
        },
      },
    },
  );

  if (!isAuthorize) return null;

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <ListBooks
      data={data?.pages?.flatMap((page) => page.data?.data ?? []) ?? []}
      status={status}
      sectionTitle={t("home.my_novels")}
      deviceType={deviceType}
      onEndReached={loadMore}
    />
  );
};

export default MyNovels;
