import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, PointerEvent, ReactNode, RefObject } from "react";
import type { IndicatorSeriesSet, ReviewItem, ReviewItemDetail, TimeSeriesPoint } from "../../types/review";
import { SeriesChart } from "./SeriesChart";

type ReviewSurfaceProps = {
  activeDetail: ReviewItemDetail;
  activeItem: ReviewItem;
  decimalPlaces: number;
  highlightedPeriods: string[];
  onAddHighlightedPeriodRange: (startPeriod: string, endPeriod: string) => void;
  onRemoveHighlightedPeriodRange: (startPeriod: string, endPeriod: string) => void;
  onToggleHighlightedPeriod: (period: string) => void;
};

type SeriesRow = {
  label: string;
  points: TimeSeriesPoint[];
  tooltip?: string;
};

type PeriodTableRow = {
  id: string;
  points: TimeSeriesPoint[];
  tooltip?: string;
  values: Record<string, ReactNode>;
};

type PeriodTableLeadingColumn = {
  key: string;
  label: string;
  onResizePointerDown?: (event: PointerEvent<HTMLButtonElement>) => void;
  resizeAriaLabel?: string;
  stickyLeft?: number;
  zIndexClassName: string;
};

type PeriodDataTableProps = {
  ariaLabel: string;
  className?: string;
  decimalPlaces: number;
  emptyState?: ReactNode;
  gridTemplateColumns: string;
  highlightedPeriodSet: Set<string>;
  leadingColumns: PeriodTableLeadingColumn[];
  onPeriodClick: (event: MouseEvent<HTMLElement>, period: string) => void;
  onPeriodContextMenu: (event: MouseEvent<HTMLElement>) => void;
  periods: string[];
  rows: PeriodTableRow[];
  tableRef: RefObject<HTMLDivElement | null>;
  viewportStyle?: CSSProperties;
};

function formatNumber(value: number | null | undefined, decimalPlaces: number) {
  return value === null || value === undefined ? "n/a" : value.toFixed(decimalPlaces);
}

function basePeriodColumnWidth(frequency: ReviewItem["frequency"]) {
  return frequency === "Q" ? 64 : 54;
}

function makeSeriesRows(seriesSet: IndicatorSeriesSet): SeriesRow[] {
  return [
    { label: "CURRENT", points: seriesSet.current.points },
    {
      label: "PREVIOUS",
      points: seriesSet.previous.points,
      tooltip: "PREVIOUS reflects the data that was last signed-off.",
    },
    ...(seriesSet.published
      ? [
          {
            label: "PUBLISHED",
            points: seriesSet.published.points,
            tooltip: "PUBLISHED reflects the data from the most recent WEO publication.",
          },
        ]
      : []),
  ];
}

function valueByPeriod(points: TimeSeriesPoint[], period: string) {
  return points.find((point) => point.period === period)?.value;
}

function calculatePeriodColumnWidth({
  decimalPlaces,
  frequency,
  relatedSeries,
  tablePeriods,
  tableRows,
}: {
  decimalPlaces: number;
  frequency: ReviewItem["frequency"];
  relatedSeries: IndicatorSeriesSet[];
  tablePeriods: string[];
  tableRows: SeriesRow[];
}) {
  const valueLengths = [
    ...tablePeriods.map((period) => period.length),
    ...tableRows.flatMap((row) =>
      tablePeriods.map((period) => formatNumber(valueByPeriod(row.points, period), decimalPlaces).length),
    ),
    ...relatedSeries.flatMap((related) =>
      tablePeriods.map((period) => formatNumber(valueByPeriod(related.current.points, period), decimalPlaces).length),
    ),
  ];
  const longestValueLength = Math.max(...valueLengths, 3);

  return Math.max(basePeriodColumnWidth(frequency), Math.ceil(longestValueLength * 7 + 18));
}

function clampWidth(width: number, min: number, max: number) {
  return Math.min(Math.max(width, min), max);
}

const RELATED_TABLE_HEADER_HEIGHT = 24;
const RELATED_TABLE_ROW_HEIGHT = 24;
const RELATED_TABLE_SCROLLBAR_PADDING = 8;
const RELATED_TABLE_MIN_DATA_ROWS = 2;

function relatedTableHeightForRows(rowCount: number) {
  const visibleRowCount = Math.max(RELATED_TABLE_MIN_DATA_ROWS, rowCount);
  return RELATED_TABLE_HEADER_HEIGHT + visibleRowCount * RELATED_TABLE_ROW_HEIGHT + RELATED_TABLE_SCROLLBAR_PADDING;
}

function periodHighlightClass(period: string, highlightedPeriodSet: Set<string>) {
  return highlightedPeriodSet.has(period)
    ? "bg-[var(--color-warning-bg)] font-extrabold text-[var(--color-warning)]"
    : "";
}

function PeriodDataTable({
  ariaLabel,
  className = "",
  decimalPlaces,
  emptyState,
  gridTemplateColumns,
  highlightedPeriodSet,
  leadingColumns,
  onPeriodClick,
  onPeriodContextMenu,
  periods,
  rows,
  tableRef,
  viewportStyle,
}: PeriodDataTableProps) {
  const gridStyle = { gridTemplateColumns } as CSSProperties;

  return (
    <div
      aria-label={ariaLabel}
      className={`overflow-auto pb-2 text-[10px] leading-none ${className}`}
      ref={tableRef}
      style={viewportStyle}
    >
      <div
        className="grid min-h-6 w-max min-w-full items-center bg-[var(--color-panel-muted)] font-extrabold uppercase text-[var(--color-muted)]"
        style={gridStyle}
      >
        {leadingColumns.map((column) => (
          <span
            className={`sticky flex items-center justify-between gap-1 overflow-hidden bg-[var(--color-panel-muted)] px-2 py-1 text-ellipsis whitespace-nowrap shadow-[1px_0_0_var(--color-border)] ${column.zIndexClassName}`}
            key={column.key}
            style={column.stickyLeft === undefined ? undefined : { left: column.stickyLeft }}
          >
            {column.label}
            {column.onResizePointerDown && column.resizeAriaLabel ? (
              <button
                aria-label={column.resizeAriaLabel}
                className="absolute top-0 right-[-4px] z-40 h-full w-2 cursor-col-resize bg-transparent hover:bg-[rgb(0_76_151_/_14%)] focus-visible:bg-[rgb(0_76_151_/_18%)] focus-visible:outline-none"
                onPointerDown={column.onResizePointerDown}
                type="button"
              />
            ) : null}
          </span>
        ))}
        {periods.map((period) => (
          <span
            className="cursor-pointer overflow-hidden px-1.5 py-1 text-right text-ellipsis whitespace-nowrap hover:bg-[rgb(0_76_151_/_8%)]"
            key={period}
            onClick={(event) => onPeriodClick(event, period)}
            onContextMenu={onPeriodContextMenu}
            title="Click to toggle period highlight"
          >
            {period}
          </span>
        ))}
      </div>
      {rows.length > 0
        ? rows.map((row) => (
            <div
              className="grid min-h-6 w-max min-w-full items-stretch shadow-[inset_0_1px_0_var(--color-border)]"
              key={row.id}
              style={gridStyle}
            >
              {leadingColumns.map((column) => (
                <strong
                  className={`sticky flex items-center overflow-hidden bg-white px-2 py-1 text-ellipsis whitespace-nowrap shadow-[inset_0_1px_0_var(--color-border),1px_0_0_var(--color-border)] ${column.zIndexClassName}`}
                  key={column.key}
                  style={column.stickyLeft === undefined ? undefined : { left: column.stickyLeft }}
                  title={row.tooltip}
                >
                  {row.values[column.key]}
                </strong>
              ))}
              {periods.map((period) => (
                <span
                  className={`flex cursor-pointer items-center justify-end overflow-hidden px-1.5 py-1 text-right whitespace-nowrap tabular-nums shadow-[inset_0_1px_0_var(--color-border)] ${periodHighlightClass(period, highlightedPeriodSet)}`}
                  data-highlighted={highlightedPeriodSet.has(period) ? "true" : undefined}
                  key={period}
                  onClick={(event) => onPeriodClick(event, period)}
                  onContextMenu={onPeriodContextMenu}
                  title="Click to toggle period highlight"
                >
                  {formatNumber(valueByPeriod(row.points, period), decimalPlaces)}
                </span>
              ))}
            </div>
          ))
        : emptyState}
    </div>
  );
}

export function ReviewSurface({
  activeDetail,
  activeItem,
  decimalPlaces,
  highlightedPeriods,
  onAddHighlightedPeriodRange,
  onRemoveHighlightedPeriodRange,
  onToggleHighlightedPeriod,
}: ReviewSurfaceProps) {
  const [mainSeriesWidth, setMainSeriesWidth] = useState(82);
  const [relatedIndicatorWidth, setRelatedIndicatorWidth] = useState(92);
  const [relatedDescriptorWidth, setRelatedDescriptorWidth] = useState(180);
  const [relatedTableHeight, setRelatedTableHeight] = useState(() =>
    relatedTableHeightForRows(activeDetail.related_indicators.length),
  );
  const mainTableRef = useRef<HTMLDivElement>(null);
  const relatedTableRef = useRef<HTMLDivElement>(null);
  const tableRows = useMemo(() => makeSeriesRows(activeDetail.main_series), [activeDetail.main_series]);
  const allTablePeriods = useMemo(
    () => activeDetail.main_series.current.points.map((point) => point.period),
    [activeDetail.main_series.current.points],
  );
  const tablePeriods = allTablePeriods;
  const mainTableRows = useMemo<PeriodTableRow[]>(
    () =>
      tableRows.map((row) => ({
        id: row.label,
        points: row.points,
        tooltip: row.tooltip,
        values: {
          series: row.label,
        },
      })),
    [tableRows],
  );
  const relatedTableRows = useMemo<PeriodTableRow[]>(
    () =>
      activeDetail.related_indicators.map((related) => ({
        id: related.indicator_id,
        points: related.current.points,
        values: {
          descriptor: related.descriptor ?? related.indicator_name,
          indicator: related.indicator_id,
        },
      })),
    [activeDetail.related_indicators],
  );
  const cellWidth = useMemo(
    () =>
      calculatePeriodColumnWidth({
        decimalPlaces,
        frequency: activeItem.frequency,
        relatedSeries: activeDetail.related_indicators,
        tablePeriods,
        tableRows,
      }),
    [activeDetail.related_indicators, activeItem.frequency, decimalPlaces, tablePeriods, tableRows],
  );
  const mainTableGridTemplateColumns = `${mainSeriesWidth}px repeat(${tablePeriods.length}, ${cellWidth}px)`;
  const relatedTableGridTemplateColumns = `${relatedIndicatorWidth}px ${relatedDescriptorWidth}px repeat(${tablePeriods.length}, ${cellWidth}px)`;
  const highlightedPeriodSet = useMemo(() => new Set(highlightedPeriods), [highlightedPeriods]);
  const relatedTableMinHeight = relatedTableHeightForRows(RELATED_TABLE_MIN_DATA_ROWS);
  const relatedTableMaxHeight = relatedTableHeightForRows(activeDetail.related_indicators.length);

  useEffect(() => {
    setRelatedTableHeight(relatedTableMaxHeight);
  }, [activeDetail.review_item.review_item_id, relatedTableMaxHeight]);

  function handlePeriodClick(event: MouseEvent<HTMLElement>, period: string) {
    event.preventDefault();
    event.stopPropagation();
    onToggleHighlightedPeriod(period);
  }

  function handlePeriodContextMenu(event: MouseEvent<HTMLElement>) {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }

  useEffect(() => {
    const scrollToRight = (element: HTMLDivElement | null) => {
      if (element) {
        element.scrollLeft = element.scrollWidth;
      }
    };

    scrollToRight(mainTableRef.current);
    scrollToRight(relatedTableRef.current);
  }, [activeDetail.main_series.indicator_id, tablePeriods.length, mainSeriesWidth, relatedIndicatorWidth, relatedDescriptorWidth]);

  function beginMainSeriesColumnResize(event: PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = mainSeriesWidth;

    function handlePointerMove(pointerEvent: globalThis.PointerEvent) {
      setMainSeriesWidth(clampWidth(startWidth + pointerEvent.clientX - startX, 72, 128));
    }

    function stopResize() {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize);
  }

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

  function beginRelatedTableHeightResize(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    const startY = event.clientY;
    const startHeight = relatedTableHeight;

    function handlePointerMove(pointerEvent: globalThis.PointerEvent) {
      setRelatedTableHeight(clampWidth(startHeight - (pointerEvent.clientY - startY), relatedTableMinHeight, relatedTableMaxHeight));
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
        <PeriodDataTable
          ariaLabel="Current previous published data table"
          className="overflow-y-hidden shadow-[inset_0_-1px_0_var(--color-border)]"
          decimalPlaces={decimalPlaces}
          gridTemplateColumns={mainTableGridTemplateColumns}
          highlightedPeriodSet={highlightedPeriodSet}
          leadingColumns={[
            {
              key: "series",
              label: "Series",
              onResizePointerDown: beginMainSeriesColumnResize,
              resizeAriaLabel: "Resize series column",
              stickyLeft: 0,
              zIndexClassName: "z-20",
            },
          ]}
          onPeriodClick={handlePeriodClick}
          onPeriodContextMenu={handlePeriodContextMenu}
          periods={tablePeriods}
          rows={mainTableRows}
          tableRef={mainTableRef}
        />
      </div>

      <SeriesChart
        deskSeries={activeDetail.main_series.desk_series}
        formula={activeDetail.main_series.formula}
        highlightedPeriods={highlightedPeriods}
        indicatorId={activeItem.indicator_id}
        indicatorName={activeItem.indicator_name}
        onAddHighlightedPeriodRange={onAddHighlightedPeriodRange}
        onRemoveHighlightedPeriodRange={onRemoveHighlightedPeriodRange}
        onToggleHighlightedPeriod={onToggleHighlightedPeriod}
        seriesSet={activeDetail.main_series}
        visiblePeriods={tablePeriods}
      />

      <div className="shrink-0 overflow-hidden rounded-md border border-[var(--color-border)] bg-white">
        <div
          aria-label="Resize related indicators height"
          className="h-2 cursor-row-resize border-b border-[var(--color-border)] bg-[var(--color-panel-muted)] hover:bg-[rgb(0_76_151_/_12%)]"
          onPointerDown={beginRelatedTableHeightResize}
          role="separator"
        />
        <div className="border-b border-[var(--color-border)] bg-[var(--color-panel-muted)] px-2 py-1">
          <h4 className="text-[11px] font-extrabold uppercase text-[var(--color-muted)]">Related Indicators</h4>
        </div>
        <PeriodDataTable
          ariaLabel="Related indicators table"
          decimalPlaces={decimalPlaces}
          emptyState={
            <div
              className="grid min-h-12 w-max min-w-full items-center bg-white shadow-[inset_0_1px_0_var(--color-border)]"
              style={{ gridTemplateColumns: relatedTableGridTemplateColumns }}
            >
              <div
                className="flex items-center gap-2 px-2 py-2 text-[var(--color-muted)]"
                style={{ gridColumn: "1 / -1" }}
              >
                <span className="h-2 w-2 rounded-full border border-[var(--color-border)] bg-[var(--color-panel-muted)]" />
                <span>No related indicators available for this indicator.</span>
              </div>
            </div>
          }
          gridTemplateColumns={relatedTableGridTemplateColumns}
          highlightedPeriodSet={highlightedPeriodSet}
          leadingColumns={[
            {
              key: "indicator",
              label: "Indicator",
              onResizePointerDown: (event) => beginRelatedColumnResize(event, "indicator"),
              resizeAriaLabel: "Resize indicator column",
              stickyLeft: 0,
              zIndexClassName: "z-30",
            },
            {
              key: "descriptor",
              label: "Descriptor",
              onResizePointerDown: (event) => beginRelatedColumnResize(event, "descriptor"),
              resizeAriaLabel: "Resize descriptor column",
              stickyLeft: relatedIndicatorWidth,
              zIndexClassName: "z-20",
            },
          ]}
          onPeriodClick={handlePeriodClick}
          onPeriodContextMenu={handlePeriodContextMenu}
          periods={tablePeriods}
          rows={relatedTableRows}
          tableRef={relatedTableRef}
          viewportStyle={{ height: relatedTableHeight }}
        />
      </div>
    </>
  );
}
