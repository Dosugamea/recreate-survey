import { hexToRgba } from "@/lib/utils";

interface FooterLink {
  label: string;
  href: string;
}

interface SurveyFooterProps {
  links?: FooterLink[];
  copyright?: string;
  themeColor?: string;
}

export function SurveyFooter({
  links = [
    { label: "プライバシーポリシー", href: "/privacy" },
    { label: "お問い合わせ", href: "/contact" },
  ],
  copyright,
  themeColor = "#5C4033",
}: SurveyFooterProps) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";
  const displayCopyright = copyright;
  const footerBg = hexToRgba(themeColor, 0.1);

  return (
    <footer
      className="w-full py-4 px-4 relative"
      style={{ backgroundColor: footerBg, color: themeColor }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* 左側: リンク */}
        <div className="flex flex-wrap gap-4 text-sm">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="hover:underline transition-opacity hover:opacity-70"
              style={{ color: themeColor }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* 右側: 著作権情報とpowered by */}
        <div className="flex flex-col items-end gap-1 text-sm">
          {displayCopyright && (
            <p style={{ color: themeColor }}>{displayCopyright}</p>
          )}
          <p style={{ color: themeColor }}>powered by {appName}</p>
        </div>
      </div>
    </footer>
  );
}
