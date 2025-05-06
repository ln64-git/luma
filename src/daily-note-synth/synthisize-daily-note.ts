export function synthisizeDatilyNote(content: string): string {
  const today = new Date().toISOString().split('T')[0];
  const processedContent = `# Daily Note for ${today}\n\n## Tasks\n- [ ] Task 1\n- [ ] Task 2\n\n## Notes\n- Note 1\n- Note 2`;
  return processedContent;
}