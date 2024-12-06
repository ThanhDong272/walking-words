import { useEffect, useState } from "react";

import { useGetPopularBooks } from "@services/network/generated/books/books";
import type { BookDataItem } from "@services/network/generated/model";
import { PER_PAGE } from "@constants";
import { EQueryUser } from "@constants/queries";

export function useFetchPopularBooks() {
  const [page, setPage] = useState(1);
  const [dataPopular, setDataPopular] = useState<BookDataItem[]>([]);

  const { data, isLoading } = useGetPopularBooks(
    {
      page: page,
      perPage: PER_PAGE._10,
    },
    {
      query: {
        queryKey: [EQueryUser.POPULAR_BOOKS],
        enabled: true,
      },
    },
  );

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setDataPopular(data?.data?.data || []);
      } else {
        setDataPopular((prev) => [...prev, ...(data?.data?.data || [])]);
      }
    }
  }, [data, page]);

  return {
    dataPopular,
    isLoading,
    fetchPopularNextPage: () => {
      if (
        (data?.data?.meta?.currentPage || 1) < (data?.data?.meta?.total || 1)
      ) {
        setPage((prev) => prev + 1);
      }
    },
  };
}
