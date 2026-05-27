import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import type { IndicatorSeriesSet } from "../../types/review";

type SeriesChartProps = {
  flaggedPeriods: string[];
  formula?: string | null;
  seriesSet: IndicatorSeriesSet;
  visiblePeriods: string[];
};

export function SeriesChart({ flaggedPeriods, formula, seriesSet, visiblePeriods }: SeriesChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const flaggedPeriodSet = useMemo(() => new Set(flaggedPeriods), [flaggedPeriods]);
  const visiblePeriodSet = useMemo(() => new Set(visiblePeriods), [visiblePeriods]);

  useEffect(() => {
    const chartElement = chartRef.current;

    if (!chartElement) {
      return undefined;
    }
    const element: HTMLDivElement = chartElement;

    const periods = seriesSet.current.points.map((point) => point.period).filter((period) => visiblePeriodSet.has(period));
    const valuesForPeriods = (points: typeof seriesSet.current.points) =>
      periods.map((period) => points.find((point) => point.period === period)?.value ?? null);
    const series = [
      { name: "Current", data: valuesForPeriods(seriesSet.current.points), color: "#e66c37", z: 3 },
      { name: "Previous", data: valuesForPeriods(seriesSet.previous.points), color: "#0d6abf", z: 2 },
      ...(seriesSet.published
        ? [{ name: "Published", data: valuesForPeriods(seriesSet.published.points), color: "#d4d8de", z: 1 }]
        : []),
    ];
    const options = {
      animation: false,
      color: series.map((item) => item.color),
      dataZoom: [
        { type: "slider", xAxisIndex: 0, bottom: 8, height: 24, filterMode: "none", brushSelect: false },
      ],
      grid: { top: 32, right: 18, bottom: 72, left: 48 },
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
        showSymbol: true,
        symbol: "circle",
        symbolSize: 4,
        itemStyle: { borderWidth: 0 },
        lineStyle: { width: item.name === "Current" ? 2.4 : item.name === "Previous" ? 2 : 1.6 },
        z: item.z,
        data: item.data,
        markPoint:
          item.name === "Current"
            ? {
                symbol: "circle",
                symbolSize: 7,
                itemStyle: { color: "#b42318" },
                label: { show: false },
                data: periods
                  .map((period, index) => ({ coord: [period, item.data[index]], period }))
                  .filter((point) => flaggedPeriodSet.has(point.period) && point.coord[1] !== null),
              }
            : undefined,
          })),
    };
    let chart: echarts.ECharts | undefined;

    function ensureChart() {
      if (!element.clientWidth || !element.clientHeight) {
        return;
      }

      if (!chart) {
        chart = echarts.init(element);
        chart.setOption(options);
      } else {
        chart.resize();
      }
    }

    const resizeObserver = new ResizeObserver(ensureChart);
    resizeObserver.observe(element);
    const frameId = window.requestAnimationFrame(ensureChart);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      chart?.dispose();
    };
  }, [flaggedPeriodSet, seriesSet, visiblePeriodSet]);

  return (
    <div className="flex min-h-[292px] flex-1 flex-col overflow-hidden rounded-md border border-[var(--color-border)] bg-white">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-panel-muted)] px-2 py-1">
        <p className="truncate text-[11px] leading-[1.25] text-[var(--color-muted)]">
          <span className="font-extrabold uppercase text-[var(--color-subtle)]">Formula</span>{" "}
          {formula ?? "n/a"}
        </p>
      </div>
      <div
        className="min-h-[260px] flex-1 overflow-hidden"
        ref={chartRef}
        aria-label="Line chart"
      />
    </div>
  );
}
