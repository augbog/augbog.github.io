export default function Header() {
  return (
    <header
      style={{
        fontFamily: '"Helvetica Neue", helvetica, arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        textRendering: 'optimizeLegibility',
        fontWeight: 200,
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 'auto',
        zIndex: 3,
      }}
    >
      <div
        style={{
          display: 'flex',
          margin: '0 20px',
        }}
      >
        <ul style={{ marginLeft: 'auto', lineHeight: '22px' }}>
          <li
            className="email"
            style={{ display: 'flex', alignItems: 'center', gap: 4, height: 'auto', margin: '0 20px' }}
          >
            <svg
              className="mail-icon"
              style={{ width: 15, height: 15, flexShrink: 0 }}
              aria-label="Email"
              role="img"
            >
              <use xlinkHref="#svg-mail" />
            </svg>
            hello@augustusyuan.com
          </li>
        </ul>
      </div>

      {/* Inline SVG sprite — replaces the old Gulp svgstore inject */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ height: 0, width: 0, position: 'absolute', visibility: 'hidden' }} aria-hidden="true">
        <symbol id="svg-mail" viewBox="0 0 24 24">
          <path d="M12 12.713L.015 3h23.97L12 12.713zm0 2.574L0 5.562V21h24V5.562l-12 9.725z"/>
        </symbol>
        <symbol id="svg-twitter" viewBox="0 0 16 16">
          <path d="M16 3.038a6.62 6.62 0 0 1-1.885.517 3.299 3.299 0 0 0 1.443-1.816 6.59 6.59 0 0 1-2.085.795 3.273 3.273 0 0 0-2.396-1.036 3.281 3.281 0 0 0-3.197 4.03A9.329 9.329 0 0 1 1.114 2.1 3.243 3.243 0 0 0 .67 3.75c0 1.14.58 2.143 1.46 2.732a3.278 3.278 0 0 1-1.487-.41v.04c0 1.59 1.13 2.918 2.633 3.22a3.336 3.336 0 0 1-1.482.056 3.287 3.287 0 0 0 3.067 2.28 6.592 6.592 0 0 1-4.077 1.404c-.265 0-.526-.015-.783-.045a9.303 9.303 0 0 0 5.032 1.474c6.038 0 9.34-5 9.34-9.338 0-.143-.004-.284-.01-.425a6.67 6.67 0 0 0 1.638-1.7z" fillRule="nonzero"/>
        </symbol>
        <symbol id="svg-github" viewBox="0 0 16 16">
          <path d="M8 0a8 8 0 0 0-8 8 8 8 0 0 0 5.47 7.59c.4.075.547-.172.547-.385 0-.19-.007-.693-.01-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.725-.496.056-.486.056-.486.803.056 1.225.824 1.225.824.714 1.223 1.873.87 2.33.665.072-.517.278-.87.507-1.07-1.777-.2-3.644-.888-3.644-3.953 0-.873.31-1.587.823-2.147-.083-.202-.358-1.015.077-2.117 0 0 .672-.215 2.2.82a7.68 7.68 0 0 1 2.003-.27c.68.004 1.364.092 2.003.27 1.527-1.035 2.198-.82 2.198-.82.437 1.102.163 1.915.08 2.117.513.56.823 1.274.823 2.147 0 3.073-1.87 3.75-3.653 3.947.287.246.543.735.543 1.48 0 1.07-.01 1.933-.01 2.195 0 .215.144.463.55.385A8 8 0 0 0 8 0"/>
        </symbol>
        <symbol id="svg-linkedin" viewBox="0 0 16 16">
          <path d="M13.632 13.635h-2.37V9.922c0-.886-.018-2.025-1.234-2.025-1.235 0-1.424.964-1.424 1.96v3.778h-2.37V6H8.51v1.04h.03c.318-.6 1.092-1.233 2.247-1.233 2.4 0 2.845 1.58 2.845 3.637v4.188zM3.558 4.955a1.376 1.376 0 1 1-.001-2.751 1.376 1.376 0 0 1 .001 2.751zm1.188 8.68H2.37V6h2.376v7.635zM14.816 0H1.18C.528 0 0 .516 0 1.153v13.694C0 15.484.528 16 1.18 16h13.635c.652 0 1.185-.516 1.185-1.153V1.153C16 .516 15.467 0 14.815 0z" fillRule="nonzero"/>
        </symbol>
        <symbol id="svg-stackoverflow" viewBox="-135 22 32 38">
          <path fill="#BCBBBB" d="M-108.5 56.2v-9.9h3.3v13.2H-135V46.3h3.3v9.9z"/>
          <path fill="#F48024" d="M-128 45.4l16.2 3.4.7-3.2-16.2-3.4-.7 3.2zm2.1-7.8l15 7 1.4-3-15-7-1.4 3zm4.2-7.4l12.7 10.6 2.1-2.5-12.7-10.6-2.1 2.5zm8.2-7.8l-2.7 2 9.9 13.3 2.7-2-9.9-13.3zm-14.9 30.5h16.6v-3.3h-16.6v3.3z"/>
        </symbol>
      </svg>
    </header>
  );
}
