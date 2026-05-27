import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import type { IndicatorSeriesSet, ReviewItem, ReviewItemDetail, TimeSeriesPoint } from "../../types/review";
import { SeriesChart } from "./SeriesChart";

type ReviewSurfaceProps = {
  activeDetail: ReviewItemDetail;
  activeItem: ReviewItem;
  decimalPlaces: number;
};

type SeriesRow = {
  label: string;
  points: TimeSeriesPoint[];
};

function formatNumber(value: number | null | undefined, decimalPlaces: number) {
  return value === null || value === undefined ? "n/a" : value.toFixed(decimalPlaces);
}

function periodColumnWidth(frequency: ReviewItem["frequency"]) {
  return frequency === "Q" ? 64 : 54;
}

function makeSeriesRows(seriesSet: IndicatorSeriesSet): SeriesRow[] {
  return [
    { label: "Current", points: seriesSet.current.points },
    { label: "Previous", points: seriesSet.previous.points },
    ...(seriesSet.published ? [{ label: "Published", points: seriesSet.published.points }] : []),
  ];
}

function valueByPeriod(points: TimeSeriesPoint[], period: string) {
  return points.find((point) => point.period === period)?.value;
}

function clampWidth(width: number, min: number, max: number) {
  return Math.min(Math.max(width, min), max);
}

export function ReviewSurface({ activeDetail, activeItem, decimalPlaces }: ReviewSurfaceProps) {
  const [relatedIndicatorWidth, setRelatedIndicatorWidth] = useState(92);
  const [relatedDescriptorWidth, setRelatedDescriptorWidth] = useState(180);
  const mainTableRef = useRef<HTMLDivElement>(null);
  const relatedTableRef = useRef<HTMLDivElement>(null);
  const tableRows = useMemo(() => makeSeriesRows(activeDetail.main_series), [activeDetail.main_series]);
  const allTablePeriods = useMemo(
    () => activeDetail.main_series.current.points.map((point) => point.period),
    [activeDetail.main_series.current.points],
  );
  const tablePeriods = allTablePeriods;
  const cellWidth = periodColumnWidth(activeItem.frequency);
  const mainTableGridStyle = {
    gridTemplateColumns: `82px repeat(${tablePeriods.length}, ${cellWidth}px)`,
  } as CSSProperties;
  const relatedTableGridStyle = {
    gridTemplateColumns: `${relatedIndicatorWidth}px ${relatedDescriptorWidth}px repeat(${tablePeriods.length}, ${cellWidth}px)`,
  } as CSSProperties;
  const descriptorStickyStyle = { left: relatedIndicatorWidth } as CSSProperties;

  useEffect(() => {
    const scrollToRight = (element: HTMLDivElement | null) => {
      if (element) {
        element.scrollLeft = element.scrollWidth;
      }
    };

    scrollToRight(mainTableRef.current);
    scrollToRight(relatedTableRef.current);
  }, [activeDetail.main_series.indicator_id, tablePeriods.length, relatedIndicatorWidth, relatedDescriptorWidth]);

  function beginRelatedColumnResize(
    event: PointerEvent<HTMLButtonElement>,
    column: "indicator" | "descriptor",
  ) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = column === "indicator" ? relatedIndicatorWidth : relatedDescriptorWidth;
    const minWidth = column === "indicator" ? 72 : 120;
    const maxWidth = column === "indicator" ? 150 : 320;

    function handlePointerMove(pointerEvent: globalThis.PointerEvent) {
      const nextWidth = clampWidth(startWidth + pointerEvent.clientX - startX, minWidth, maxWidth);
      if (column === "indicator") {
        setRelatedIndicatorWidth(nextWidth);
      } else {
        setRelatedDescriptorWidth(nextWidth);
      }
    }

    function stopResize() {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize);
  }

  return (
    <>
      <div className="shrink-0 overflow-hidden rounded-md border border-[var(--color-border)] bg-white">
        <div className="overflow-x-auto overflow-y-hidden pb-2" ref={mainTableRef} aria-label="Current previous published data table">
          <div
            className="grid min-h-5 w-max min-w-full items-center bg-[var(--color-panel-muted)] text-[10px] font-extrabold uppercase leading-none text-[var(--color-muted)]"
            style={mainTableGridStyle}
          >
            <span className="sticky left-0 z-20 overflow-hidden bg-[var(--color-panel-muted)] px-2 py-0.5 text-ellipsis whitespace-nowrap shadow-[1px_0_0_var(--color-border)]">
              Series
            </span>
            {tablePeriods.map((period) => (
              <span className="overflow-hidden px-1.5 py-0.5 text-right text-ellipsis whitespace-nowrap" key={period}>
                {period}
              </span>
            ))}
          </div>
          {tableRows.map((row) => (
            <div
              className="grid min-h-5 w-max min-w-full items-center border-t border-[var(--color-border)] text-[10px] leading-none"
              key={row.label}
              style={mainTableGridStyle}
            >
              <strong className="sticky left-0 z-10 overflow-hidden bg-white px-2 py-0.5 text-ellipsis whitespace-nowrap shadow-[1px_0_0_var(--color-border)]">
                {row.label}
              </strong>
              {tablePeriods.map((period) => (
                <span
                  className={`overflow-hidden px-1.5 py-0.5 text-right text-ellipsis whitespace-nowrap tabular-nums ${
                    activeItem.flagged_periods.includes(period)
                      ? "bg-[var(--color-warning-bg)] font-extrabold text-[var(--color-warning)]"
                      : ""
                  }`}
                  key={period}
                >
                  {formatNumber(valueByPeriod(row.points, period), decimalPlaces)}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 px-1">
        <div className="min-w-0">
          <h3 className="[overflow-wrap:anywhere] text-[17px] font-extrabold leading-[1.1] text-[var(--color-ink)]">
            {activeItem.indicator_id}
          </h3>
          <p className="mt-0.5 truncate text-[12px] leading-[1.25] text-[var(--color-muted)]">{activeItem.indicator_name}</p>
        </div>
        <div className="shrink-0 text-right text-[11px] leading-[1.2]">
          <p className="font-extrabold uppercase text-[var(--color-subtle)]">Desk Series</p>
          <p className="max-w-[220px] truncate text-[var(--color-ink)]">{activeDetail.main_series.desk_series ?? "n/a"}</p>
        </div>
      </div>

      <SeriesChart
        flaggedPeriods={activeItem.flagged_periods}
        formula={activeDetail.main_series.formula}
        seriesSet={activeDetail.main_series}
        visiblePeriods={tablePeriods}
      />

      <div className="shrink-0 overflow-hidden rounded-md border border-[var(--color-border)] bg-white">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-panel-muted)] px-2 py-1">
          <h4 className="text-[11px] font-extrabold uppercase text-[var(--color-muted)]">Related Indicators</h4>
        </div>
        <div className="overflow-x-auto overflow-y-hidden pb-2" ref={relatedTableRef} aria-label="Related indicators table">
          <div
            className="grid min-h-6 w-max min-w-full items-center bg-[var(--color-panel-muted)] text-[10px] font-extrabold uppercase text-[var(--color-muted)]"
            style={relatedTableGridStyle}
          >
            <span className="sticky left-0 z-30 flex items-center justify-between gap-1 border-r border-[var(--color-border)] bg-[var(--color-panel-muted)] px-2 py-1">
              Indicator
              <button
                aria-label="Resize indicator column"
                className="absolute top-0 right-[-4px] z-40 h-full w-2 cursor-col-resize bg-transparent hover:bg-[rgb(0_76_151_/_14%)] focus-visible:bg-[rgb(0_76_151_/_18%)] focus-visible:outline-none"
                onPointerDown={(event) => beginRelatedColumnResize(event, "indicator")}
                type="button"
              />
            </span>
            <span
              className="sticky z-20 flex items-center justify-between gap-1 border-r border-[var(--color-border)] bg-[var(--color-panel-muted)] px-2 py-1"
              style={descriptorStickyStyle}
            >
              Descriptor
              <button
                aria-label="Resize descriptor column"
                className="absolute top-0 right-[-4px] z-40 h-full w-2 cursor-col-resize bg-transparent hover:bg-[rgb(0_76_151_/_14%)] focus-visible:bg-[rgb(0_76_151_/_18%)] focus-visible:outline-none"
                onPointerDown={(event) => beginRelatedColumnResize(event, "descriptor")}
                type="button"
              />
            </span>
            {tablePeriods.map((period) => (
              <span className="overflow-hidden px-1.5 py-1 text-right text-ellipsis whitespace-nowrap" key={period}>
                {period}
              </span>
            ))}
          </div>
          {activeDetail.related_indicators.length > 0 ? (
            activeDetail.related_indicators.map((related) => (
              <div
                className="grid min-h-6 w-max min-w-full items-center border-t border-[var(--color-border)] text-[11px]"
                key={related.indicator_id}
                style={relatedTableGridStyle}
              >
                <strong className="sticky left-0 z-20 overflow-hidden border-r border-[var(--color-border)] bg-white px-2 py-1 text-ellipsis whitespace-nowrap">
                  {related.indicator_id}
                </strong>
                <span
                  className="sticky z-10 overflow-hidden border-r border-[var(--color-border)] bg-white px-2 py-1 text-ellipsis whitespace-nowrap"
                  style={descriptorStickyStyle}
                >
                  {related.descriptor ?? related.indicator_name}
                </span>
                {tablePeriods.map((period) => (
                  <span
                    className="overflow-hidden px-1.5 py-1 text-right text-ellipsis whitespace-nowrap tabular-nums"
                    key={period}
                  >
                    {formatNumber(valueByPeriod(related.current.points, period), decimalPlaces)}
                  </span>
                ))}
              </div>
            ))
          ) : (
            <div
              className="grid min-h-12 w-max min-w-full items-center border-t border-[var(--color-border)] bg-white text-[11px]"
              style={relatedTableGridStyle}
            >
              <div
                className="flex items-center gap-2 px-2 py-2 text-[var(--color-muted)]"
                style={{ gridColumn: "1 / -1" }}
              >
                <span className="h-2 w-2 rounded-full border border-[var(--color-border)] bg-[var(--color-panel-muted)]" />
                <span>No related indicators available for this indicator.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
