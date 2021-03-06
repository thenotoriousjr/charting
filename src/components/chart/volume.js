import React, { useState } from "react";
import Chart from "kaktana-react-lightweight-charts";
import { useQuery, gql } from "@apollo/client";

const Volume = function ({ tokenAddress }) {
  let chartData = [];
  const options = {
    localization: {
      priceFormatter: function (price) {
        return "$" + price.toFixed(2);
      }
    },
    layout: {
      backgroundColor: "#131722",
      textColor: "#d1d4dc"
    },
    grid: {
      vertLines: {
        color: "rgba(42, 46, 57, 0)"
      },
      horzLines: {
        color: "rgba(42, 46, 57, 0.6)"
      }
    },
    topColor: "rgba(38,198,218, 0.56)",
    bottomColor: "rgba(38,198,218, 0.04)",
    lineColor: "rgba(38,198,218, 1)",
    lineWidth: 2,
    lineStyle: 0,
    crosshairMarkerVisible: false,
    crosshairMarkerRadius: 3,
    crosshairMarkerBorderColor: "rgb(255, 255, 255, 1)",
    crosshairMarkerBackgroundColor: "rgb(34, 150, 243, 1)"
  };
  const { loading, error, data } = useQuery(
    gql`
      query($quoteCurrency: String) {
        ethereum(network: bsc) {
          dexTrades(
            options: { limit: 100, asc: "date.date" }
            date: { since: "2020-11-01" }
            exchangeName: { is: "Pancake" }
            baseCurrency: { is: "0xe9e7cea3dedca5984780bafc599bd69add087d56" }
            quoteCurrency: { is: $quoteCurrency }
          ) {
            date {
              date
            }
            tradeAmount(in: USD)
          }
        }
      }
    `,
    {
      variables: {
        quoteCurrency:
          tokenAddress || "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
      }
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  chartData = data.ethereum.dexTrades.map((el) => ({
    time: el.date.date,
    value: el.tradeAmount
  }));

  if (chartData.length > 0) {
    console.log("CHART344", chartData);

    return (
      <Chart
        autoWidth
        options={options}
        areaSeries={[
          {
            data: chartData
          }
        ]}
        height={320}
      />
    );
  }
};

export default Volume;
