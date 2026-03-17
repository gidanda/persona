type IconProps = {
  size?: number;
  stroke?: string;
};

export function IconSearch({ size = 18, stroke = "currentColor" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.2 16.2 20 20" />
    </svg>
  );
}

export function IconPeople({ size = 20, stroke = "currentColor" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <circle cx="9" cy="9" r="3.5" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M3.5 20c.8-3.2 3.1-5 6.3-5s5.5 1.8 6.3 5" />
      <path d="M14.4 17.2c.6-1.5 2-2.4 4.1-2.4 1.2 0 2.2.3 3 .9" />
    </svg>
  );
}

export function IconScan({ size = 20, stroke = "currentColor" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M4 8V6a2 2 0 0 1 2-2h2" />
      <path d="M16 4h2a2 2 0 0 1 2 2v2" />
      <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
      <path d="M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M7 12h10" />
    </svg>
  );
}

export function IconMe({ size = 20, stroke = "currentColor" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.9-3.2 3.6-5 7-5s6.1 1.8 7 5" />
    </svg>
  );
}

export function IconShared({ size = 20, stroke = "currentColor" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M7 12a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
      <path d="M17 19a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
      <path d="M10 9.5l4 4.2" />
      <path d="M13.8 7.4 17 5.8" />
    </svg>
  );
}

export function IconPen({ size = 18, stroke = "currentColor" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M4 20l4-1 11-11-3-3-11 11-1 4z" />
    </svg>
  );
}

export function IconGear({ size = 18, stroke = "currentColor" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5 13 3.8 13.6 5.3 15.2 5.7 16.6 4.9 17.5 5.8 16.8 7.3 17.7 8.7 19.2 9.1 19.5 10.5 18.2 11.6 18.2 12.4 19.5 13.5 19.2 14.9 17.7 15.3 16.8 16.7 17.5 18.2 16.6 19.1 15.2 18.3 13.6 18.7 13 20.2 12 20.5 11 20.2 10.4 18.7 8.8 18.3 7.4 19.1 6.5 18.2 7.2 16.7 6.3 15.3 4.8 14.9 4.5 13.5 5.8 12.4 5.8 11.6 4.5 10.5 4.8 9.1 6.3 8.7 7.2 7.3 6.5 5.8 7.4 4.9 8.8 5.7 10.4 5.3 11 3.8 12 3.5" />
    </svg>
  );
}
