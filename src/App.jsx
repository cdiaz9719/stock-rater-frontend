// In src/App.jsx, replace the whole DetailedView component with this one:

const DetailedView = ({ stock, onBack }) => {
  const [activeMobilePanel, setActiveMobilePanel] = useState(null);

  const panelCategories = [
    { id: 'technicals', title: 'Technicals', color: '#8b5cf6', score: Math.round((stock['Technicals Score'] || 0) * 100), Component: TechnicalsPanel, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h16.5M3.75 3v5.25M19.5 3v5.25M9 13.5l3 3m0 0l3-3m-3 3v-6" /></svg> },
    { id: 'fundamentals', title: 'Fundamentals', color: '#ec4899', score: Math.round((stock['Financials Score'] || 0) * 100), Component: FundamentalsPanel, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: 'macro', title: 'Macro', color: '#10b981', score: Math.round((stock['Macro Score'] || 0) * 100), Component: MacroPanel, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0012 13.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 003 12c0 .778.099 1.533.284 2.253m18.132-4.5A11.966 11.966 0 0112 15c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12" /></svg> },
    { id: 'balance_sheet', title: 'Balance Sheet', color: '#0ea5e9', Component: BalanceSheetPanel, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 3l-2.024.908a.75.75 0 00-.435.158l-6.25 4.5a.75.75 0 00-.191 1.053l2.25 3.75a.75.75 0 001.053.191l3.75-2.25M12 3l2.024.908a.75.75 0 01.435.158l6.25 4.5a.75.75 0 01.191 1.053l-2.25 3.75a.75.75 0 01-1.053.191l-3.75-2.25m-2.25 9.191l-3.75 2.25a.75.75 0 01-1.053-.191L3.28 16.5a.75.75 0 01.191-1.053l6.25-4.5a.75.75 0 01.435-.158L12 10.5m0 3.691l2.25-1.35m-2.25 1.35l-3.75-2.25M12 10.5l3.75 2.25m-3.75-2.25l2.25 1.35m0 0l-3.75 2.25m3.75-2.25l3.75-2.25m-6 4.5l-3.75 2.25m3.75-2.25l3.75 2.25" /></svg> },
    { id: 'sentiment', title: 'Sentiment', color: '#f59e0b', score: Math.round((stock['Sentiment LLM Score'] || 0) * 100), Component: SentimentPanel, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 013-3h.008c1.657 0 3.002 1.343 3.002 3L15 12.75a3 3 0 01-3 3h-.008z" /></svg> },
    { id: 'seasonality', title: 'Seasonality', color: '#14b8a6', Component: SeasonalityPanel, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg> },
    { id: 'performance', title: 'Performance', color: '#6366f1', Component: PerformanceAndStatsPanel, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg> },
  ];
  const ActiveComponent = panelCategories.find(p => p.id === activeMobilePanel)?.Component;

  // MINOR CHANGE: The main container style is now simplified to let CSS handle everything.
  return (
    <div style={{...styles.container, padding: 0, width: '100%'}}>
      <div className="detailed-view-header">
        <button onClick={onBack} style={{...styles.backButton, marginBottom: '20px', width: 'auto', alignSelf:'center' }}>← Back to All Results</button>
        <h1 style={{...styles.tickerSymbol, fontSize: '2rem', textAlign: 'center'}}>{stock.Ticker} Full Breakdown</h1>
        <div className="header-badges">
          <span style={styles.growthScore}>Growth Score: {formatPercent(stock['Growth Score'], 2)}</span>
          {stock['Momentum Details']?.bonus > 0 && <span style={styles.momentumBadge} title={stock['Momentum Details']?.reason}>Momentum Bonus</span>}
          <span style={{...styles.verdictBadge, ...getVerdictStyle(stock['Final Verdict'])}}>{stock['Final Verdict']}</span>
        </div>
      </div>
      <div className="desktop-only">
        <div className="detailed-grid">
          <div className="left-column"> <MacroPanel stock={stock} /> <BalanceSheetPanel stock={stock} /> <FundamentalsPanel stock={stock} /> <SentimentPanel stock={stock} /> </div>
          <div className="right-column"> <PriceTrendPanel stock={stock} /> <TechnicalsPanel stock={stock} /> <PerformanceAndStatsPanel stock={stock} /> <SeasonalityPanel stock={stock} /> </div>
        </div>
      </div>
      <div className="mobile-only">
        {!activeMobilePanel ? (
          <div className="category-grid">
            {panelCategories.filter(p => p.id !== 'performance').map(panel => (
              <button key={panel.id} className="category-button" style={{ '--category-color': panel.color }} onClick={() => setActiveMobilePanel(panel.id)}>
                <div className="category-button-header">
                    <span className="category-button-icon">{panel.icon}</span>
                    <span className="category-button-title">{panel.title}</span>
                </div>
                {panel.score != null && <span className="category-button-score">{panel.score}</span>}
              </button>
            ))}
            <button className="category-button-full" style={{ '--category-color': '#6366f1' }} onClick={() => setActiveMobilePanel('performance')}>
              <div className="category-button-header">
                <span className="category-button-icon">{panelCategories.find(p => p.id === 'performance').icon}</span>
                <span className="category-button-title">Performance & Stats</span>
              </div>
            </button>
          </div>
        ) : (
          <div className="mobile-panel-view">
            <button onClick={() => setActiveMobilePanel(null)} className="mobile-back-button"> ← Back to Overview </button>
            <ActiveComponent stock={stock} />
          </div>
        )}
      </div>
    </div>
  );
};
