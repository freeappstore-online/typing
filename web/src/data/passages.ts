import type { Passage } from "./types";

export const passages: readonly Passage[] = [
  {
    id: "q1",
    text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.",
    source: "Steve Jobs",
    category: "quote",
  },
  {
    id: "q2",
    text: "In the middle of difficulty lies opportunity. Life is like riding a bicycle. To keep your balance, you must keep moving. Imagination is more important than knowledge.",
    source: "Albert Einstein",
    category: "quote",
  },
  {
    id: "q3",
    text: "It is not the strongest of the species that survives, nor the most intelligent that survives. It is the one that is most adaptable to change. Nothing in life is to be feared, it is only to be understood.",
    source: "Charles Darwin / Marie Curie",
    category: "quote",
  },
  {
    id: "q4",
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall. The way to get started is to quit talking and begin doing.",
    source: "Nelson Mandela / Walt Disney",
    category: "quote",
  },
  {
    id: "q5",
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts. We make a living by what we get, but we make a life by what we give.",
    source: "Winston Churchill",
    category: "quote",
  },
  {
    id: "l1",
    text: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.",
    source: "A Tale of Two Cities — Charles Dickens",
    category: "literature",
  },
  {
    id: "l2",
    text: "All happy families are alike; each unhappy family is unhappy in its own way. Everything was in confusion in the Oblonskys' house. The wife had discovered that the husband was carrying on an intrigue.",
    source: "Anna Karenina — Leo Tolstoy",
    category: "literature",
  },
  {
    id: "l3",
    text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood.",
    source: "Pride and Prejudice — Jane Austen",
    category: "literature",
  },
  {
    id: "l4",
    text: "Call me Ishmael. Some years ago, never mind how long precisely, having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    source: "Moby Dick — Herman Melville",
    category: "literature",
  },
  {
    id: "l5",
    text: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. Whenever you feel like criticizing anyone, he told me, just remember that all the people in this world haven't had the advantages that you've had.",
    source: "The Great Gatsby — F. Scott Fitzgerald",
    category: "literature",
  },
  {
    id: "p1",
    text: "function fibonacci(n: number): number { if (n <= 1) return n; return fibonacci(n - 1) + fibonacci(n - 2); } const result = fibonacci(10); console.log(result);",
    source: "TypeScript Fibonacci",
    category: "programming",
  },
  {
    id: "p2",
    text: "const express = require('express'); const app = express(); app.get('/api/users', async (req, res) => { const users = await db.query('SELECT * FROM users'); res.json(users); }); app.listen(3000);",
    source: "Express.js Server",
    category: "programming",
  },
  {
    id: "p3",
    text: "interface User { id: string; name: string; email: string; createdAt: Date; } type UpdateUser = Partial<Pick<User, 'name' | 'email'>>; function updateUser(id: string, data: UpdateUser): Promise<User> { return fetch(id, data); }",
    source: "TypeScript Interfaces",
    category: "programming",
  },
  {
    id: "p4",
    text: "git commit -m 'initial commit' && git push origin main; docker build -t myapp:latest . && docker run -p 3000:3000 myapp:latest; npm install --save-dev typescript eslint prettier",
    source: "CLI Commands",
    category: "programming",
  },
  {
    id: "p5",
    text: "SELECT u.name, COUNT(o.id) AS order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at > '2024-01-01' GROUP BY u.name HAVING COUNT(o.id) > 5 ORDER BY order_count DESC;",
    source: "SQL Query",
    category: "programming",
  },
  {
    id: "c1",
    text: "The quick brown fox jumps over the lazy dog while the five boxing wizards jump quickly. Pack my box with five dozen liquor jugs and then ship them to the warehouse by next Thursday morning.",
    source: "Common English",
    category: "common",
  },
  {
    id: "c2",
    text: "She sells seashells by the seashore. The shells she sells are seashells for sure. So if she sells shells on the seashore, I'm sure she sells seashore shells. Peter Piper picked a peck of pickled peppers.",
    source: "Tongue Twisters",
    category: "common",
  },
  {
    id: "c3",
    text: "Technology continues to reshape how we live, work, and communicate with each other. From artificial intelligence to quantum computing, the pace of innovation shows no signs of slowing down in the coming decades.",
    source: "Modern English",
    category: "common",
  },
  {
    id: "c4",
    text: "The weather forecast predicted heavy rainfall throughout the weekend, but Sunday turned out to be a beautiful day with clear skies and warm sunshine. The children played in the garden while their parents prepared a barbecue.",
    source: "Everyday English",
    category: "common",
  },
  {
    id: "g1",
    text: "The five boxing wizards jump quickly. How vexingly quick daft zebras jump! The jay, pig, fox, zebra and my wolves quack! Bright vixens jump; dozy fowl quack. Quick zephyrs blow, vexing daft Jim.",
    source: "Pangrams Collection",
    category: "pangram",
  },
  {
    id: "g2",
    text: "Sphinx of black quartz, judge my vow. Two driven jocks help fax my big quiz. The quick brown fox jumps over a lazy dog. Pack my box with five dozen liquor jugs. Amazingly few discotheques provide jukeboxes.",
    source: "Classic Pangrams",
    category: "pangram",
  },
  {
    id: "c5",
    text: "Learning a new skill takes dedication and consistent practice over time. Whether you are picking up a musical instrument, studying a foreign language, or mastering a sport, the key is to show up every single day and put in the work.",
    source: "Motivational English",
    category: "common",
  },
  {
    id: "l6",
    text: "Far out in the uncharted backwaters of the unfashionable end of the western spiral arm of the Galaxy lies a small unregarded yellow sun. Orbiting this at a distance of roughly ninety-two million miles is an utterly insignificant little blue-green planet.",
    source: "The Hitchhiker's Guide — Douglas Adams",
    category: "literature",
  },
];

export const commonWords: readonly string[] = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come",
  "its", "over", "think", "also", "back", "after", "use", "two", "how",
  "our", "work", "first", "well", "way", "even", "new", "want", "because",
  "any", "these", "give", "day", "most", "find", "here", "thing", "many",
  "need", "still", "between", "name", "should", "home", "life", "long",
  "world", "hand", "high", "keep", "place", "small", "great", "again",
  "never", "must", "before", "move", "right", "while", "turn", "might",
  "point", "every", "through", "change", "much", "line", "city", "play",
  "start", "might", "story", "young", "along", "state", "close", "seem",
  "help", "house", "head", "each", "begin", "three", "under", "group",
  "always", "carry", "those", "both", "often", "earth", "learn", "above",
  "real", "light", "write", "together", "music", "face", "number", "early",
  "enough", "power", "open", "walk", "water", "across", "during", "today",
  "almost", "without", "school", "night", "system", "program", "question",
  "different", "important", "another", "problem", "possible", "computer",
  "remember", "anything", "morning", "answer", "family", "picture",
  "language", "country", "example", "paper", "study", "market", "level",
  "company", "service", "report", "develop", "society", "second", "record",
];

export function getRandomPassage(): Passage {
  const idx = Math.floor(Math.random() * passages.length);
  return passages[idx]!;
}

export function generateWordList(count: number, focusKeys?: string[]): string {
  const words: string[] = [];
  const pool = focusKeys && focusKeys.length > 0
    ? commonWords.filter((w) => focusKeys.some((k) => w.includes(k.toLowerCase())))
    : commonWords;
  const source = pool.length > 10 ? pool : commonWords;
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * source.length);
    words.push(source[idx]!);
  }
  return words.join(" ");
}
