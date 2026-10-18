import { TextLink } from '../../../components/text-link/index.tsx';
import type { ContentEntry } from '../../types.ts';
import './entry-list.css';

/** 工具、项目和链接页共用名称、说明及操作入口。 */
export const EntryList = ({ entryList }: { entryList: ContentEntry[] }) => (
  <ul className="article-list">
    {entryList.map(({ name, description, linkList, year }, index) => (
      <li key={`${name}:${index}`}>
        <div className="article-row-heading entry-row-heading">
          <h3>{name}</h3>
          <div className="entry-actions">
            {year && <span className="mono muted">{year}</span>}
            {linkList.map(({ label, href }, linkIndex) => (
              <TextLink key={`${href}:${linkIndex}`} to={href}>
                <span className="sr-only">{name}：</span>
                {label}
              </TextLink>
            ))}
          </div>
        </div>
        <div className="article-row-body">
          <p>{description}</p>
        </div>
      </li>
    ))}
  </ul>
);
