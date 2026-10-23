import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpFromLine,
  Bug,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleArrowDown,
  CircleCheck,
  CircleHelp,
  CircleX,
  Code,
  Coins,
  Copy,
  Ellipsis,
  ExternalLink,
  Eye,
  EyeOff,
  FileCode,
  FileX,
  History,
  House,
  Info,
  Key,
  KeyRound,
  KeySquare,
  Link,
  Lock,
  LockOpen,
  LogOut,
  Maximize2,
  Menu,
  MessageCircle,
  Minimize2,
  MoonStar,
  Network,
  Pencil,
  PlugZap,
  Plus,
  QrCode,
  Search,
  Send,
  Settings,
  Sun,
  Trash2,
  TriangleAlert,
  Users,
  Wallet,
  WandSparkles,
  Waypoints,
  X,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

type SvgIcon = ComponentType<
  SVGProps<SVGSVGElement> & {
    size?: number | string;
    strokeWidth?: number | string;
  }
>;

function brand(path: string): SvgIcon {
  return function BrandIcon({ size = 24, strokeWidth: _s, ...props }) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        {...props}
      >
        <path d={path} />
      </svg>
    );
  };
}

function glyph(text: string): SvgIcon {
  return function GlyphIcon({ size = 24, strokeWidth = 1.5, ...props }) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        {...props}
      >
        <path d={text} />
      </svg>
    );
  };
}

const Github = brand(
  'M12 .5a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57v-2c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.6-2.67-.31-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z'
);
const Discord = brand(
  'M20.32 4.37A19.8 19.8 0 0 0 15.4 2.8a13.7 13.7 0 0 0-.63 1.3 18.4 18.4 0 0 0-5.5 0 13.6 13.6 0 0 0-.64-1.3 19.7 19.7 0 0 0-4.92 1.53C.6 9.05-.24 13.6.18 18.1a19.9 19.9 0 0 0 6.03 3.05 14.6 14.6 0 0 0 1.3-2.1 12.9 12.9 0 0 1-2.04-.98l.5-.4a14.2 14.2 0 0 0 12.06 0l.5.4c-.65.39-1.33.71-2.05.98.37.74.81 1.44 1.3 2.1a19.8 19.8 0 0 0 6.04-3.05c.5-5.22-.84-9.73-3.5-13.73ZM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.95-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.95 2.42-2.16 2.42Zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.22 0 2.18 1.1 2.16 2.42 0 1.34-.94 2.42-2.16 2.42Z'
);
const Docs = glyph('M5 3h10l4 4v14H5V3Zm9 0v5h5M8 12h8M8 16h8');
const Ethereum = glyph('M12 2 5 12l7 4 7-4-7-10Zm-7 11.5L12 22l7-8.5-7 4-7-4Z');
const Cent = glyph('M12 4v16M16 8.5A5 5 0 1 0 16 15.5');

/**
 * The wallet used Tabler icon names through @fuel-ui. Each name maps to the
 * closest Lucide icon so call sites keep their names and their
 * "Icon <Name>" accessible labels.
 */
export const ICONS = {
  AlertTriangle: TriangleAlert,
  ArrowLeft,
  ArrowRight,
  ArrowsDiagonal: Maximize2,
  ArrowsDiagonalMinimize2: Minimize2,
  ArrowsLeftRight: ArrowLeftRight,
  BrandDiscordFilled: Discord,
  BrandGithubFilled: Github,
  BrandStackshare: Docs,
  Bug,
  BuildingBridge: Waypoints,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleArrowDown,
  CircleCheck,
  CircleX,
  Code,
  Coins,
  Copy,
  CurrencyCent: Cent,
  CurrencyEthereum: Ethereum,
  Dots: Ellipsis,
  Download: ArrowDownToLine,
  Edit: Pencil,
  ExclamationCircle: CircleAlert,
  ExternalLink,
  Eye,
  EyeClosed: EyeOff,
  FileOff: FileX,
  HelpCircle: CircleHelp,
  History,
  Home: House,
  InfoCircle: Info,
  Key,
  Link,
  Lock,
  LockOpen,
  Logout: LogOut,
  Menu,
  Menu2: Menu,
  MessageCircle,
  MoonStars: MoonStar,
  Network,
  Password: KeyRound,
  PlugConnected: PlugZap,
  Plus,
  Qrcode: QrCode,
  Script: FileCode,
  Search,
  Send,
  Settings,
  SquareKey: KeySquare,
  SunFilled: Sun,
  Trash: Trash2,
  Upload: ArrowUpFromLine,
  Users,
  Wallet,
  Wand: WandSparkles,
  X,
} satisfies Record<string, SvgIcon>;

export type Icons = keyof typeof ICONS;
