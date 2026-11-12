import { Fragment } from 'react';

type InlineTextProps = {
  text: string;
};

/**
 * Renders overview copy with `code` (backticks) and **bold** (UI labels). No other markup.
 */
export const InlineText = ({ text }: InlineTextProps) => {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={index} className={styles.code}>
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className={styles.bold}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
};

const styles = {
  code: `font-mono text-[0.85em] bg-gray-100 text-gray-800 rounded px-1 py-0.5 break-words`,
  bold: `font-semibold text-gray-900`,
};
