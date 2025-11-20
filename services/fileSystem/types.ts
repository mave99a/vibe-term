
export type NodeType = 'file' | 'directory';

export interface FileSystemNode {
  name: string;
  type: NodeType;
  parent?: DirectoryNode | null;
  permissions: string;
  owner: string;
  group: string;
  size: number;
  modifiedAt: Date;
}

export interface FileNode extends FileSystemNode {
  type: 'file';
  content: string;
}

export interface DirectoryNode extends FileSystemNode {
  type: 'directory';
  children: { [key: string]: FileSystemNode };
}
