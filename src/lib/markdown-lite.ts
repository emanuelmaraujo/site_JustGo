// Conversor mínimo para o texto dos JSONs de regiões:
// parágrafos (\n\n), **negrito**, listas "- " e "1. ". O conteúdo é nosso (não vem de usuário).
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

export function mdLite(text: string): string {
    return text
        .split(/\n{2,}/)
        .map((block) => {
            const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
            if (lines.length && lines.every((l) => /^- /.test(l))) {
                return `<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`;
            }
            if (lines.length && lines.every((l) => /^\d+\.\s/.test(l))) {
                return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+\.\s/, ''))}</li>`).join('')}</ol>`;
            }
            if (lines.length > 1 && lines.slice(1).every((l) => /^- /.test(l))) {
                return `<p>${inline(lines[0])}</p><ul>${lines
                    .slice(1)
                    .map((l) => `<li>${inline(l.slice(2))}</li>`)
                    .join('')}</ul>`;
            }
            if (/^\d+\.\s/.test(block.trim())) {
                return `<ol><li>${inline(block.trim().replace(/^\d+\.\s/, ''))}</li></ol>`;
            }
            return `<p>${inline(lines.join(' '))}</p>`;
        })
        .join('')
        .replace(/<\/ol><ol>/g, '');
}
