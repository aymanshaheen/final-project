export const typography = {
  sizes: {
    xs: 12,
    sm: 13,
    base: 15,
    lg: 16,
    xl: 18,
    h4: 22,
    icon: 34,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 18,
    normal: 22,
  },
};

export type Typography = typeof typography;
