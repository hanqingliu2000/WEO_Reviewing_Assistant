import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import type { IndicatorSeriesSet } from "../../types/review";

type SeriesChartProps = {
  flaggedPeriods: string[];
  seriesSet: IndicatorSeriesSet;
};

export function SeriesChart({ flaggedPeriods, seriesSet }: SeriesChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const flaggedPeriodSet = useMemo(() => new Set(flaggedPeriods), [flaggedPeriods]);

  useEffect(() => {
    if (!chartRef.current) {
      return undefined;
    }

    const chart = echarts.init(chartRef.current);
    const periods = seriesSet.current.points.map((point) => point.period);
    const series = [
      { name: "Current", data: seriesSet.current.points.map((point) => point.value), color: "#1f7a8c" },
      { name: "Previous", data: seriesSet.previous.points.map((point) => point.value), color: "#8a98a8" },
      ...(seriesSet.published
        ? [{ name: "Published", data: seriesSet.published.points.map((point) => point.value), color: "#b7791f" }]
        : []),
    ];

    chart.setOption({
      animation: false,
      color: series.map((item) => item.color),
      grid: { top: 32, right: 18, bottom: 40, left: 48 },
      legend: { top: 0, right: 0, itemWidth: 18, itemHeight: 10, textStyle: { color: "#5f6b7a", fontSize: 12 } },
      tooltip: { trigger: "axis", valueFormatter: (value: number | null) => (value === null ? "n/a" : value.toFixed(1)) },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: periods,
        axisLabel: { color: "#5f6b7a", fontSize: 11 },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        scale: true,
        axisLabel: { color: "#5f6b7a", fontSize: 11 },
        splitLine: { lineStyle: { color: "#d8dee6" } },
      },
      series: series.map((item) => ({
        name: item.name,
        type: "line",
        smooth: true,
        symbolSize: 7,
        data: item.data,
        markPoint:
          item.name === "Current"
            ? {
                symbol: "circle",
                symbolSize: 9,
                itemStyle: { color: "#b42318" },
                label: { show: false },
                data: periods
                  .map((period, index) => ({ coord: [period, item.data[index]], period }))
                  .filter((point) => flaggedPeriodSet.has(point.period) && point.coord[1] !== null),
              }
            : undefined,
      })),
    });

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [flaggedPeriodSet, seriesSet]);

  return (
    <div
      className="min-h-0 flex-1 overflow-hidden rounded-md border border-[var(--color-border)] bg-white"
      ref={chartRef}
      aria-label="Line chart"
    />
  );
}
