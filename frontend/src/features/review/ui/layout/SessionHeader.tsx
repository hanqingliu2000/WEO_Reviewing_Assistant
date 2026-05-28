import { useState } from "react";
import type { ReviewSession } from "../../types/review";

type SessionHeaderProps = {
  decimalPlaces: number;
  fontSizeStep: number;
  onDecreaseDecimalPlaces: () => void;
  onDecreaseFontSize: () => void;
  onIncreaseDecimalPlaces: () => void;
  onIncreaseFontSize: () => void;
  session: ReviewSession;
};

type CountryAssignment = "primary" | "backup" | null;
type CountryOption = {
  isoCode: string;
  name: string;
  assignment: CountryAssignment;
};

const COUNTRY_OPTIONS: CountryOption[] = [
  { isoCode: "XFA", name: "Fictional Economy A", assignment: "primary" },
  { isoCode: "XFB", name: "Fictional Economy B", assignment: "backup" },
  { isoCode: "XFC", name: "Fictional Economy C", assignment: null },
  { isoCode: "XFD", name: "Fictional Economy D", assignment: null },
  { isoCode: "XFE", name: "Fictional Economy E", assignment: null },
];

function AssignmentBadge({ assignment }: { assignment: Exclude<CountryAssignment, null> }) {
  return (
    <span
      className={`grid h-4 min-w-4 place-items-center rounded-[4px] px-0.5 text-[9px] font-extrabold uppercase leading-none ${
        assignment === "primary"
          ? "bg-[var(--color-brand-primary)] text-white"
          : "bg-[var(--color-border-strong)] text-[var(--color-ink)]"
      }`}
      title={assignment === "primary" ? "Primary assigned country" : "Backup assigned country"}
    >
      {assignment === "primary" ? "P" : "B"}
    </span>
  );
}

function ToolIdentityPlaceholder() {
  return (
    <div className="flex min-w-0 items-center gap-2" aria-label="Tool identity placeholder">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-[rgb(0_76_151_/_22%)] bg-[var(--color-brand-primary)] text-[13px] font-extrabold text-white">
        RA
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-extrabold leading-[1.1] text-[var(--color-ink)]">
          Reviewing Assistant
        </span>
        <span className="block truncate text-[10px] font-bold uppercase leading-[1.2] text-[var(--color-subtle)]">
          Tool placeholder
        </span>
      </span>
    </div>
  );
}

function CountryOptionButton({
  country,
  isSelected,
  onSelect,
}: {
  country: CountryOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={`grid min-h-8 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm font-bold hover:bg-[var(--color-brand-bg)] ${
        country.assignment ? "bg-[var(--color-panel-muted)]" : "bg-white"
      } ${isSelected ? "text-[var(--color-brand-primary)] ring-1 ring-[rgb(0_76_151_/_18%)]" : "text-[var(--color-ink)]"}`}
      onClick={onSelect}
      type="button"
    >
      <span className="truncate">
        {country.isoCode} - {country.name}
      </span>
      {country.assignment ? <AssignmentBadge assignment={country.assignment} /> : <span aria-hidden="true" />}
    </button>
  );
}

function CountryGroup({
  countries,
  emptyText,
  onSelectCountry,
  selectedCountryIsoCode,
}: {
  countries: CountryOption[];
  emptyText: string;
  onSelectCountry: (isoCode: string) => void;
  selectedCountryIsoCode: string;
}) {
  if (!countries.length) {
    return <p className="px-2 py-1.5 text-[12px] text-[var(--color-muted)]">{emptyText}</p>;
  }

  return (
    <div className="grid gap-1">
      {countries.map((country) => (
        <CountryOptionButton
          country={country}
          isSelected={country.isoCode === selectedCountryIsoCode}
          key={country.isoCode}
          onSelect={() => onSelectCountry(country.isoCode)}
        />
      ))}
    </div>
  );
}

function fallbackCountry(session: ReviewSession): CountryOption {
  return {
    isoCode: session.country.iso_code,
    name: session.country.name,
    assignment: "primary",
  };
}

function searchCountries(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return COUNTRY_OPTIONS.filter(
    (country) =>
      !normalizedQuery ||
      country.isoCode.toLowerCase().includes(normalizedQuery) ||
      country.name.toLowerCase().includes(normalizedQuery),
  );
}

function sortAssignedCountries(countries: CountryOption[]) {
  const order: Record<Exclude<CountryAssignment, null>, number> = { primary: 0, backup: 1 };

  return [...countries].sort((first, second) => {
    if (!first.assignment || !second.assignment) {
      return 0;
    }

    return order[first.assignment] - order[second.assignment];
  });
}

export function SessionHeader({
  decimalPlaces,
  fontSizeStep,
  onDecreaseDecimalPlaces,
  onDecreaseFontSize,
  onIncreaseDecimalPlaces,
  onIncreaseFontSize,
  session,
}: SessionHeaderProps) {
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountryIsoCode, setSelectedCountryIsoCode] = useState(session.country.iso_code);
  const selectedCountry = COUNTRY_OPTIONS.find((country) => country.isoCode === selectedCountryIsoCode) ?? fallbackCountry(session);
  const filteredCountries = searchCountries(countrySearch);
  const assignedCountries = sortAssignedCountries(filteredCountries.filter((country) => country.assignment));
  const otherCountries = filteredCountries.filter((country) => !country.assignment);

  function selectCountry(isoCode: string) {
    setSelectedCountryIsoCode(isoCode);
    setCountryMenuOpen(false);
    setCountrySearch("");
  }

  return (
    <header className="session-header grid min-h-[58px] items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1.5 shadow-[var(--shadow-panel)] [grid-template-columns:minmax(240px,1fr)_minmax(360px,520px)_minmax(240px,1fr)] max-[980px]:[grid-template-columns:1fr]">
      <ToolIdentityPlaceholder />

      <div className="flex min-w-0 items-center justify-center" aria-label="Review session summary">
        <fieldset className="relative mx-auto grid h-12 w-full max-w-[520px] content-center rounded-md border border-[var(--color-border)] px-2 pb-1 pt-0">
          <legend className="px-1 text-[10px] font-extrabold uppercase leading-none text-[var(--color-subtle)]">Country</legend>
          <button
            aria-expanded={countryMenuOpen}
            aria-label="Select country"
            className="grid h-6 min-w-0 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-1.5 rounded-sm border border-[var(--color-border-strong)] bg-white px-2 text-left text-sm font-bold text-[var(--color-ink)]"
            onClick={() => {
              setCountryMenuOpen((current) => !current);
              setCountrySearch("");
            }}
            type="button"
          >
            <span className="truncate">
              {selectedCountry.isoCode} - {selectedCountry.name}
            </span>
            {selectedCountry.assignment ? <AssignmentBadge assignment={selectedCountry.assignment} /> : <span />}
            <span className="shrink-0 text-[11px] text-[var(--color-muted)]" aria-hidden="true">
              v
            </span>
          </button>
          {countryMenuOpen ? (
            <div className="absolute left-0 top-[calc(100%+4px)] z-50 grid w-full min-w-[360px] gap-2 rounded-md border border-[var(--color-border)] bg-white p-2 shadow-[0_8px_20px_rgb(24_35_51_/_16%)]">
              <input
                aria-label="Search countries"
                autoFocus
                className="h-8 rounded-md border border-[var(--color-border-strong)] px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-brand-primary)]"
                onChange={(event) => setCountrySearch(event.target.value)}
                placeholder="Search country"
                value={countrySearch}
              />
              <div className="grid max-h-56 gap-2 overflow-auto">
                <div className="grid gap-1">
                  <p className="px-2 text-[10px] font-extrabold uppercase text-[var(--color-subtle)]">Assigned to you</p>
                  <CountryGroup
                    countries={assignedCountries}
                    emptyText="No assigned countries found"
                    onSelectCountry={selectCountry}
                    selectedCountryIsoCode={selectedCountry.isoCode}
                  />
                </div>
                <div className="h-px bg-[var(--color-border)]" />
                <div className="grid gap-1">
                  <p className="px-2 text-[10px] font-extrabold uppercase text-[var(--color-subtle)]">Other countries</p>
                  <CountryGroup
                    countries={otherCountries}
                    emptyText="No other countries found"
                    onSelectCountry={selectCountry}
                    selectedCountryIsoCode={selectedCountry.isoCode}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </fieldset>
      </div>

      <div className="flex min-w-0 flex-wrap items-center justify-end gap-1.5 max-[980px]:justify-start">
        <fieldset className="grid h-12 content-center rounded-md border border-[var(--color-border)] px-2 pb-1 pt-0" aria-label="Decimal controls">
          <legend className="px-1 text-[10px] font-extrabold uppercase leading-none text-[var(--color-subtle)]">Decimals</legend>
          <div className="flex items-center gap-1">
            <button
              aria-label="Decrease decimal places"
              className="inline-grid h-6 min-w-8 place-items-center rounded-sm border border-[var(--color-border-strong)] bg-[var(--color-panel)] px-2 text-xs font-extrabold leading-none text-[var(--color-ink)] hover:border-[var(--color-brand-primary)] disabled:opacity-40"
              disabled={decimalPlaces === 0}
              onClick={onDecreaseDecimalPlaces}
              type="button"
            >
              .0-
            </button>
            <button
              aria-label="Increase decimal places"
              className="inline-grid h-6 min-w-8 place-items-center rounded-sm border border-[var(--color-border-strong)] bg-[var(--color-panel)] px-2 text-xs font-extrabold leading-none text-[var(--color-ink)] hover:border-[var(--color-brand-primary)] disabled:opacity-40"
              disabled={decimalPlaces === 3}
              onClick={onIncreaseDecimalPlaces}
              type="button"
            >
              .0+
            </button>
          </div>
        </fieldset>
        <fieldset className="grid h-12 content-center rounded-md border border-[var(--color-border)] px-2 pb-1 pt-0" aria-label="Font size controls">
          <legend className="px-1 text-[10px] font-extrabold uppercase leading-none text-[var(--color-subtle)]">Font Size</legend>
          <div className="flex items-center gap-1">
            <button
              aria-label="Decrease font size"
              className="inline-grid h-6 min-w-8 place-items-center rounded-sm border border-[var(--color-border-strong)] bg-[var(--color-panel)] px-2 text-xs font-extrabold leading-none text-[var(--color-ink)] hover:border-[var(--color-brand-primary)] disabled:opacity-40"
              disabled={fontSizeStep === 0}
              onClick={onDecreaseFontSize}
              type="button"
            >
              A-
            </button>
            <button
              aria-label="Increase font size"
              className="inline-grid h-6 min-w-8 place-items-center rounded-sm border border-[var(--color-border-strong)] bg-[var(--color-panel)] px-2 text-sm font-extrabold leading-none text-[var(--color-ink)] hover:border-[var(--color-brand-primary)] disabled:opacity-40"
              disabled={fontSizeStep === 4}
              onClick={onIncreaseFontSize}
              type="button"
            >
              A+
            </button>
          </div>
        </fieldset>
        <button
          className="ml-auto grid h-12 w-12 place-items-center rounded-md border border-[var(--color-border-strong)] bg-[var(--color-panel)] text-[var(--color-ink)] hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]"
          type="button"
          aria-label="Other settings"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.05.05a2.05 2.05 0 0 1-2.9 2.9l-.05-.05A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.07a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.05.05a2.05 2.05 0 0 1-2.9-2.9l.05-.05A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.07a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.05-.05a2.05 2.05 0 0 1 2.9-2.9l.05.05A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.07a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.05-.05a2.05 2.05 0 0 1 2.9 2.9l-.05.05A1.7 1.7 0 0 0 19.4 9c.22.61.8 1 1.55 1H21a2 2 0 0 1 0 4h-.07a1.7 1.7 0 0 0-1.55 1Z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
