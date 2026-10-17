import { profile } from '../../config/site.ts';
import { LocalClock } from './components/local-clock/index.tsx';

type HomePageProps = { showShortcuts: boolean; onToggleShortcuts: () => void };
export const HomePage = ({ showShortcuts, onToggleShortcuts }: HomePageProps) => (
  <>
    <main id="main" className="home-main">
      <h1 className="home-intro" tabIndex={-1}>
        {profile.introLineList.map((line, index) => (
          <span className="intro-line" key={index}>
            <span className="intro-text">{line}</span>
          </span>
        ))}
      </h1>
    </main>
    <footer className="home-footer flex flex-wrap items-end justify-between">
      <div>
        <div className="small-label">(Local time)</div>
        <div className="location-clock flex items-center">
          <span>UTC+08:00</span>
          <span className="clock-rule" aria-hidden="true"></span>
          <LocalClock />
        </div>
      </div>
      <div>
        <div className="small-label">(Keyboard navigation)</div>
        <div className="keyboard-description">
          Press{' '}
          <button
            type="button"
            className="keyboard-toggle"
            data-action="shortcuts"
            aria-label="显示键盘快捷键"
            aria-pressed={showShortcuts}
            onClick={onToggleShortcuts}
          >
            <kbd>C</kbd>
          </button>{' '}
          for keyboard shortcuts
        </div>
      </div>
    </footer>
  </>
);
