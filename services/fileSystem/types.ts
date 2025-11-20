
export type NodeType = 'file' | 'directory';

export interface FileSystemNode {
  name: string;
  type: NodeType;
  parent?: DirectoryNode | null;
}

export interface FileNode extends FileSystemNode {
  type: 'file';
  content: string;
}

export interface DirectoryNode extends FileSystemNode {
  type: 'directory';
  children: { [key: string]: FileSystemNode };
}
