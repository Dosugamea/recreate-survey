import Image from "next/image";

interface SurveyTitleProps {
  /** アンケートのタイトル文字列 */
  title: string;
  /** ヘッダー画像のURL。指定されている場合は画像を表示し、ない場合はテキストタイトルを表示 */
  headerImage?: string | null;
}

/**
 * アンケートのタイトル表示コンポーネント
 * ヘッダー画像がある場合は画像を、ない場合はテキストを表示
 */
export function SurveyTitle({ title, headerImage }: SurveyTitleProps) {
  return (
    <div id="ttl" className="text-center">
      {headerImage ? (
        <Image
          src={headerImage}
          alt="Header"
          width={1200}
          height={600}
          className="mx-auto w-full h-auto"
          sizes="100vw"
          loading="eager"
        />
      ) : (
        <h2 className="text-2xl font-bold py-8">{title}</h2>
      )}
    </div>
  );
}
