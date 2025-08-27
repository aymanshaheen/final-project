export function getPinColorForType(placeType?: string): string {
  const normalized = (placeType ?? '').toLowerCase();
  if (normalized.includes('park')) return '#22c55e';
  if (normalized.includes('cafe') || normalized.includes('coffee'))
    return '#a16207';
  if (normalized.includes('restaurant') || normalized.includes('food'))
    return '#ef4444';
  if (normalized.includes('bar') || normalized.includes('pub'))
    return '#8b5cf6';
  if (
    normalized.includes('store') ||
    normalized.includes('shop') ||
    normalized.includes('market')
  )
    return '#06b6d4';
  if (normalized.includes('museum') || normalized.includes('art'))
    return '#f97316';
  return '#64748b';
}
