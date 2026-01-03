import {
  ClipboardList,
  PlusCircle,
  Settings,
  HelpCircle,
  BarChart3,
  User,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /**
   * exact: 完全一致 (デフォルト)
   * startsWith: 前方一致
   * custom: (pathname: string) => boolean
   */
  matchType?: "exact" | "startsWith";
  /**
   * 特定のパスを除外する場合に使用 (matchType: startsWithの場合など)
   */
  excludePaths?: string[];
  adminOnly?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigationConfig: NavSection[] = [
  {
    title: "アンケート管理",
    items: [
      {
        label: "アンケート一覧",
        href: "/admin/surveys",
        icon: ClipboardList,
      },
      {
        label: "アンケート結果一覧",
        href: "/admin/answers",
        icon: BarChart3,
      },
      {
        label: "新規作成",
        href: "/admin/surveys/create",
        icon: PlusCircle,
      },
    ],
  },
  {
    title: "アプリ管理",
    items: [
      {
        label: "アプリ一覧",
        href: "/admin/apps",
        icon: Settings,
        matchType: "startsWith",
        excludePaths: ["/admin/apps/create"],
      },
      {
        label: "アプリ作成",
        href: "/admin/apps/create",
        icon: PlusCircle,
      },
    ],
  },
  {
    title: "ユーザー管理",
    items: [
      {
        label: "ユーザー一覧",
        href: "/admin/users",
        icon: User,
      },
      {
        label: "ユーザー作成",
        href: "/admin/users/create",
        icon: PlusCircle,
        adminOnly: true,
      },
    ],
  },
  {
    title: "その他",
    items: [
      {
        label: "ヘルプ",
        href: "/admin/help",
        icon: HelpCircle,
      },
    ],
  },
];
