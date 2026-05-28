import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import type { IndicatorSeriesSet } from "../../types/review";

type SeriesChartProps = {
  deskSeries?: string | null;
  formula?: string | null;
  highlightedPeriods: string[];
  indicatorId: string;
  indicatorName: string;
  onAddHighlightedPeriodRange: (startPeriod: string, endPeriod: string) => void;
  onRemoveHighlightedPeriodRange: (startPeriod: string, endPeriod: string) => void;
  seriesSet: IndicatorSeriesSet;
  visiblePeriods: string[];
};

type ChartPointerEvent = {
  event?: {
    button?: number;
    preventDefault?: () => void;
  };
  offsetX: number;
  offsetY: number;
};

export function SeriesChart({
  deskSeries,
  formula,
  highlightedPeriods,
  indicatorId,
  indicatorName,
  onAddHighlightedPeriodRange,
  onRemoveHighlightedPeriodRange,
  seriesSet,
  visiblePeriods,
}: SeriesChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const highlightedPeriodSet = useMemo(() => new Set(highlightedPeriods), [highlightedPeriods]);
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
    const highlightedPeriodColumns = periods
      .map((period, index) => (highlightedPeriodSet.has(period) ? { xAxis: index } : null))
      .filter((item): item is { xAxis: number } => item !== null);
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
        markLine:
          item.name === "Current"
            ? {
                silent: true,
                symbol: "none",
                label: { show: false },
                lineStyle: { color: "rgba(217, 154, 0, 0.36)", type: "solid", width: 14 },
                data: highlightedPeriodColumns,
              }
            : undefined,
        markPoint:
          item.name === "Current"
            ? {
                symbol: "circle",
                symbolSize: 7,
                itemStyle: { color: "#b42318", borderColor: "#ffffff", borderWidth: 1 },
                label: { show: false },
                data: periods
                  .map((period, index) => ({ coord: [period, item.data[index]], period }))
                  .filter((point) => highlightedPeriodSet.has(point.period) && point.coord[1] !== null),
              }
            : undefined,
          })),
    };
    let chart: echarts.ECharts | undefined;
    let dragStartPeriod: string | null = null;
    let dragButton: 0 | 2 | null = null;

    function periodFromPointer(event: ChartPointerEvent) {
      if (!chart || !chart.containPixel({ gridIndex: 0 }, [event.offsetX, event.offsetY])) {
        return null;
      }

      const converted = chart.convertFromPixel({ gridIndex: 0 }, [event.offsetX, event.offsetY]);
      const xValue = Array.isArray(converted) ? converted[0] : converted;
      const periodIndex = Math.min(Math.max(Math.round(Number(xValue)), 0), periods.length - 1);
      return periods[periodIndex] ?? null;
    }

    function handlePointerDown(event: ChartPointerEvent) {
      const button = event.event?.button;

      if (button !== 0 && button !== 2) {
        return;
      }

      const period = periodFromPointer(event);

      if (!period) {
        return;
      }

      event.event?.preventDefault?.();
      dragStartPeriod = period;
      dragButton = button;
    }

    function handlePointerUp(event: ChartPointerEvent) {
      const endPeriod = periodFromPointer(event);

      if (!dragStartPeriod || !endPeriod || dragButton === null) {
        dragStartPeriod = null;
        dragButton = null;
        return;
      }

      if (dragButton === 0) {
        onAddHighlightedPeriodRange(dragStartPeriod, endPeriod);
      } else {
        onRemoveHighlightedPeriodRange(dragStartPeriod, endPeriod);
      }

      dragStartPeriod = null;
      dragButton = null;
    }

    function handleContextMenu(event: Event) {
      event.preventDefault();
    }

    function ensureChart() {
      if (!element.clientWidth || !element.clientHeight) {
        return;
      }

      if (!chart) {
        chart = echarts.init(element);
        chart.setOption(options);
        chart.getZr().on("mousedown", handlePointerDown);
        chart.getZr().on("mouseup", handlePointerUp);
      } else {
        chart.resize();
      }
    }

    const resizeObserver = new ResizeObserver(ensureChart);
    resizeObserver.observe(element);
    element.addEventListener("contextmenu", handleContextMenu);
    const frameId = window.requestAnimationFrame(ensureChart);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      element.removeEventListener("contextmenu", handleContextMenu);
      chart?.getZr().off("mousedown", handlePointerDown);
      chart?.getZr().off("mouseup", handlePointerUp);
      chart?.dispose();
    };
  }, [
    highlightedPeriodSet,
    onAddHighlightedPeriodRange,
    onRemoveHighlightedPeriodRange,
    seriesSet,
    visiblePeriodSet,
  ]);

  return (
    <div
      className="flex min-h-[292px] flex-1 flex-col overflow-hidden rounded-md border border-[var(--color-border)] bg-white"
      data-evidence-target="chart"
      aria-label="Chart evidence region"
    >
      <div className="grid gap-2.5 border-b border-[var(--color-border)] bg-white px-5 py-3.5 min-[1180px]:grid-cols-[minmax(0,1fr)_auto] min-[1180px]:items-end">
        <div className="min-w-0">
          <h3 className="[overflow-wrap:anywhere] font-[Arial_Black,Arial,sans-serif] text-[22px] font-black leading-none tracking-[0.01em] text-[var(--color-ink)]">
            {indicatorId}
          </h3>
          <p className="mt-2 truncate text-[14px] font-semibold leading-[1.25] text-[var(--color-muted)]">{indicatorName}</p>
        </div>
        <div className="min-w-0 text-left min-[1180px]:text-right">
          <p className="text-[10px] font-extrabold uppercase leading-none text-[var(--color-subtle)]">Desk Series</p>
          <p className="max-w-[260px] truncate text-[12px] font-bold leading-[1.25] text-[var(--color-ink)]">
            {deskSeries ?? "n/a"}
          </p>
        </div>
      </div>
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
