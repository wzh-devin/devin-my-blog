import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { navigationList, menuContent } from '../../../content/index.ts';
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
  const location = useLocation();
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
                  key={href}
                  className="menu-link"
                  to={href}
                  aria-current={
                    page === route ||
                    page === `page:${route}` ||
                    location.pathname === href.split(/[?#]/)[0] ||
                    (route === 'writing' && ['archive', 'article'].includes(page))
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
              {menuContent.eyebrow && <span className="small-label">({menuContent.eyebrow})</span>}
              <h2>{menuContent.title}</h2>
              {menuContent.description && <p>{menuContent.description}</p>}
              <div className="contact-links flex flex-wrap">
                {menuContent.linkList.map(({ label, href }, index) => (
                  <TextLink key={`${href}:${index}`} to={href}>
                    {label}
                  </TextLink>
                ))}
              </div>
            </section>
          </div>
        </div>
        <footer className="menu-footer">
          {menuContent.footer.label && (
            <span className="small-label">({menuContent.footer.label})</span>
          )}
          <span className="mono muted">
            {menuContent.footer.text.replaceAll('{year}', String(copyrightYear))}
          </span>
        </footer>
      </div>
    </dialog>
  );
};
