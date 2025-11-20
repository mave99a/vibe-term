
import { DirectoryNode, FileNode, FileSystemNode } from './types';

class VirtualFileSystem {
  private root: DirectoryNode;
  private currentPath: string[] = ['users', 'guest'];
  private currentNode: DirectoryNode;

  constructor() {
    this.root = {
      name: '',
      type: 'directory',
      children: {},
      parent: null
    };
    
    // Initialize namespaces
    this.createDirectory(['users'], this.root);
    this.createDirectory(['users', 'guest'], this.root);
    this.createDirectory(['system'], this.root);
    this.createDirectory(['dev'], this.root);

    // Add some default files
    this.createFile(['system', 'readme'], 'Welcome to WebTerm OS v1.0', this.root);
    this.createFile(['users', 'guest', 'notes.txt'], 'Remember to buy milk.', this.root);
    this.createFile(['dev', 'null'], '', this.root);

    // Set initial CWD to /users/guest
    this.currentNode = this.resolvePathNodes(['users', 'guest']) as DirectoryNode;
  }

  public getCwd(): string {
    if (this.currentPath.length === 0) return '/';
    return '/' + this.currentPath.join('/');
  }

  public listDirectory(path?: string): string[] {
    const targetNode = path ? this.resolvePathNodes(this.parsePath(path)) : this.currentNode;
    
    if (!targetNode || targetNode.type !== 'directory') {
      throw new Error(`Not a directory: ${path || this.getCwd()}`);
    }

    const dir = targetNode as DirectoryNode;
    return Object.keys(dir.children).map(name => {
      const child = dir.children[name];
      return child.type === 'directory' ? `${name}/` : name;
    });
  }

  public changeDirectory(path: string): void {
    const parts = this.parsePath(path);
    const target = this.resolvePathNodes(parts);

    if (!target) {
      throw new Error(`Directory not found: ${path}`);
    }
    if (target.type !== 'directory') {
      throw new Error(`Not a directory: ${path}`);
    }

    this.currentNode = target as DirectoryNode;
    this.currentPath = this.getNodePath(this.currentNode);
  }

  public readFile(path: string): string {
    const parts = this.parsePath(path);
    const target = this.resolvePathNodes(parts);

    if (!target) {
      throw new Error(`File not found: ${path}`);
    }
    if (target.type !== 'file') {
      throw new Error(`Is a directory: ${path}`);
    }

    return (target as FileNode).content;
  }

  public makeDirectory(path: string): void {
    const parts = this.parsePath(path);
    const dirName = parts.pop();
    if (!dirName) throw new Error("Invalid path");

    const parentNode = this.resolvePathNodes(parts);
    if (!parentNode || parentNode.type !== 'directory') {
      throw new Error(`Path not found: ${parts.join('/')}`);
    }

    const parentDir = parentNode as DirectoryNode;
    if (parentDir.children[dirName]) {
      throw new Error(`Directory already exists: ${dirName}`);
    }

    this.createDirectory([dirName], parentDir);
  }

  public removeDirectory(path: string): void {
    const parts = this.parsePath(path);
    const dirName = parts[parts.length - 1];
    const target = this.resolvePathNodes(parts);

    if (!target) {
      throw new Error(`Directory not found: ${path}`);
    }
    if (target.type !== 'directory') {
      throw new Error(`Not a directory: ${path}`);
    }
    if (Object.keys((target as DirectoryNode).children).length > 0) {
      throw new Error(`Directory not empty: ${path}`);
    }
    if (target === this.currentNode || target === this.root) {
      throw new Error("Cannot remove current or root directory");
    }

    const parent = target.parent;
    if (parent) {
      delete parent.children[dirName];
    }
  }

  // --- Helpers ---

  private parsePath(path: string): string[] {
    if (!path) return [];
    const isAbsolute = path.startsWith('/');
    const parts = path.split('/').filter(p => p.length > 0);
    
    if (isAbsolute) {
      return parts;
    } else {
      // Relative path resolution logic could be more complex, 
      // but for now we assume relative to CWD unless it starts with /
      // We will handle .. resolution during node traversal or here.
      // Let's resolve .. here.
      const current = [...this.currentPath];
      for (const part of parts) {
        if (part === '.') continue;
        if (part === '..') {
          current.pop();
        } else {
          current.push(part);
        }
      }
      return current;
    }
  }

  private resolvePathNodes(parts: string[], startNode: DirectoryNode = this.root): FileSystemNode | null {
    let current: FileSystemNode = startNode;
    
    for (const part of parts) {
      if (current.type !== 'directory') return null;
      const dir = current as DirectoryNode;
      if (!dir.children[part]) return null;
      current = dir.children[part];
    }
    return current;
  }

  private getNodePath(node: FileSystemNode): string[] {
    const path: string[] = [];
    let curr: FileSystemNode | undefined | null = node;
    while (curr && curr.parent) { // Stop at root (parent is null)
      path.unshift(curr.name);
      curr = curr.parent;
    }
    return path;
  }

  private createDirectory(pathParts: string[], startNode: DirectoryNode) {
    let current = startNode;
    for (const part of pathParts) {
      if (!current.children[part]) {
        const newDir: DirectoryNode = {
          name: part,
          type: 'directory',
          children: {},
          parent: current
        };
        current.children[part] = newDir;
      }
      current = current.children[part] as DirectoryNode;
    }
  }

  private createFile(pathParts: string[], content: string, startNode: DirectoryNode) {
    const fileName = pathParts.pop();
    if (!fileName) return;
    
    this.createDirectory(pathParts, startNode);
    const dir = this.resolvePathNodes(pathParts, startNode) as DirectoryNode;
    
    const newFile: FileNode = {
      name: fileName,
      type: 'file',
      content: content,
      parent: dir
    };

    dir.children[fileName] = newFile;
  }
}

export const fileSystem = new VirtualFileSystem();
export type FileSystemType = VirtualFileSystem;
