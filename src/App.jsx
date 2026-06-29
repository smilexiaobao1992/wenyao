import { useMemo, useState } from "react";
import {
  buildAiPrompt,
  changingLineNames,
  deriveHexagram,
  lineFromCoins,
  lineLabel,
  randomCoins,
  transformChangingLines,
} from "./iching.js";

const LINE_NAMES = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
const PROGRESS_LABELS = ["上爻", "五爻", "四爻", "三爻", "二爻", "初爻"];
const EMPTY_LINES = [null, null, null, null, null, null];

export function App() {
  const [lines, setLines] = useState([]);
  const [lastCoins, setLastCoins] = useState([3, 2, 3]);
  const [activeTab, setActiveTab] = useState("base");
  const [copied, setCopied] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  function castLine() {
    if (isCasting) return;

    if (isComplete) {
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
    <main className="page-shell">
      <header className="site-header" aria-label="主导航">
        <a className="brand" href="#top" aria-label="摇一摇首页" onClick={() => setMenuOpen(false)}>
          <img className="brand-seal-img" src="/assets/brand-seal.png" alt="" aria-hidden="true" />
          <span>摇一摇</span>
        </a>
        <nav className={menuOpen ? "desktop-nav is-open" : "desktop-nav"} id="site-nav" aria-label="页面导航">
          <a href="#method" onClick={() => setMenuOpen(false)}>玩法</a>
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
          <button className="primary-action" type="button" onClick={castLine} disabled={isCasting}>
            <span className="action-seal" aria-hidden="true">爻</span>
            {isCasting ? "铜钱翻转中" : isComplete ? "重新起卦" : lines.length === 0 ? "开始起卦" : "继续成爻"}
          </button>
          <p className="quiet-note">娱乐为主，切勿迷信</p>
        </div>

        <div className="casting-stage" aria-label="起卦区域">
          <div className="ritual-dial" aria-hidden="true">
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

          <ol className="line-progress" aria-label="六爻进度">
            {PROGRESS_LABELS.map((label, index) => {
              const lineIndex = 5 - index;
              const reached = lines.length > lineIndex;
              const current = lines.length === lineIndex;
              return (
                <li className={reached ? "is-done" : current ? "is-current" : ""} key={label}>
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
        />
      </section>

      <section className="method-strip" id="method" aria-label="摇卦逻辑">
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
        <MovingLines lines={lines} isComplete={isComplete} movingLines={movingLines} />
      ) : (
        <div className="hexagram-view">
          <HexagramLines lines={displayLines} />
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

function HexagramLines({ lines }) {
  return (
    <div className="hexagram-lines" aria-label="卦象六爻">
      {[...lines].reverse().map((line, index) => {
        const isYang = line === 7 || line === 9;
        const isChanging = line === 6 || line === 9;
        return (
          <span
            className={[
              "hex-line",
              line == null ? "is-empty" : isYang ? "is-yang" : "is-yin",
              isChanging ? "is-changing" : "",
            ].join(" ")}
            key={`${line ?? "empty"}-${index}`}
          />
        );
      })}
    </div>
  );
}
