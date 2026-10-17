export const ShortcutHint = ({
  children,
  side = 'left',
}: {
  children: string;
  side?: 'left' | 'right';
}) => (
  <kbd className={`shortcut-label shortcut-${side}`} aria-hidden="true">
    {children}
  </kbd>
);
