import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
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
  onToggleHighlightedPeriod: (period: string) => void;
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

type HighlightRange = {
  endIndex: number;
  endPeriod: string;
  startIndex: number;
  startPeriod: string;
  totalPeriods: number;
};

type HoveredRangeControls = HighlightRange & {
  chartHeight: number;
  left: number;
  right: number;
};

type DragPreviewRange = {
  originalKey: string;
  range: HighlightRange;
};

const CHART_GRID = { bottom: 72, left: 48, right: 36, top: 32 };

function highlightRangeKey(range: Pick<HighlightRange, "endPeriod" | "startPeriod">) {
  return `${range.startPeriod}-${range.endPeriod}`;
}

function rangeEdgesForPlot(range: HighlightRange, width: number) {
  const plotWidth = width - CHART_GRID.left - CHART_GRID.right;
  const denominator = Math.max(range.totalPeriods - 1, 1);
  const periodStep = range.totalPeriods > 1 ? plotWidth / denominator : plotWidth;
  const startCenter = CHART_GRID.left + (plotWidth * range.startIndex) / denominator;
  const endCenter = CHART_GRID.left + (plotWidth * range.endIndex) / denominator;

  return {
    left: Math.max(CHART_GRID.left, startCenter - periodStep / 2),
    right: Math.min(CHART_GRID.left + plotWidth, endCenter + periodStep / 2),
  };
}

function makeHighlightRanges(periods: string[], highlightedPeriodSet: Set<string>) {
  const ranges: HighlightRange[] = [];
  let currentRange: HighlightRange | null = null;

  periods.forEach((period, index) => {
    if (!highlightedPeriodSet.has(period)) {
      if (currentRange) {
        ranges.push(currentRange);
        currentRange = null;
      }
      return;
    }

    if (!currentRange) {
      currentRange = {
        endIndex: index,
        endPeriod: period,
        startIndex: index,
        startPeriod: period,
        totalPeriods: periods.length,
      };
      return;
    }

    currentRange.endIndex = index;
    currentRange.endPeriod = period;
  });

  if (currentRange) {
    ranges.push(currentRange);
  }

  return ranges;
}

function makeRangeFromPeriodBounds(periods: string[], firstPeriod: string, secondPeriod: string) {
  const firstIndex = periods.indexOf(firstPeriod);
  const secondIndex = periods.indexOf(secondPeriod);

  if (firstIndex === -1 || secondIndex === -1) {
    return null;
  }

  const startIndex = Math.min(firstIndex, secondIndex);
  const endIndex = Math.max(firstIndex, secondIndex);

  return {
    endIndex,
    endPeriod: periods[endIndex],
    startIndex,
    startPeriod: periods[startIndex],
    totalPeriods: periods.length,
  };
}

export function SeriesChart({
  deskSeries,
  formula,
  highlightedPeriods,
  indicatorId,
  indicatorName,
  onAddHighlightedPeriodRange,
  onRemoveHighlightedPeriodRange,
  onToggleHighlightedPeriod,
  seriesSet,
  visiblePeriods,
}: SeriesChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoveredRangeControls, setHoveredRangeControls] = useState<HoveredRangeControls | null>(null);
  const [chartSize, setChartSize] = useState({ height: 0, width: 0 });
  const [dragPreviewRange, setDragPreviewRange] = useState<DragPreviewRange | null>(null);
  const highlightedPeriodSet = useMemo(() => new Set(highlightedPeriods), [highlightedPeriods]);
  const visiblePeriodSet = useMemo(() => new Set(visiblePeriods), [visiblePeriods]);
  const periods = useMemo(
    () => seriesSet.current.points.map((point) => point.period).filter((period) => visiblePeriodSet.has(period)),
    [seriesSet.current.points, visiblePeriodSet],
  );
  const highlightedRanges = useMemo(
    () => makeHighlightRanges(periods, highlightedPeriodSet),
    [highlightedPeriodSet, periods],
  );
  const visibleHighlightRanges = useMemo(() => {
    if (!dragPreviewRange) {
      return highlightedRanges;
    }

    return highlightedRanges.map((range) =>
      highlightRangeKey(range) === dragPreviewRange.originalKey ? dragPreviewRange.range : range,
    );
  }, [dragPreviewRange, highlightedRanges]);
  const highlightedRangeOverlays = useMemo(() => {
    if (!chartSize.width || !chartSize.height) {
      return [];
    }

    return visibleHighlightRanges.map((range) => {
      const edges = rangeEdgesForPlot(range, chartSize.width);

      return {
        ...range,
        left: edges.left,
        top: CHART_GRID.top,
        width: edges.right - edges.left,
        height: Math.max(chartSize.height - CHART_GRID.top - CHART_GRID.bottom, 0),
      };
    });
  }, [chartSize.height, chartSize.width, visibleHighlightRanges]);

  function controlsForRange(range: HighlightRange) {
    const chartElement = chartRef.current;

    if (!chartElement) {
      return null;
    }

    const edges = rangeEdgesForPlot(range, chartElement.clientWidth);

    return {
      ...range,
      chartHeight: chartElement.clientHeight,
      left: edges.left,
      right: edges.right,
    };
  }

  function periodFromClientX(clientX: number) {
    const chartElement = chartRef.current;

    if (!chartElement || periods.length === 0) {
      return null;
    }

    if (periods.length === 1) {
      return periods[0];
    }

    const bounds = chartElement.getBoundingClientRect();
    const plotWidth = bounds.width - CHART_GRID.left - CHART_GRID.right;
    const rawIndex = ((clientX - bounds.left - CHART_GRID.left) / plotWidth) * (periods.length - 1);
    const periodIndex = Math.min(Math.max(Math.round(rawIndex), 0), periods.length - 1);
    return periods[periodIndex] ?? null;
  }

  function handleRangeHandlePointerDown(side: "end" | "start", range: HighlightRange, event: PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const originalKey = highlightRangeKey(range);
    let latestRange = range;

    function updatePreview(pointerEvent: globalThis.PointerEvent) {
      const nextPeriod = periodFromClientX(pointerEvent.clientX);

      if (!nextPeriod) {
        return;
      }

      const nextRange = side === "start"
        ? makeRangeFromPeriodBounds(periods, nextPeriod, range.endPeriod)
        : makeRangeFromPeriodBounds(periods, range.startPeriod, nextPeriod);

      if (!nextRange) {
        return;
      }

      latestRange = nextRange;
      setDragPreviewRange({ originalKey, range: nextRange });
      setHoveredRangeControls(controlsForRange(nextRange));
    }

    function handlePointerMove(pointerEvent: globalThis.PointerEvent) {
      updatePreview(pointerEvent);
    }

    function handlePointerUp(pointerEvent: globalThis.PointerEvent) {
      updatePreview(pointerEvent);
      onRemoveHighlightedPeriodRange(range.startPeriod, range.endPeriod);
      onAddHighlightedPeriodRange(latestRange.startPeriod, latestRange.endPeriod);
      setDragPreviewRange(null);
      setHoveredRangeControls(controlsForRange(latestRange));
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    }

    updatePreview(event.nativeEvent);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  useEffect(() => {
    const chartElement = chartRef.current;

    if (!chartElement) {
      return undefined;
    }
    const element: HTMLDivElement = chartElement;

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
        {
          type: "slider",
          xAxisIndex: 0,
          bottom: 8,
          height: 24,
          left: CHART_GRID.left,
          right: CHART_GRID.right,
          filterMode: "none",
          brushSelect: false,
          showDataShadow: false,
        },
      ],
      grid: CHART_GRID,
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

    function controlsForChartRange(range: HighlightRange) {
      const width = element.clientWidth;
      const height = element.clientHeight;
      const edges = rangeEdgesForPlot(range, width);

      return {
        ...range,
        chartHeight: height,
        left: edges.left,
        right: edges.right,
      };
    }

    function highlightedRangeFromPointer(event: ChartPointerEvent) {
      if (!chart || !chart.containPixel({ gridIndex: 0 }, [event.offsetX, event.offsetY])) {
        return null;
      }

      return visibleHighlightRanges.find((range) => {
        const edges = rangeEdgesForPlot(range, element.clientWidth);
        return edges.left <= event.offsetX && event.offsetX <= edges.right;
      }) ?? null;
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

      if (dragButton === 0 && dragStartPeriod === endPeriod) {
        onToggleHighlightedPeriod(endPeriod);
      } else if (dragButton === 0) {
        onAddHighlightedPeriodRange(dragStartPeriod, endPeriod);
      } else {
        onRemoveHighlightedPeriodRange(dragStartPeriod, endPeriod);
      }

      dragStartPeriod = null;
      dragButton = null;
    }

    function handlePointerMove(event: ChartPointerEvent) {
      const range = highlightedRangeFromPointer(event);

      setHoveredRangeControls(range ? controlsForChartRange(range) : null);
    }

    function handleContextMenu(event: Event) {
      event.preventDefault();
    }

    function ensureChart() {
      if (!element.clientWidth || !element.clientHeight) {
        return;
      }

      setChartSize({ height: element.clientHeight, width: element.clientWidth });

      if (!chart) {
        chart = echarts.init(element);
        chart.setOption(options);
        chart.getZr().on("mousedown", handlePointerDown);
        chart.getZr().on("mouseup", handlePointerUp);
        chart.getZr().on("mousemove", handlePointerMove);
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
      chart?.getZr().off("mousemove", handlePointerMove);
      chart?.dispose();
    };
  }, [
    highlightedPeriodSet,
    onAddHighlightedPeriodRange,
    onRemoveHighlightedPeriodRange,
    onToggleHighlightedPeriod,
    periods,
    seriesSet,
    visibleHighlightRanges,
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
        className="relative min-h-[260px] flex-1 overflow-hidden"
        aria-label="Line chart"
        onMouseLeave={() => setHoveredRangeControls(null)}
      >
        <div className="absolute inset-0" ref={chartRef} />
        {highlightedRangeOverlays.map((range) => (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-[1] bg-[rgba(217,154,0,0.085)]"
            key={`${range.startPeriod}-${range.endPeriod}`}
            style={{
              height: range.height,
              left: range.left,
              top: range.top,
              width: range.width,
            }}
          />
        ))}
        {hoveredRangeControls ? (
          <>
            <button
              aria-label="Adjust highlight start"
              className="absolute z-10 flex h-7 w-4 -translate-x-1/2 items-center justify-center rounded-sm border border-transparent bg-white/80 text-[14px] font-black leading-none text-[#c47d00] shadow-sm hover:border-[#d99a00] hover:bg-white focus-visible:border-[#d99a00] focus-visible:outline-none"
              onPointerDown={(event) => handleRangeHandlePointerDown("start", hoveredRangeControls, event)}
              style={{
                left: hoveredRangeControls.left,
                top: Math.max(CHART_GRID.top + 8, hoveredRangeControls.chartHeight / 2 - 10),
              }}
              title="Drag to adjust highlight range"
              type="button"
            >
              {"<"}
            </button>
            <button
              aria-label="Adjust highlight end"
              className="absolute z-10 flex h-7 w-4 -translate-x-1/2 items-center justify-center rounded-sm border border-transparent bg-white/80 text-[14px] font-black leading-none text-[#c47d00] shadow-sm hover:border-[#d99a00] hover:bg-white focus-visible:border-[#d99a00] focus-visible:outline-none"
              onPointerDown={(event) => handleRangeHandlePointerDown("end", hoveredRangeControls, event)}
              style={{
                left: hoveredRangeControls.right,
                top: Math.max(CHART_GRID.top + 8, hoveredRangeControls.chartHeight / 2 - 10),
              }}
              title="Drag to adjust highlight range"
              type="button"
            >
              {">"}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
