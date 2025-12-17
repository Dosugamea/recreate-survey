interface FooterLink {
  label: string;
  href: string;
}

interface SurveyFooterProps {
  links?: FooterLink[];
  copyright?: string;
  poweredBy?: string;
  themeColor?: string;
}

export function SurveyFooter({
  links = [
    { label: "プライバシーポリシー", href: "/privacy" },
    { label: "お問い合わせ", href: "/contact" },
  ],
  copyright,
  poweredBy,
}: SurveyFooterProps) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";
  const displayPoweredBy = poweredBy ?? appName;
  const displayCopyright = copyright;

  return (
    <footer
      className="w-full bg-[#D4C4A8] text-[#5C4033] py-4 px-4 relative"
      style={{ backgroundColor: "#D4C4A8" }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* 左側: リンク */}
        <div className="flex flex-wrap gap-4 text-sm">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="hover:underline text-[#5C4033] transition-opacity hover:opacity-70"
              style={{ color: "#5C4033" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* 右側: 著作権情報とpowered by */}
        <div className="flex flex-col items-end gap-1 text-sm">
          {displayCopyright && (
            <p className="text-[#5C4033]" style={{ color: "#5C4033" }}>
              {displayCopyright}
            </p>
          )}
          <p className="text-[#5C4033]" style={{ color: "#5C4033" }}>
            powered by {displayPoweredBy}
          </p>
        </div>
      </div>
    </footer>
  );
}
