import { useState } from 'react';
import './index.css'; // Make sure you have the new CSS rules for tabs in this file
import { PieChart } from 'react-minimal-pie-chart';

// ===================================================================================
// STYLES
// ===================================================================================
const styles = {
    container: { width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', padding: '20px' },
    header: { fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)', textShadow: '0 0 15px var(--accent-color-translucent)', marginBottom: '20px', textAlign: 'center' },
    inputPanel: { width: '100%', maxWidth: '600px', backgroundColor: 'var(--panel-background)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '25px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' },
    form: { display: 'flex', gap: '15px' },
    input: { flexGrow: 1, backgroundColor: '#0D1117', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', padding: '14px', fontSize: '1rem' },
    button: { backgroundColor: 'var(--accent-color)', color: '#0D1117', border: 'none', padding: '14px 25px', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' },
    loader: { width: '48px', height: '48px', border: '3px solid var(--text-secondary)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'rotation 1s linear infinite', margin: '30px auto' },
    resultsContainer: { width: '100%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' },
    card: { backgroundColor: 'var(--panel-background)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', cursor: 'pointer' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px' },
    tickerSymbol: { fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)' },
    growthScore: { fontSize: '1.75rem', fontWeight: '700', color: 'var(--accent-color)' },
    scoreRow: { display: 'grid', gridTemplateColumns: '100px 1fr 50px', alignItems: 'center', gap: '10px', fontSize: '0.9rem', marginBottom: '8px' },
    scoreLabel: { color: 'var(--text-secondary)' },
    scoreBarContainer: { width: '100%', height: '8px', backgroundColor: '#0D1117', borderRadius: '4px', overflow: 'hidden' },
    scoreBarFill: { height: '100%', background: 'linear-gradient(90deg, #1A887A, var(--accent-color))', borderRadius: '4px' },
    scoreValue: { fontWeight: '600', textAlign: 'right', color: 'var(--text-primary)' },
    errorMessage: { color: '#FEB2B2', backgroundColor: 'rgba(229, 62, 62, 0.1)', border: '1px solid var(--danger-color)', borderRadius: '8px', padding: '15px', marginTop: '20px', width: '100%', maxWidth: '600px' },
    backButton: { alignSelf: 'flex-start', background: 'var(--panel-background)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px', fontWeight: '600' },
    detailPanel: { backgroundColor: 'var(--panel-background)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '12px' },
    detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #0D1117' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px' },
    panelTitle: { color: 'var(--text-primary)', margin: 0, fontSize: '1.25rem', fontWeight: '600' },
    panelScore: { fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-color)' },
    balanceSheetContainer: { display: 'flex', alignItems: 'center', gap: '30px', padding: '15px 0' },
    pieChartContainer: { position: 'relative', width: '150px', height: '150px' },
    pieChartLabel: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'var(--text-primary)', lineHeight: '1.2' },
    sentimentArticleList: { listStyle: 'none', margin: '15px 0 0', padding: '15px 0 0', borderTop: '1px solid #0D1117' },
    sentimentArticle: { marginBottom: '15px', borderLeft: '3px solid var(--accent-color)', paddingLeft: '15px' },
    verdictBadge: { padding: '4px 12px', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', marginLeft: '15px' },
    verdictContainer: { display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 0' },
    seasonalityIcon: { width: '32px', height: '32px' },
    seasonalityVerdictText: { fontSize: '1.5rem', fontWeight: '700' },
    seasonalityReason: { color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px' },
    verdictBadgeIcon: { width: '14px', height: '14px', marginRight: '6px' },
};

const keyframes = `@keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
const styleSheet = document.createElement("style");
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);

const formatCurrency = (val, isBig = true) => { if (val == null) return 'N/A'; if (isBig) { if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`; if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`; } return `$${val.toFixed(2)}`; };
const formatNum = (val, dec = 2) => val != null ? val.toFixed(dec) : 'N/A';
const formatBigNum = (val) => val != null ? Math.round(val).toLocaleString() : 'N/A';
const formatPercent = (val, dec = 1) => val != null ? `${(val * 100).toFixed(dec)}%` : 'N/A';
const formatSimpleCurrency = (val) => val != null ? `$${val.toFixed(2)}` : 'N/A';
const getVerdictStyle = (verdict = '') => { const lowerVerdict = verdict.toLowerCase(); if (lowerVerdict.includes('bullish')) return { color: '#0D1117', backgroundColor: 'var(--success-color)' }; if (lowerVerdict.includes('bearish')) return { color: '#0D1117', backgroundColor: 'var(--danger-color)' }; return { color: 'var(--text-primary)', backgroundColor: 'var(--border-color)' }; };

const SeasonalityPanel = ({ stock }) => { const details = stock?.['Seasonality Details'] ?? {}; const verdict = details.verdict || 'Neutral'; const reason = details.reason || 'No data available.'; const verdictColor = getVerdictStyle(verdict).backgroundColor; return ( <div style={styles.detailPanel}><div style={styles.panelHeader}><h3 style={styles.panelTitle}>Monthly Seasonality Outlook</h3></div><div style={styles.verdictContainer}><svg style={{...styles.seasonalityIcon, color: verdictColor}} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM8 7.993c0-.552.224-1.053.6-1.432.376-.38.88-.561 1.4-.561.52 0 1.024.181 1.4.561.376.379.6.88.6 1.432 0 .552-.224 1.053-.6 1.432-.376.38-.88.561-1.4.561-.52 0-1.024-.181-1.4-.561A1.969 1.969 0 0 1 8 7.993z"/></svg><span style={{...styles.seasonalityVerdictText, color: verdictColor}}>{verdict}</span></div><p style={styles.seasonalityReason}>{reason}</p><div style={{...styles.detailRow, borderTop: '1px solid #0D1117', paddingTop: '12px'}}><span style={styles.scoreLabel}>Historical Win Rate (This Month)</span><span style={{fontWeight: '600'}}>{formatPercent(details.win_rate, 0) ?? 'N/A'}</span></div><div style={styles.detailRow}><span style={styles.scoreLabel}>Avg. Monthly Return (This Month)</span><span style={{fontWeight: '600'}}>{formatPercent(details.avg_monthly_return) ?? 'N/A'}</span></div><div style={styles.detailRow}><span style={styles.scoreLabel}>Years of Data Analyzed</span><span style={{fontWeight: '600'}}>{details.years_analyzed ?? 'N/A'}</span></div></div> );};
const MacroPanel = ({ stock }) => { const details = stock?.['Macro Details'] ?? {}; const score = stock?.['Macro Score'] ?? 0; return ( <div style={styles.detailPanel}><div style={styles.panelHeader}><h3 style={styles.panelTitle}>Macro Environment Fit</h3><span style={{...styles.panelScore, color: `hsl(${score*120}, 100%, 50%)`}}>{formatPercent(score)}</span></div><div style={styles.detailRow}><span style={styles.scoreLabel}>Global Outlook Setting</span><span>{details.global_economic_outlook_setting}</span></div><div style={styles.detailRow}><span style={styles.scoreLabel}>{details.sector} Sector Classification</span><span style={{fontWeight: 600}}>{details.sector_classification}</span></div></div> );};
const BalanceSheetPanel = ({ stock }) => { const details = stock?.['Financials Details'] ?? {}; const totalAssets = details.totalAssets || 0; const totalDebt = details.totalDebt || 0; const equity = details.stockholderEquity || 0; const debtPct = (totalAssets > 0 ? (totalDebt / totalAssets) * 100 : 0); const equityPct = (totalAssets > 0 ? (equity / totalAssets) * 100 : 100); const chartData = [ { title: 'Equity', value: equityPct, color: 'var(--accent-color)' }, { title: 'Debt', value: debtPct, color: 'var(--danger-color)' } ]; return ( <div style={styles.detailPanel}><div style={styles.panelHeader}><h3 style={styles.panelTitle}>Balance Sheet</h3></div><div style={styles.balanceSheetContainer}><div style={styles.pieChartContainer}><PieChart data={chartData} lineWidth={20} startAngle={-90} paddingAngle={2} background="#0D1117" /><div style={styles.pieChartLabel}><div style={{fontSize:'1.5rem', fontWeight:'bold'}}>{formatPercent(equityPct, 0)}</div><div style={{fontSize:'0.8rem'}}>Equity</div></div></div><div style={styles.balanceSheetDetails}><div style={styles.detailRow}><span>Total Assets</span><strong>{formatCurrency(totalAssets)}</strong></div><div style={styles.detailRow}><span>Total Debt</span><strong>{formatCurrency(totalDebt)}</strong></div><div style={styles.detailRow}><span>Stockholder Equity</span><strong>{formatCurrency(equity)}</strong></div></div></div></div> );};
const FundamentalsPanel = ({ stock }) => { const score = stock?.['Financials Score'] ?? 0; const details = stock?.['Financials Details'] ?? {}; return ( <div style={styles.detailPanel}><div style={styles.panelHeader}><h3 style={styles.panelTitle}>Fundamentals</h3><span style={{...styles.panelScore, color: `hsl(${score*120}, 100%, 50%)`}}>{formatPercent(score)}</span></div><div style={styles.detailRow}><span>YoY Revenue Growth</span><strong>{formatPercent(details.revenue_growth_yoy)}</strong></div><div style={styles.detailRow}><span>YoY Income Growth</span><strong>{formatPercent(details.net_income_growth_yoy)}</strong></div><div style={styles.detailRow}><span>Trailing P/E Ratio</span><strong>{formatNum(details.pe_ratio)}</strong></div><div style={styles.detailRow}><span>Price-to-Book (P/B)</span><strong>{formatNum(details.priceToBook)}</strong></div><div style={styles.detailRow}><span>Debt-to-Equity</span><strong>{formatNum(details.de_ratio)}</strong></div></div> );};
const TechnicalsPanel = ({ stock }) => { const score = stock?.['Technicals Score'] ?? 0; const details = stock?.['Technicals Details'] ?? {}; const macdIsBullish = details.macd_line > details.signal_line; return ( <div style={styles.detailPanel}><div style={styles.panelHeader}><h3 style={styles.panelTitle}>Technicals</h3><span style={{...styles.panelScore, color: `hsl(${score*120}, 100%, 50%)`}}>{formatPercent(score)}</span></div><div style={styles.detailRow}><span>50-Day Moving Avg.</span><strong>{formatSimpleCurrency(details.ma50)}</strong></div><div style={styles.detailRow}><span>200-Day Moving Avg.</span><strong>{formatSimpleCurrency(details.ma200)}</strong></div><div style={styles.detailRow}><span>RSI (14-Day)</span><strong>{formatNum(details.rsi, 1)}</strong></div><div style={styles.detailRow}><span>MACD vs. Signal</span><strong style={macdIsBullish ? {color:'var(--success-color)'} : {color:'var(--danger-color)'}}>{macdIsBllish ? 'Bullish' : 'Bearish'}</strong></div></div> );};
const SentimentPanel = ({ stock }) => { const sentimentScore = (((stock?.['Sentiment LLM Score'] || 0) + (stock?.['Sentiment Analyst Score'] || 0) + (stock?.['Sentiment Social Score'] || 0)) / 3); const details = stock?.['Sentiment Details'] ?? {}; const articles = details.analyzed_articles || []; return ( <div style={styles.detailPanel}><div style={styles.panelHeader}><h3 style={styles.panelTitle}>Sentiment</h3><span style={{...styles.panelScore, color: `hsl(${sentimentScore*120}, 100%, 50%)`}}>{formatPercent(sentimentScore)}</span></div><div style={styles.detailRow}><span>Latest Analyst Rating</span><strong style={{color:'var(--accent-color)'}}>{details.analyst_rating_text}</strong></div><div style={styles.detailRow}><span>News API Status</span><span>{details.news_status}</span></div>{articles.length > 0 && (<ul style={styles.sentimentArticleList}>{articles.map((article, i) => (<li key={i} style={{...styles.sentimentArticle, borderLeftColor: `hsl(${article.score*120}, 100%, 50%)`}}><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a><p style={{fontSize:'0.8rem', color:'var(--text-secondary)', margin:'5px 0 0'}}>{article.justification}</p></li>))}</ul>)}</div> );};
const PerformanceAndStatsPanel = ({ stock }) => { const techDetails = stock?.['Technicals Details'] ?? {}; const finDetails = stock?.['Financials Details'] ?? {}; const formatPerf = (value) => { if (value == null) return <span style={{color: 'var(--text-secondary)'}}>N/A</span>; const percent = value * 100; const color = percent >= 0 ? 'var(--success-color)' : 'var(--danger-color)'; return <span style={{ color, fontWeight: '600' }}>{percent.toFixed(1)}%</span>; }; return ( <div style={styles.detailPanel}> <div style={styles.panelHeader}><h3 style={styles.panelTitle}>Performance & Stats</h3></div> <div style={styles.detailRow}><span>Market Cap</span><strong>{formatCurrency(finDetails.marketCap)}</strong></div> <div style={styles.detailRow}><span>30-Day Avg. Volume</span><strong>{formatBigNum(techDetails.avg_volume_30d)}</strong></div> <div style={{height:'20px'}}></div> <div style={styles.panelHeader}><h3 style={{...styles.panelTitle, fontSize:'1.1rem'}}>Trailing Performance</h3></div> <div style={styles.detailRow}><span>1-Week</span><strong>{formatPerf(techDetails.performance_1w)}</strong></div> <div style={styles.detailRow}><span>1-Month</span><strong>{formatPerf(techDetails.performance_1m)}</strong></div> <div style={styles.detailRow}><span>3-Month</span><strong>{formatPerf(techDetails.performance_3m)}</strong></div> <div style={styles.detailRow}><span>YTD</span><strong>{formatPerf(techDetails.performance_ytd)}</strong></div> <div style={styles.detailRow}><span>1-Year</span><strong>{formatPerf(techDetails.performance_1y)}</strong></div> <div style={styles.detailRow}><span>1-Yr vs S&P 500</span><strong>{formatPerf(techDetails.performance_vs_sp500_1y)}</strong></div> </div> );};

const DetailedView = ({ stock, onBack }) => {
    const [activeTab, setActiveTab] = useState('breakdown');
    console.log("Data for DetailedView:", stock); // This will prove the data is correct
    return (
        <div style={styles.container}>
            <button onClick={onBack} style={styles.backButton}>← Back to Results</button>
            <div style={{...styles.cardHeader, width: '100%'}}>
                <h1 style={styles.tickerSymbol}>{stock.Ticker} Analysis</h1>
                <div style={{display: 'flex', alignItems: 'baseline'}}>
                    <span style={styles.growthScore}>Growth Score: {formatPercent(stock['Growth Score'])}</span>
                    <span style={{...styles.verdictBadge, ...getVerdictStyle(stock['Final Verdict'])}}>{stock['Final Verdict']}</span>
                </div>
            </div>
            <div className="tab-container">
                <button onClick={() => setActiveTab('breakdown')} className={activeTab === 'breakdown' ? 'tab-button-active' : 'tab-button'}>Full Breakdown</button>
                <button onClick={() => setActiveTab('performance')} className={activeTab === 'performance' ? 'tab-button-active' : 'tab-button'}>Performance & Outlook</button>
            </div>
            {activeTab === 'breakdown' && (
                <div className="detailed-grid">
                    <div className="left-column"><MacroPanel stock={stock} /><BalanceSheetPanel stock={stock} /><FundamentalsPanel stock={stock} /></div>
                    <div className="right-column"><TechnicalsPanel stock={stock} /><SentimentPanel stock={stock} /></div>
                </div>
            )}
            {activeTab === 'performance' && (
                <div className="performance-outlook-grid">
                    <PerformanceAndStatsPanel stock={stock} />
                    <SeasonalityPanel stock={stock} />
                </div>
            )}
        </div>
    );
};

const ResultCard = ({ data, onSelect }) => { const sentimentScore = ((data['Sentiment LLM Score'] || 0) + (data['Sentiment Analyst Score'] || 0) + (data['Sentiment Social Score'] || 0)) / 3; const scores = [ { label: 'Financials', value: data['Financials Score'] || 0 }, { label: 'Technicals', value: data['Technicals Score'] || 0 }, { label: 'Sentiment', value: sentimentScore }, { label: 'Macro', value: data['Macro Score'] || 0 } ]; const finalVerdict = data['Final Verdict'] || 'Neutral'; const seasonalityVerdict = data['Seasonality Details']?.verdict || 'Neutral'; return ( <div style={styles.card} onClick={() => onSelect(data)}><div style={styles.cardHeader}><span style={styles.tickerSymbol}>{data.Ticker}</span><span style={styles.growthScore}>{formatPercent(data['Growth Score'])}</span></div><div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}><span style={{...styles.verdictBadge, ...getVerdictStyle(finalVerdict), fontSize: '0.9rem', display: 'flex', alignItems: 'center', marginLeft: 0 }}><svg style={styles.verdictBadgeIcon} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM9.283 4.002a.5.5 0 0 0-1.03-.284l-2.5 7.5a.5.5 0 0 0 .936.314L6.9 10.5h2.2l.283 1.03a.5.5 0 1 0 .936-.314l-2.5-7.5zM7.22 9.5 8 6.882 8.78 9.5H7.22z"/></svg>{finalVerdict}</span><span style={{...styles.verdictBadge, ...getVerdictStyle(seasonalityVerdict), fontSize: '0.9rem', display: 'flex', alignItems: 'center', marginLeft: 0 }}><svg style={styles.verdictBadgeIcon} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM8 7.993c0-.552.224-1.053.6-1.432.376-.38.88-.561 1.4-.561.52 0 1.024.181 1.4.561.376.379.6.88.6 1.432 0 .552-.224 1.053-.6 1.432-.376.38-.88.561-1.4.561-.52 0-1.024-.181-1.4-.561A1.969 1.969 0 0 1 8 7.993z"/></svg>Seasonality: {seasonalityVerdict}</span></div>{scores.map(s => ( <div key={s.label} style={styles.scoreRow}><span style={styles.scoreLabel}>{s.label}</span><div style={styles.scoreBarContainer}><div style={{...styles.scoreBarFill, width: `${s.value * 100}%`, background: `linear-gradient(90deg, hsl(${s.value * 120}, 80%, 30%), hsl(${s.value * 120}, 100%, 50%))` }}></div></div><span style={styles.scoreValue}>{formatPercent(s.value)}</span></div> ))}</div> );};
const MainView = ({ onAnalyze, onTickersChange, tickers, loading, error, results, onSelectStock }) => ( <> <h1 style={styles.header}>Does this make any change at all?</h1> <div style={styles.inputPanel}><form onSubmit={onAnalyze} style={styles.form}><input type="text" value={tickers} onChange={onTickersChange} placeholder="e.g., NVDA, MSFT, AAPL" style={styles.input} /><button type="submit" style={styles.button} disabled={loading}>Analyze</button></form></div> {loading && <div style={styles.loader}></div>} {error && <div style={styles.errorMessage}>{error}</div>} {results.length > 0 && <div style={styles.resultsContainer}>{results.map(result => (<ResultCard key={result.Ticker} data={result} onSelect={onSelectStock} />))}</div>} </> );

function App() {
  const [tickers, setTickers] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const API_URL = 'https://YOUR_NGROK_URL_HERE/analyze';

  const handleAnalyze = async (e) => { e.preventDefault(); const tickerList = tickers.split(',').map(t => t.trim().toUpperCase()).filter(Boolean); if (!tickerList.length) return; setLoading(true); setError(''); setResults([]); try { const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tickers: tickerList }) }); if (!response.ok) throw new Error(`Network error: ${response.statusText}`); const data = await response.json(); if (data.error) throw new Error(`Backend error: ${data.error}`); setResults(data.results); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  
  return ( <div style={styles.container}> {selectedStock ? <DetailedView stock={selectedStock} onBack={() => setSelectedStock(null)} /> : <MainView onAnalyze={handleAnalyze} onTickersChange={(e) => setTickers(e.target.value)} tickers={tickers} loading={loading} error={error} results={results} onSelectStock={setSelectedStock} /> } </div> );
}

export default App;
