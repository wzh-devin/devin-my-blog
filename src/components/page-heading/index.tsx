export const PageHeading = ({ number, title }: { number?: string; title: string }) => (
  <div className="page-heading">
    {number !== undefined && <span className="small-label">({number})</span>}
    <div className="title-clip">
      <h1 tabIndex={-1}>{title}</h1>
    </div>
  </div>
);
