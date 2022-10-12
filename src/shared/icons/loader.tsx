export const ico_loader = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 200 200"
    fill="none"
    color="currentColor"
  >
    <defs>
      <linearGradient id="a">
        <stop offset="0%" stopOpacity={0} stopColor="currentColor" />
        <stop offset="100%" stopOpacity={0.5} stopColor="currentColor" />
      </linearGradient>
      <linearGradient id="b">
        <stop offset="0%" stopColor="currentColor" />
        <stop offset="100%" stopOpacity={0.5} stopColor="currentColor" />
      </linearGradient>
    </defs>
    <g strokeWidth={4}>
      <path stroke="url(#a)" d="M4 100a96 96 0 0 1 192 0" />
      <path stroke="url(#b)" d="M196 100a96 96 0 0 1-192 0" />
      <path stroke="currentColor" strokeLinecap="round" d="M4 100a96 96 0 0 1 0-2" />
    </g>
    <animateTransform
      from="0 0 0"
      to="360 0 0"
      attributeName="transform"
      type="rotate"
      repeatCount="indefinite"
      dur="1300ms"
    />
  </svg>
);
