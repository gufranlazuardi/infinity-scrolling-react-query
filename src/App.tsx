import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchItems } from "./data/items";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function App() {
  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["items"],
      queryFn: fetchItems,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <>
      <div className="flex flex-col">
        {status === "pending" ? (
          <div className="p-5">...loading</div>
        ) : status === "error" ? (
          <div>{error.message}</div>
        ) : null}

        <div className="flex flex-col gap-2 mt-5">
          {data?.pages.map((page) => (
            <div
              key={page.currentPage}
              className="flex flex-col gap-2 px-5"
            >
              {page.data.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-8 bg-gray-300 rounded-md mb-2"
                >
                  {item.name}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div ref={ref} className="py-6 px-4 flex justify-center">
          {isFetchingNextPage && (
            <div className="text-md text-blue-400">loading...</div>
          )}
        </div>
      </div>
    </>
  );
}
