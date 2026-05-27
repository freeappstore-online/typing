export function getGrade(wpm: number): string {
  if (wpm >= 120) return "A+";
  if (wpm >= 100) return "A";
  if (wpm >= 85) return "A-";
  if (wpm >= 70) return "B+";
  if (wpm >= 60) return "B";
  if (wpm >= 50) return "B-";
  if (wpm >= 40) return "C+";
  if (wpm >= 35) return "C";
  if (wpm >= 30) return "C-";
  if (wpm >= 25) return "D+";
  if (wpm >= 20) return "D";
  if (wpm >= 15) return "D-";
  return "F";
}

export function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "var(--success)";
  if (grade.startsWith("B")) return "var(--accent)";
  if (grade.startsWith("C")) return "var(--warning)";
  return "var(--error)";
}
