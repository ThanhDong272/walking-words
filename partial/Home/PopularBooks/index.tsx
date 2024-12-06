import React from "react";
import { useTranslation } from "react-i18next";

import ListBooks from "@components/ListBooks";

import { useGetPopularBooksInfinite } from "@generated/books/books";
import useDeviceType from "@hooks/useDeviceType";

const PopularBooks: React.FC = () => {
  const { t } = useTranslation();
  const deviceType = useDeviceType();

  const { data, hasNextPage, fetchNextPage, status } =
    useGetPopularBooksInfinite(
      {
        page: 0,
        perPage: 10,
      },
      {
        query: {
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

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <ListBooks
      data={data?.pages?.flatMap((page) => page.data?.data ?? []) ?? []}
      status={status}
      sectionTitle={t("home.popular")}
      deviceType={deviceType}
      onEndReached={loadMore}
    />
  );
};

export default PopularBooks;
