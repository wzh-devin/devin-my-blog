import { useState } from 'react';
import { Link } from 'react-router';
import { navigationList } from '../../../config/navigation.ts';
import { Brand } from '../../../components/brand/index.tsx';
import { Icon } from '../../../components/icon/index.tsx';
import { TextLink } from '../../../components/text-link/index.tsx';
import type { PageId } from '../../router/index.ts';
import { useSiteMenu } from './use-site-menu.ts';

export { useSiteMenu } from './use-site-menu.ts';

type SiteMenuProps = {
  page: PageId;
  menu: ReturnType<typeof useSiteMenu>;
};
export const SiteMenu = ({
  page,
  menu: { dialogRef, handleCancel, handleAnimationEnd, closeMenu },
}: SiteMenuProps) => {
  const [copyrightYear] = useState(() => new Date().getFullYear());
  return (
    <dialog
      ref={dialogRef}
      id="site-menu"
      className="menu-overlay"
      aria-label="网站导航"
      onCancel={handleCancel}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="menu-layout">
        <div className="menu-header flex items-center justify-between">
          <Brand />
          <button
            className="utility-button"
            type="button"
            data-action="menu-close"
            aria-label="关闭菜单"
            onClick={closeMenu}
          >
            <Icon name="close" />
            <span>Close</span>
          </button>
        </div>
        <div className="menu-content">
          <div className="menu-grid">
            <nav aria-label="主要导航">
              {navigationList.map(({ number, label, href, route }) => (
                <Link
                  key={route}
                  className="menu-link"
                  to={href}
                  aria-current={
                    page === route || (route === 'writing' && ['archive', 'article'].includes(page))
                      ? 'page'
                      : undefined
                  }
                >
                  <span className="small-label">({number})</span>
                  <span className="menu-link-title">{label}</span>
                </Link>
              ))}
            </nav>
            <section className="menu-contact">
              <span className="small-label">(A little hello)</span>
              <h2>Keep in touch</h2>
              <p>这个小站记录关于开发、设计与日常的想法。你可以从一篇文字开始，慢慢认识这里。</p>
              <div className="contact-links flex flex-wrap">
                <TextLink to="/writing">Writing</TextLink>
                <TextLink to="/about">About</TextLink>
              </div>
            </section>
          </div>
        </div>
        <footer className="menu-footer">
          <span className="small-label">(Last updated)</span>
          <span className="mono muted">Copyright / {copyrightYear}</span>
        </footer>
      </div>
    </dialog>
  );
};
