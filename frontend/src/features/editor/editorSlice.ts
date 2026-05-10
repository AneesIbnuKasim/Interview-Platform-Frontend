import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Lang = "typescript" | "javascript" | "python" | "go" | "java" | "cpp" | "rust";

interface EditorState {
  language: Lang;
  code: string;
  saved: boolean;
  syncing: boolean;
}

const starter: Record<Lang, string> = {
  typescript: `// Welcome to your interview\nfunction twoSum(nums: number[], target: number): number[] {\n  const seen = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need)!, i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}\n`,
  javascript: `// Welcome\nfunction add(a, b) { return a + b; }\n`,
  python: `# Welcome\ndef two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n    return []\n`,
  go: `package main\n\nfunc main() {}\n`,
  java: `class Main {\n  public static void main(String[] args) {}\n}\n`,
  cpp: `#include <iostream>\nint main() { return 0; }\n`,
  rust: `fn main() {}\n`,
};

const initialState: EditorState = {
  language: "typescript",
  code: starter.typescript,
  saved: true,
  syncing: false,
};

const slice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Lang>) {
      state.language = action.payload;
      state.code = starter[action.payload];
      state.saved = true;
    },
    setCode(state, action: PayloadAction<string>) {
      state.code = action.payload;
      state.saved = false;
    },
    markSaved(state) { state.saved = true; },
    setSyncing(state, action: PayloadAction<boolean>) { state.syncing = action.payload; },
  },
});

export const { setLanguage, setCode, markSaved, setSyncing } = slice.actions;
export default slice.reducer;
