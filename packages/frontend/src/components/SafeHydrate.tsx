export function SafeHydrate({ children }: any) {
  return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
}
