import { InputNode }     from './InputNode';
import { OutputNode }    from './OutputNode';
import { LLMNode }       from './LLMNode';
import { TextNode }      from './TextNode';
import { FilterNode }    from './FilterNode';
import { MergeNode }     from './MergeNode';
import { TransformNode } from './TransformNode';
import { HTTPNode }      from './HTTPNode';
import { NoteNode }      from './NoteNode';

export const nodeTypes = {
  customInput:  InputNode,
  llm:          LLMNode,
  customOutput: OutputNode,
  text:         TextNode,
  filter:       FilterNode,
  merge:        MergeNode,
  transform:    TransformNode,
  http:         HTTPNode,
  note:         NoteNode,
};

export const NODE_CONFIGS = [
  { type: 'customInput',  label: 'Input',     category: 'input' },
  { type: 'llm',          label: 'LLM',       category: 'llm' },
  { type: 'customOutput', label: 'Output',    category: 'output' },
  { type: 'text',         label: 'Text',      category: 'text' },
  { type: 'filter',       label: 'Filter',    category: 'filter' },
  { type: 'merge',        label: 'Merge',     category: 'merge' },
  { type: 'transform',    label: 'Transform', category: 'transform' },
  { type: 'http',         label: 'HTTP',      category: 'http' },
  { type: 'note',         label: 'Note',      category: 'note' },
];
