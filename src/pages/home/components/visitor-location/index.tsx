import { useEffect, useState } from 'react';
import { getVisitorLocationLabel } from './model.ts';

/** 城市单独加载，离页后忽略结果，不跟随秒针重复查询。 */
export const VisitorLocation = () => {
  const [locationLabel, setLocationLabel] = useState('定位中…');
  useEffect(() => {
    let isActive = true;
    void getVisitorLocationLabel().then((label) => {
      if (isActive) setLocationLabel(label);
    });
    return () => {
      isActive = false;
    };
  }, []);
  return (
    <span className="visitor-location" aria-live="polite" title="按 IP 大致识别的城市">
      {locationLabel}
    </span>
  );
};
