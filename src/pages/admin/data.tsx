"use client"

import useMiddleware from "@/lib/middleware";
import AdminLayout from "@/pages/_layout";

import { useQuery } from "@apollo/client";
import { GET_ORDERS_QUERY } from "@/utils/graphql/queries/orders";
import { useEffect, useState } from "react";
import {calculateSalesRanking, transformData} from "@/utils/dataUtils";
import SalesGraph from "@/molecules/salesGraph";
import SalesRankingCards from "@/molecules/salesRankingCards";
import {DailySales, OrderProps, SalesRankingCardsProps} from "@/utils/interfaces";

export default function Data() {
    useMiddleware();

    const { data, loading, error } = useQuery(GET_ORDERS_QUERY);
    const [dailySales, setDailySales] = useState<DailySales[]>([]);
    const [salesRanking, setSalesRanking] = useState<SalesRankingCardsProps[]>([]);

    useEffect(() => {
        if (data && data.orders) {
            const filteredOrders = data.orders.filter((order: OrderProps) =>
                ["PAID"].includes(order.status)
            );
            setDailySales(transformData(filteredOrders));
            setSalesRanking(calculateSalesRanking(filteredOrders));
        }
    }, [data]);

    return (
        <AdminLayout>
            <div className={"w-4/5 mx-auto"}>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-4">
                    Análisis de datos
                </h1>

                <SalesGraph dailySales={dailySales} loading={loading} error={error} />

                <h2 className="text-3xl font-bold tracking-tight lg:text-4xl text-center mt-8 mb-4">
                    Clasificación de ventas
                </h2>

                <SalesRankingCards salesRanking={salesRanking} />
            </div>
        </AdminLayout>
    )
}