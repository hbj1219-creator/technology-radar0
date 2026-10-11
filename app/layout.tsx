import type { Metadata } from "next";
import "./globals.css";
import "./radar-ui.css";
import "./daily-report.css";
import "./readability.css";

export const metadata: Metadata = {
  title: "기술 레이더 | 산업·기술 변화 추적",
  description: "관심 기술의 개발 상황, 기업 적용, 특허와 주간·월간 변화를 근거와 함께 추적합니다.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
