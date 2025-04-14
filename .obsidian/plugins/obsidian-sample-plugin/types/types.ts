import { TFile } from "obsidian";

interface LumaSettings {
  mySetting: string;
}

export type NoteData = {
  file: TFile;
  content: string;
  vector: number[];
};

export type Cluster = {
  notes: NoteData[];
  label?: string;
  emotions?: string[];
  type?: string;
  summary?: string;
  quote?: string;
  interpretation?: string;
  connections?: string[];
};
