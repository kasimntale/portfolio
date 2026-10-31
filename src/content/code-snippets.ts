export type CodeToken = {
  text: string;
  kind?: "keyword" | "string" | "comment" | "function" | "number";
};
export type CodeSnippet = { language: string; lines: CodeToken[][] };
// Local, pre-tokenized examples: no editor, syntax parser, network, or random text.
export const codeSnippets: CodeSnippet[] = [
  {
    language: "TypeScript / React",
    lines: [
      [
        { text: "type ", kind: "keyword" },
        { text: "Product = { id: string; name: string };" },
      ],
      [
        { text: "export function ", kind: "keyword" },
        { text: "ProductCard", kind: "function" },
        { text: "({ product }: { product: Product }) {" },
      ],
      [
        { text: "  return ", kind: "keyword" },
        { text: "<article>{product.name}</article>;" },
      ],
      [{ text: "}" }],
    ],
  },
  {
    language: "Python / Machine learning",
    lines: [
      [
        { text: "from ", kind: "keyword" },
        { text: "sklearn.model_selection " },
        { text: "import ", kind: "keyword" },
        { text: "train_test_split" },
      ],
      [
        { text: "X_train, X_test, y_train, y_test = " },
        { text: "train_test_split", kind: "function" },
        { text: "(" },
      ],
      [
        { text: "    X, y, test_size=" },
        { text: "0.2", kind: "number" },
        { text: ", random_state=" },
        { text: "42", kind: "number" },
      ],
      [{ text: ")" }],
      [{ text: "model.fit", kind: "function" }, { text: "(X_train, y_train)" }],
    ],
  },
  {
    language: "HTTP / API design",
    lines: [
      [
        { text: "GET ", kind: "keyword" },
        { text: "/v1/projects?cursor=next&limit=20", kind: "string" },
      ],
      [{ text: "Accept: application/json" }],
      [{ text: "HTTP/1.1 " }, { text: "200", kind: "number" }, { text: " OK" }],
      [{ text: '{ "data": [], "nextCursor": null }' }],
    ],
  },
  {
    language: "TypeScript / Data structures",
    lines: [
      [
        { text: "function ", kind: "keyword" },
        { text: "unique", kind: "function" },
        { text: "<T>(items: T[]): T[] {" },
      ],
      [
        { text: "  return ", kind: "keyword" },
        { text: "[...new Set(items)];" },
      ],
      [{ text: "}" }],
      [{ text: "// Stable insertion order. No mutation.", kind: "comment" }],
    ],
  },
  {
    language: "SQL / Database queries",
    lines: [
      [
        { text: "SELECT ", kind: "keyword" },
        { text: "project_id, COUNT(*) AS sessions" },
      ],
      [{ text: "FROM ", kind: "keyword" }, { text: "test_sessions" }],
      [
        { text: "WHERE ", kind: "keyword" },
        { text: "status = " },
        { text: "'completed'", kind: "string" },
      ],
      [{ text: "GROUP BY ", kind: "keyword" }, { text: "project_id;" }],
    ],
  },
  {
    language: "TypeScript / Testing",
    lines: [
      [
        { text: "test", kind: "function" },
        { text: "(" },
        { text: '"a new ledger starts empty"', kind: "string" },
        { text: ", () => {" },
      ],
      [
        { text: "  const ", kind: "keyword" },
        { text: "ledger = " },
        { text: "createLedger", kind: "function" },
        { text: "();" },
      ],
      [
        { text: "  expect", kind: "function" },
        { text: "(ledger.entries).toHaveLength(" },
        { text: "0", kind: "number" },
        { text: ");" },
      ],
      [{ text: "});" }],
    ],
  },
];
