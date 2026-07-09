import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildAiPrompt,
  changingLineNames,
  deriveHexagram,
  HEXAGRAMS,
  lineFromCoins,
  lineLabel,
  randomCoins,
  transformChangingLines,
} from "./iching.js";

const LINE_NAMES = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
const PROGRESS_LABELS = ["上爻", "五爻", "四爻", "三爻", "二爻", "初爻"];
const EMPTY_LINES = [null, null, null, null, null, null];
const RESET_COOLDOWN_SECONDS = 10;
const HEXAGRAM_LIBRARY = Object.entries(HEXAGRAMS).map(([index, hexagram]) => ({
  index: Number(index),
  image: `/assets/hexagrams/hexagram-${String(index).padStart(2, "0")}.webp`,
  name: hexagram.name,
  judgment: hexagram.judgment,
  meanings: hexagram.meanings,
  searchText: `${index} ${hexagram.name} ${hexagram.judgment} ${hexagram.meanings.join(" ")}`,
}));

export function App() {
  const [lines, setLines] = useState([]);
  const [lastCoins, setLastCoins] = useState([3, 2, 3]);
  const [activeTab, setActiveTab] = useState("base");
  const [copied, setCopied] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [methodVisible, setMethodVisible] = useState(false);
  const [hexagramQuery, setHexagramQuery] = useState("");
  const [selectedHexagramIndex, setSelectedHexagramIndex] = useState(1);
  const [resetCooldownSeconds, setResetCooldownSeconds] = useState(0);
  const [heroReady, setHeroReady] = useState(false);
  const [lineFlashIndex, setLineFlashIndex] = useState(-1);
  const previousLineCountRef = useRef(lines.length);

  const isComplete = lines.length === 6;
  const original = useMemo(() => (isComplete ? deriveHexagram(lines) : null), [isComplete, lines]);
  const transformedLines = useMemo(
    () => (isComplete ? transformChangingLines(lines) : []),
    [isComplete, lines],
  );
  const transformed = useMemo(
    () => (isComplete ? deriveHexagram(transformedLines) : null),
    [isComplete, transformedLines],
  );
  const movingLines = useMemo(
    () => (isComplete ? changingLineNames(lines) : []),
    [isComplete, lines],
  );
  const visibleLines = isComplete ? lines : [...lines, ...EMPTY_LINES].slice(0, 6);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHeroReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    function updateScrollProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      root.style.setProperty("--scroll-progress", String(progress));
    }

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, []);

  useEffect(() => {
    const section = document.getElementById("method");
    if (!section || !("IntersectionObserver" in window)) {
      setMethodVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMethodVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (lines.length > previousLineCountRef.current) {
      setLineFlashIndex(lines.length - 1);
    }
    if (lines.length === 6 && previousLineCountRef.current < 6) {
      setResetCooldownSeconds(RESET_COOLDOWN_SECONDS);
    }
    if (lines.length === 0) {
      setResetCooldownSeconds(0);
      setLineFlashIndex(-1);
    }
    previousLineCountRef.current = lines.length;
  }, [lines.length]);

  useEffect(() => {
    if (lineFlashIndex < 0) return undefined;

    const timer = window.setTimeout(() => setLineFlashIndex(-1), 900);
    return () => window.clearTimeout(timer);
  }, [lineFlashIndex]);

  useEffect(() => {
    if (resetCooldownSeconds <= 0) return undefined;

    const timer = window.setTimeout(() => {
      setResetCooldownSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resetCooldownSeconds]);

  const filteredHexagrams = useMemo(() => {
    const query = hexagramQuery.trim().toLowerCase();
    if (!query) return HEXAGRAM_LIBRARY;

    return HEXAGRAM_LIBRARY.filter((hexagram) => hexagram.searchText.toLowerCase().includes(query));
  }, [hexagramQuery]);
  const selectedHexagram = useMemo(() => {
    const selected = HEXAGRAM_LIBRARY.find((hexagram) => hexagram.index === selectedHexagramIndex);
    return filteredHexagrams.find((hexagram) => hexagram.index === selectedHexagramIndex) ?? filteredHexagrams[0] ?? selected;
  }, [filteredHexagrams, selectedHexagramIndex]);
  const hexagramNavigation = filteredHexagrams.length > 0 ? filteredHexagrams : HEXAGRAM_LIBRARY;
  const activeHexagramPosition = selectedHexagram
    ? hexagramNavigation.findIndex((hexagram) => hexagram.index === selectedHexagram.index)
    : -1;
  const previousHexagram = activeHexagramPosition >= 0
    ? hexagramNavigation[(activeHexagramPosition - 1 + hexagramNavigation.length) % hexagramNavigation.length]
    : null;
  const nextHexagram = activeHexagramPosition >= 0
    ? hexagramNavigation[(activeHexagramPosition + 1) % hexagramNavigation.length]
    : null;

  function castLine() {
    if (isCasting) return;

    if (isComplete) {
      if (resetCooldownSeconds > 0) return;

      setLines([]);
      setLastCoins([3, 2, 3]);
      setActiveTab("base");
      setCopied(false);
      return;
    }

    const coins = randomCoins();
    setLastCoins(coins);
    setCopied(false);
    setIsCasting(true);

    window.setTimeout(() => {
      setLines((current) => [...current, lineFromCoins(coins)]);
      setIsCasting(false);
    }, 900);
  }

  async function copyPrompt() {
    if (!isComplete) return;

    const prompt = buildAiPrompt(lines);
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className={heroReady ? "page-shell is-ready" : "page-shell"}>
      <div className="ambient-layer" aria-hidden="true">
        <span className="ink-wash ink-wash-a" />
        <span className="ink-wash ink-wash-b" />
        <span className="ink-wash ink-wash-c" />
      </div>
      <div className="scroll-progress" aria-hidden="true" />
      <header className="site-header" aria-label="主导航">
        <a className="brand" href="#top" aria-label="摇一摇首页" onClick={() => setMenuOpen(false)}>
          <img className="brand-seal-img" src="/assets/brand-seal.png" alt="" aria-hidden="true" />
          <span>摇一摇</span>
        </a>
        <nav className={menuOpen ? "desktop-nav is-open" : "desktop-nav"} id="site-nav" aria-label="页面导航">
          <a href="#method" onClick={() => setMenuOpen(false)}>玩法</a>
          <a href="#hexagrams" onClick={() => setMenuOpen(false)}>卦库</a>
          <a href="#result" onClick={() => setMenuOpen(false)}>卦象</a>
          <a href="#ai" onClick={() => setMenuOpen(false)}>AI 解卦</a>
        </nav>
        <button
          className={menuOpen ? "menu-button is-open" : "menu-button"}
          type="button"
          aria-controls="site-nav"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <section className="hero" id="top">
        <div className="intro-panel">
          <img className="side-seal-img" src="/assets/side-seal.png" alt="" aria-hidden="true" />
          <p className="vertical-note">周易占筮 · 六爻成卦</p>
          <h1>摇一摇</h1>
          <p className="hero-subtitle">默念一事，六爻成卦</p>
          <p className="hero-copy">
            三枚铜钱，六次成爻，得一卦象。观象察变，叩问心中所感。
          </p>
          <button
            className={`primary-action ${isComplete && resetCooldownSeconds > 0 ? "is-cooling" : ""}`}
            type="button"
            aria-disabled={isComplete && resetCooldownSeconds > 0}
            onClick={castLine}
            disabled={isCasting}
          >
            <span className="action-seal" aria-hidden="true">爻</span>
            {isCasting
              ? "铜钱翻转中"
              : isComplete && resetCooldownSeconds > 0
                ? `${resetCooldownSeconds}s 后可重起`
                : isComplete
                  ? "重新起卦"
                  : lines.length === 0
                    ? "开始起卦"
                    : "继续成爻"}
          </button>
          <p className="quiet-note">娱乐为主，切勿迷信</p>
        </div>

        <div
          className="casting-stage"
          aria-label="起卦区域"
        >
          <div
            className={[
              "ritual-dial",
              isCasting ? "is-casting" : "",
              isComplete ? "is-complete" : "",
            ].filter(Boolean).join(" ")}
            aria-hidden="true"
          >
            <span className="trigram trigram-top">☰</span>
            <span className="trigram trigram-top-right">☱</span>
            <span className="trigram trigram-right">☵</span>
            <span className="trigram trigram-bottom-right">☶</span>
            <span className="trigram trigram-bottom">☷</span>
            <span className="trigram trigram-bottom-left">☳</span>
            <span className="trigram trigram-left">☲</span>
            <span className="trigram trigram-top-left">☴</span>
            <span className="direction direction-north">乾</span>
            <span className="direction direction-east">坎</span>
            <span className="direction direction-south">坤</span>
            <span className="direction direction-west">离</span>
            <div className="coin-set">
              {lastCoins.map((coin, index) => (
                <span className={isCasting ? "coin is-spinning" : "coin"} key={`${coin}-${index}`}>
                  <picture>
                    <source srcSet="/assets/bronze-coin.webp" type="image/webp" />
                    <img
                      src="/assets/bronze-coin.png"
                      width="224"
                      height="224"
                      alt=""
                      aria-hidden="true"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </picture>
                  <span>{coin === 3 ? "乾" : "坤"}</span>
                  <small>{coin === 3 ? "三" : "二"}</small>
                </span>
              ))}
            </div>
          </div>

          <ol
            className="line-progress"
            aria-label="六爻进度"
            style={{ "--lines-progress": String(lines.length / 6) }}
          >
            {PROGRESS_LABELS.map((label, index) => {
              const lineIndex = 5 - index;
              const reached = lines.length > lineIndex;
              const current = lines.length === lineIndex;
              const justDone = lineFlashIndex === lineIndex;
              return (
                <li
                  className={[
                    reached ? "is-done" : "",
                    current ? "is-current" : "",
                    justDone ? "is-flash" : "",
                  ].filter(Boolean).join(" ")}
                  key={label}
                >
                  <span className="progress-dot" />
                  <span>
                    <strong>{label}</strong>
                    <small>第{lineIndex + 1}爻</small>
                  </span>
                </li>
              );
            })}
          </ol>

          <p className="keyboard-hint">
            已成 {lines.length} / 6 爻
          </p>
        </div>

        <ResultPanel
          activeTab={activeTab}
          copied={copied}
          isComplete={isComplete}
          lines={lines}
          movingLines={movingLines}
          onCopy={copyPrompt}
          original={original}
          setActiveTab={setActiveTab}
          transformed={transformed}
          transformedLines={transformedLines}
          visibleLines={visibleLines}
          lineFlashIndex={lineFlashIndex}
        />
      </section>

      <section className={`method-strip ${methodVisible ? "is-visible" : ""}`} id="method" aria-label="摇卦逻辑">
        <h2>三枚铜钱，六次成爻</h2>
        <div className="method-steps">
          {[
            ["1", "投掷铜钱", "每次同时抛出三枚铜钱。", "/assets/process-1.png"],
            ["2", "记录点数", "正面记 3，反面记 2，合计得 6/7/8/9。", "/assets/process-2.png"],
            ["3", "转换爻象", "6/8 为阴爻，7/9 为阳爻。", "/assets/process-3.png"],
            ["4", "六爻成卦", "自下而上累计六爻，映射 64 卦。", "/assets/process-4.png"],
            ["5", "动爻变卦", "老阴与老阳为动爻，翻转得之卦。", "/assets/process-5.png"],
            ["6", "叩问 AI", "复制完整卦象信息，再交由 AI 解读。", "/assets/process-6.png"],
          ].map(([number, title, body, image]) => (
            <article className="method-step" key={number}>
              <img className="step-art" src={image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              <div className="step-heading">
                <span>{number}</span>
                <h3>{title}</h3>
              </div>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hexagram-library" id="hexagrams" aria-label="六十四卦卦库">
        <div className="library-head">
          <div>
            <h2>六十四卦</h2>
            <p>按卦序、卦名、卦辞或关键词检索原页。</p>
          </div>
          <label className="library-search">
            <span>搜卦</span>
            <input
              type="search"
              value={hexagramQuery}
              placeholder="乾、泰、元亨、厚德..."
              onChange={(event) => setHexagramQuery(event.target.value)}
            />
          </label>
        </div>

        <div className="library-layout">
          <div className="hexagram-index" aria-label="卦序列表">
            <p className="index-count">{filteredHexagrams.length} / 64</p>
            <div className="index-list">
              {filteredHexagrams.map((hexagram) => (
                <button
                  className={selectedHexagram?.index === hexagram.index ? "is-active" : ""}
                  type="button"
                  key={hexagram.index}
                  onClick={() => setSelectedHexagramIndex(hexagram.index)}
                >
                  <span>{String(hexagram.index).padStart(2, "0")}</span>
                  <strong>{hexagram.name}</strong>
                  <small>{hexagram.meanings.join(" · ")}</small>
                </button>
              ))}
            </div>
          </div>

          {selectedHexagram ? (
            <article className="hexagram-reader" aria-live="polite" key={selectedHexagram.index}>
              <div className="reader-copy">
                <span>第 {selectedHexagram.index} 卦</span>
                <h3>{selectedHexagram.name}</h3>
                <p>{selectedHexagram.judgment}</p>
                <div className="reader-tags">
                  {selectedHexagram.meanings.map((meaning) => (
                    <em key={meaning}>{meaning}</em>
                  ))}
                </div>
              </div>
              <figure className="hexagram-page">
                <img
                  src={selectedHexagram.image}
                  width="900"
                  height="1320"
                  alt={`第 ${selectedHexagram.index} 卦 ${selectedHexagram.name} 卦象原页`}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="reader-actions">
                <button
                  type="button"
                  onClick={() => previousHexagram && setSelectedHexagramIndex(previousHexagram.index)}
                >
                  上一卦
                </button>
                <button
                  type="button"
                  onClick={() => nextHexagram && setSelectedHexagramIndex(nextHexagram.index)}
                >
                  下一卦
                </button>
              </div>
            </article>
          ) : (
            <div className="library-empty">
              <p>未找到对应卦象。</p>
            </div>
          )}
        </div>
      </section>

      <footer className="site-footer" aria-label="版权信息">
        <p>© 2026 摇一摇. All rights reserved.</p>
      </footer>
    </main>
  );
}

function ResultPanel({
  activeTab,
  copied,
  isComplete,
  lines,
  movingLines,
  onCopy,
  original,
  setActiveTab,
  transformed,
  transformedLines,
  visibleLines,
  lineFlashIndex,
}) {
  const displayHexagram = activeTab === "transformed" ? transformed : original;
  const displayLines = activeTab === "transformed" ? transformedLines : visibleLines;

  return (
    <aside className={`result-panel ${isComplete ? "is-revealed" : ""}`} id="result" aria-label="卦象结果">
      <div className="tabs" role="tablist" aria-label="卦象视图">
        <button
          className={activeTab === "base" ? "is-active" : ""}
          type="button"
          role="tab"
          aria-selected={activeTab === "base"}
          onClick={() => setActiveTab("base")}
        >
          本卦
        </button>
        <button
          className={activeTab === "moving" ? "is-active" : ""}
          type="button"
          role="tab"
          aria-selected={activeTab === "moving"}
          onClick={() => setActiveTab("moving")}
        >
          动爻
        </button>
        <button
          className={activeTab === "transformed" ? "is-active" : ""}
          type="button"
          role="tab"
          aria-selected={activeTab === "transformed"}
          onClick={() => setActiveTab("transformed")}
        >
          之卦
        </button>
      </div>

      {activeTab === "moving" ? (
        <MovingLines key={activeTab} lines={lines} isComplete={isComplete} movingLines={movingLines} />
      ) : (
        <div className="hexagram-view" key={activeTab}>
          <HexagramLines lines={displayLines} flashIndex={lineFlashIndex} />
          <div className="hexagram-copy">
            <h2>{isComplete ? `${displayHexagram.name} · ${displayHexagram.fullName}` : "卦象待成"}</h2>
            <p>
              {isComplete
                ? `第 ${displayHexagram.index} 卦。${displayHexagram.judgment}`
                : "卦象生成后，将在此显示卦名、卦辞等信息。"}
            </p>
            {isComplete ? (
              <div className="meaning-list">
                {displayHexagram.meanings.map((meaning) => (
                  <span key={meaning}>{meaning}</span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="result-actions" id="ai">
        <button className="ask-ai" type="button" disabled={!isComplete} onClick={onCopy}>
          叩问 AI
        </button>
        <button className="copy-button" type="button" disabled={!isComplete} onClick={onCopy}>
          {copied ? "已复制" : "复制解卦信息"}
        </button>
      </div>
      <p className="result-footnote">娱乐为主，切勿迷信</p>
    </aside>
  );
}

function MovingLines({ isComplete, lines, movingLines }) {
  if (!isComplete) {
    return (
      <div className="moving-state">
        <h2>动爻待定</h2>
        <p>完成六次成爻后，将标出老阴、老阳所在爻位。</p>
      </div>
    );
  }

  return (
    <div className="moving-state">
      <h2>{movingLines.length > 0 ? movingLines.join("、") : "无动爻"}</h2>
      <div className="line-table">
        {lines.map((line, index) => (
          <div className={line === 6 || line === 9 ? "is-moving" : ""} key={`${line}-${index}`}>
            <span>{LINE_NAMES[index]}</span>
            <strong>{lineLabel(line)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function HexagramLines({ lines, flashIndex = -1 }) {
  return (
    <div className="hexagram-lines" aria-label="卦象六爻">
      {[...lines].reverse().map((line, index) => {
        const sourceIndex = 5 - index;
        const isYang = line === 7 || line === 9;
        const isChanging = line === 6 || line === 9;
        const isNew = flashIndex === sourceIndex && line != null;
        return (
          <span
            className={[
              "hex-line",
              line == null ? "is-empty" : isYang ? "is-yang" : "is-yin",
              isChanging ? "is-changing" : "",
              isNew ? "is-new" : "",
            ].join(" ")}
            key={`${line ?? "empty"}-${index}`}
          />
        );
      })}
    </div>
  );
}
