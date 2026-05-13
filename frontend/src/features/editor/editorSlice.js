import { createSlice } from "@reduxjs/toolkit";

export const editorStarterCode = {
  typescript: `// Welcome to your interview\nfunction twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}\n`,
  javascript: `// Welcome\nfunction add(a, b) { return a + b; }\n`,
  python: `# Welcome\ndef two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n    return []\n`,
  go: `package main\n\nfunc main() {}\n`,
  java: `class Main {\n  public static void main(String[] args) {}\n}\n`,
  cpp: `#include <iostream>\nint main() { return 0; }\n`,
  rust: `fn main() {}\n`,
};

const initialState = {
  language: "typescript",
  code: editorStarterCode.typescript,
  version: 1,
  savedVersion: 1,
  saved: true,
  syncing: false,
  error: null,
  lastSyncedAt: null,
  savedAt: null,
};

const slice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setLanguage(state, action) {
      state.language = action.payload;
      state.code = editorStarterCode[action.payload] ?? "";
      state.saved = false;
      state.error = null;
    },
    setCode(state, action) {
      state.code = action.payload;
      state.saved = false;
      state.error = null;
    },
    markSaved(state) {
      state.saved = true;
      state.savedVersion = state.version;
    },
    setSyncing(state, action) {
      state.syncing = action.payload;
    },
    applyEditorState(state, action) {
      const payload = action.payload?.state ?? action.payload;
      if (!payload) return;

      state.language = payload.language ?? state.language;
      state.code = payload.code ?? state.code;
      state.version = payload.version ?? state.version;
      state.savedVersion = payload.savedVersion ?? state.savedVersion;
      state.saved = payload.saved ?? state.version === state.savedVersion;
      state.lastSyncedAt = payload.lastSyncedAt ?? state.lastSyncedAt;
      state.savedAt = payload.savedAt ?? state.savedAt;
      state.syncing = false;
      state.error = null;
    },
    acknowledgeEditorState(state, action) {
      const payload = action.payload?.state ?? action.payload;
      if (!payload) return;

      state.version = payload.version ?? state.version;
      state.savedVersion = payload.savedVersion ?? state.savedVersion;
      state.saved =
        payload.code === state.code ? Boolean(payload.saved) : false;
      state.lastSyncedAt = payload.lastSyncedAt ?? state.lastSyncedAt;
      state.savedAt = payload.savedAt ?? state.savedAt;
      state.syncing = false;
      state.error = null;
    },
    setEditorError(state, action) {
      state.syncing = false;
      state.error = action.payload;
    },
  },
});

export const {
  acknowledgeEditorState,
  applyEditorState,
  markSaved,
  setCode,
  setEditorError,
  setLanguage,
  setSyncing,
} = slice.actions;
export default slice.reducer;
