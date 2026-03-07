export default function ScrambleText({ text, className }: { text: string, className?: string }) {
  return <span className={className}>{text}</span>;
}
