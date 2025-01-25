"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useAuth from "@/app/hooks/use-auth";
import CreateOrder from "@/app/components/CreateOrder";

function useRecentOrders() {
  const { token } = useAuth();

  return useInfiniteQuery({
    queryKey: ["recentOrders"],
    queryFn: ({ pageParam = 1 }) =>
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/recent/?page=${pageParam}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((response) => response.json()),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
    enabled: !!token,
  });
}

function Orders() {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRecentOrders();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    const interceptor = document.getElementById("interceptor");
    if (interceptor) {
      observer.observe(interceptor);
    }

    return () => {
      if (interceptor) {
        observer.unobserve(interceptor);
      }
    };
  }, [fetchNextPage, hasNextPage]);

  if (isLoading && !data) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los pedidos: {error.message}</div>;

  return (
    <div className="p-4 w-full flex gap-4">
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-4">Pedidos Recientes</h2>
        <div style={{ maxHeight: "100%", overflowY: "auto" }}>
          <table className="h-100 w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Creación
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre del Cliente
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.pages?.map((page) =>
                page?.results?.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.created_at}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.total_amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items.map((item) => item.product_name).join(", ")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div id="interceptor">{isFetchingNextPage && "cargando..."}</div>
        </div>
      </div>
      <CreateOrder />
    </div>
  );
}

export default Orders;
