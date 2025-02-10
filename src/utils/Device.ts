export function getDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /iphone|ipod|android.*mobile|blackberry|opera mini|iemobile|windows phone/.test(userAgent)
  const isTablet = /ipad|android(?!.*mobile)|tablet/.test(userAgent)
  const isDesktop = !isMobile && !isTablet && /windows|macintosh|linux/.test(userAgent)
  if (isMobile) return 'mobile'
  if (isTablet) return 'tablet'
  if (isDesktop) return 'desktop'
  return 'other'
}
