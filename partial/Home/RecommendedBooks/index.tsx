import { useTranslation } from "react-i18next";

import ListBooks from "@components/ListBooks";

import { useGetRecommendedBooksInfinite } from "@generated/books/books";
import useDeviceType from "@hooks/useDeviceType";

const RecommendedBooks: React.FC = () => {
  const { t } = useTranslation();
  const deviceType = useDeviceType();

  const { data, hasNextPage, fetchNextPage, status } =
    useGetRecommendedBooksInfinite(
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
      sectionTitle={t("home.recommended")}
      status={status}
      deviceType={deviceType}
      onEndReached={loadMore}
    />
  );
};

export default RecommendedBooks;
