const icons = [
  {
    brand: 'twitter',
    href: 'https://mobile.twitter.com/augburto',
    title: 'Twitter: @augburto',
    svgId: 'svg-twitter',
    fill: '#5EA9DD',
  },
  {
    brand: 'github',
    href: 'https://github.com/augbog',
    title: 'Github: augbog',
    svgId: 'svg-github',
    fill: 'inherit',
  },
  {
    brand: 'linkedin',
    href: 'https://www.linkedin.com/in/augustusyuan',
    title: 'LinkedIn: augustusyuan',
    svgId: 'svg-linkedin',
    fill: '#0077B5',
  },
  {
    brand: 'stackoverflow',
    href: 'https://stackoverflow.com/users/1168661/aug',
    title: 'StackOverflow: aug',
    svgId: 'svg-stackoverflow',
    fill: 'inherit',
  },
];

const iconStyle = {
  display: 'inline-block',
  width: 20,
  height: 20,
  margin: '0 10px',
  transition: 'transform 0.1s ease-out 0s',
};

export default function SocialIcons({ onIconHover }) {
  return (
    <div className="social-icons">
      <ul>
        {icons.map(({ brand, href, title, svgId, fill }) => (
          <a
            key={brand}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${brand} icon`}
            style={{ ...iconStyle, fill }}
            onMouseEnter={() => onIconHover?.(brand)}
            onFocus={() => onIconHover?.(brand)}
          >
            <svg style={{ width: 'inherit', height: 'inherit' }}>
              <title>{title}</title>
              <use xlinkHref={`#${svgId}`} />
            </svg>
          </a>
        ))}
      </ul>
    </div>
  );
}
