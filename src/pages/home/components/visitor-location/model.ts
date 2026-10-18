/**
 * 提取城市与国家；无可靠城市字段时不推测访客位置。
 * @param value 定位接口返回的未知数据。
 * @returns 可显示的位置文字，缺少城市时返回 undefined。
 */
export const parseVisitorLocation = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object' || !('city' in value) || typeof value.city !== 'string')
    return;
  const city = value.city.trim();
  if (!city || city.length > 100) return;
  const country =
    'country' in value && typeof value.country === 'string' ? value.country.trim() : '';
  return country && country.length <= 100 ? `${city} · ${country}` : city;
};

let visitorLocationPromise: Promise<string> | undefined;

/** 共享有超时上限的查询，接口失败时保留时钟并返回诚实的空状态。 */
export const getVisitorLocationLabel = (): Promise<string> => {
  // shortcut: 页面内复用城市，切换网络后刷新更新；需要实时位置时再增加刷新机制。
  visitorLocationPromise ??= Promise.resolve()
    .then(async () => {
      const response = await fetch('https://get.geojs.io/v1/ip/geo.json', {
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error('城市查询失败');
      const value: unknown = await response.json();
      return parseVisitorLocation(value) ?? '位置暂不可用';
    })
    .catch(() => '位置暂不可用');
  return visitorLocationPromise;
};
