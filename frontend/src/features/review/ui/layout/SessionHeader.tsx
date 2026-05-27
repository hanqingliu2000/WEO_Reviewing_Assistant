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

type BrandChoice = "weo" | "mcdreo";

const COUNTRY_OPTIONS = [
  { isoCode: "XFA", name: "Fictional Economy A" },
  { isoCode: "XFB", name: "Fictional Economy B" },
  { isoCode: "XFC", name: "Fictional Economy C" },
];

function BrandMark({ brand }: { brand: BrandChoice }) {
  const isWeo = brand === "weo";

  return (
    <span className="grid text-white">
      <span className="text-[11px] font-bold uppercase text-white/75">IMF / {isWeo ? "WEO" : "MCD REO"}</span>
      <span className="text-[18px] font-extrabold leading-[1.05] text-white">Reviewing Assistant</span>
    </span>
  );
}

function brandSurfaceClass(brand: BrandChoice) {
  return brand === "weo" ? "bg-[var(--color-brand-primary)]" : "bg-[#d8a10f]";
}

function BrandOption({ brand }: { brand: BrandChoice }) {
  return (
    <span
      className={`flex min-h-[48px] w-full min-w-[220px] items-center rounded-md px-3 py-1.5 shadow-sm ${brandSurfaceClass(
        brand,
      )}`}
    >
      <BrandMark brand={brand} />
    </span>
  );
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
  const [brandChoice, setBrandChoice] = useState<BrandChoice>("weo");
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountryIsoCode, setSelectedCountryIsoCode] = useState(session.country.iso_code);
  const selectedCountry =
    COUNTRY_OPTIONS.find((country) => country.isoCode === selectedCountryIsoCode) ?? {
      isoCode: session.country.iso_code,
      name: session.country.name,
    };
  const filteredCountries = COUNTRY_OPTIONS.filter((country) => {
    const query = countrySearch.trim().toLowerCase();

    return !query || country.isoCode.toLowerCase().includes(query) || country.name.toLowerCase().includes(query);
  });

  return (
    <header className="grid min-h-[58px] items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1.5 shadow-[var(--shadow-panel)] [grid-template-columns:minmax(220px,0.75fr)_minmax(300px,1fr)_minmax(300px,0.95fr)] max-[1220px]:[grid-template-columns:minmax(210px,0.75fr)_minmax(260px,0.9fr)_minmax(300px,1fr)] max-[980px]:[grid-template-columns:1fr]">
      <div className="relative min-w-0" aria-label="IMF report identity">
        <button
          aria-expanded={brandMenuOpen}
          aria-label="Choose report identity"
          className="block w-full rounded-md border border-transparent p-0 text-left"
          onClick={() => setBrandMenuOpen((current) => !current)}
          type="button"
        >
          <BrandOption brand={brandChoice} />
        </button>
        {brandMenuOpen ? (
          <div className="absolute left-0 top-[calc(100%+4px)] z-50 grid w-full min-w-[220px] gap-1 rounded-md border border-[var(--color-border)] bg-white p-1 shadow-[0_8px_20px_rgb(24_35_51_/_16%)]">
            <button
              className="block w-full rounded-md p-0 text-left"
              onClick={() => {
                setBrandChoice("weo");
                setBrandMenuOpen(false);
              }}
              type="button"
            >
              <BrandOption brand="weo" />
            </button>
            <button
              className="block w-full rounded-md p-0 text-left"
              onClick={() => {
                setBrandChoice("mcdreo");
                setBrandMenuOpen(false);
              }}
              type="button"
            >
              <BrandOption brand="mcdreo" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex min-w-0 items-center justify-center gap-3 max-[980px]:justify-start" aria-label="Review session summary">
        <fieldset className="relative grid h-12 w-full max-w-[420px] content-center rounded-md border border-[var(--color-border)] px-2 pb-1 pt-0">
          <legend className="px-1 text-[10px] font-extrabold uppercase leading-none text-[var(--color-subtle)]">Country</legend>
          <button
            aria-expanded={countryMenuOpen}
            aria-label="Select country"
            className="flex h-6 min-w-0 items-center justify-between gap-2 rounded-sm border border-[var(--color-border-strong)] bg-white px-2 text-left text-sm font-bold text-[var(--color-ink)]"
            onClick={() => {
              setCountryMenuOpen((current) => !current);
              setCountrySearch("");
            }}
            type="button"
          >
            <span className="truncate">
              {selectedCountry.isoCode} - {selectedCountry.name}
            </span>
            <span className="shrink-0 text-[11px] text-[var(--color-muted)]" aria-hidden="true">
              v
            </span>
          </button>
          {countryMenuOpen ? (
            <div className="absolute left-0 top-[calc(100%+4px)] z-50 grid w-full min-w-[260px] gap-1 rounded-md border border-[var(--color-border)] bg-white p-2 shadow-[0_8px_20px_rgb(24_35_51_/_16%)]">
              <input
                aria-label="Search countries"
                autoFocus
                className="h-8 rounded-md border border-[var(--color-border-strong)] px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-brand-primary)]"
                onChange={(event) => setCountrySearch(event.target.value)}
                placeholder="Search country"
                value={countrySearch}
              />
              <div className="grid max-h-40 gap-1 overflow-auto">
                {filteredCountries.length ? (
                  filteredCountries.map((country) => (
                    <button
                      className={`rounded-sm px-2 py-1.5 text-left text-sm font-bold hover:bg-[var(--color-brand-bg)] ${
                        country.isoCode === selectedCountry.isoCode ? "bg-[var(--color-brand-bg)] text-[var(--color-brand-primary)]" : ""
                      }`}
                      key={country.isoCode}
                      onClick={() => {
                        setSelectedCountryIsoCode(country.isoCode);
                        setCountryMenuOpen(false);
                        setCountrySearch("");
                      }}
                      type="button"
                    >
                      {country.isoCode} - {country.name}
                    </button>
                  ))
                ) : (
                  <p className="px-2 py-1.5 text-[12px] text-[var(--color-muted)]">No countries found</p>
                )}
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
