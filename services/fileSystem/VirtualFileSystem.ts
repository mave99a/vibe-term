
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
      parent: null,
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'system',
      size: 4096,
      modifiedAt: new Date()
    };
    
    // Initialize namespaces
    this.createDirectory(['users'], this.root, 'root', 'system');
    this.createDirectory(['users', 'guest'], this.root, 'guest', 'users');
    this.createDirectory(['system'], this.root, 'root', 'system');
    this.createDirectory(['dev'], this.root, 'root', 'system');

    // Add some default files
    this.createFile(['system', 'readme'], 'Welcome to WebTerm OS v1.0', this.root, 'root', 'system');
    this.createFile(['users', 'guest', 'notes.txt'], 'Remember to buy milk.', this.root, 'guest', 'users');
    this.createFile(['dev', 'null'], '', this.root, 'root', 'system');

    // Set initial CWD to /users/guest
    this.currentNode = this.resolvePathNodes(['users', 'guest']) as DirectoryNode;
  }

  public getCwd(): string {
    if (this.currentPath.length === 0) return '/';
    return '/' + this.currentPath.join('/');
  }

  public getDirectoryChildren(path?: string): FileSystemNode[] {
    const targetNode = path ? this.resolvePathNodes(this.parsePath(path)) : this.currentNode;
    
    if (!targetNode || targetNode.type !== 'directory') {
      throw new Error(`Not a directory: ${path || this.getCwd()}`);
    }

    const dir = targetNode as DirectoryNode;
    return Object.values(dir.children);
  }

  public listDirectory(path?: string): string[] {
    // Deprecated in favor of getDirectoryChildren for richer data, 
    // but kept for compatibility if needed by other simple commands.
    const children = this.getDirectoryChildren(path);
    return children.map(child => child.type === 'directory' ? `${child.name}/` : child.name);
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

    const file = target as FileNode;
    if (file.readHandler) {
      return file.readHandler();
    }

    return file.content;
  }

  public writeFile(path: string, content: string): void {
    const parts = this.parsePath(path);
    const target = this.resolvePathNodes(parts);

    // If file exists
    if (target) {
        if (target.type !== 'file') throw new Error(`Is a directory: ${path}`);
        const file = target as FileNode;
        
        // Use handler if available (for devices)
        if (file.writeHandler) {
            file.writeHandler(content);
            return;
        }

        // Normal file write
        file.content = content;
        file.size = content.length;
        file.modifiedAt = new Date();
        return;
    }

    // Create new file
    const fileName = parts[parts.length - 1];
    const dirParts = parts.slice(0, -1);
    
    // Resolve parent directory
    const parentNode = this.resolvePathNodes(dirParts);
    
    if (!parentNode) {
         throw new Error(`Path not found: ${dirParts.join('/')}`);
    }
    if (parentNode.type !== 'directory') {
        throw new Error(`Not a directory: ${dirParts.join('/')}`);
    }

    const newFile: FileNode = {
      name: fileName,
      type: 'file',
      content: content,
      parent: parentNode as DirectoryNode,
      permissions: '-rw-r--r--',
      owner: 'guest',
      group: 'users',
      size: content.length,
      modifiedAt: new Date()
    };

    (parentNode as DirectoryNode).children[fileName] = newFile;
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

    this.createDirectory([dirName], parentDir, 'guest', 'users');
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

  public createDevice(pathParts: string[], readHandler?: () => string, writeHandler?: (c: string) => void): void {
      const fileName = pathParts[pathParts.length - 1];
      const dirParts = pathParts.slice(0, -1);
      
      // Ensure directory structure exists
      let current = this.root;
      for (const part of dirParts) {
          if (!current.children[part]) {
             this.createDirectory([part], current, 'root', 'system');
          }
          const next = current.children[part];
          if (next.type !== 'directory') {
              return; 
          }
          current = next as DirectoryNode;
      }

      const deviceNode: FileNode = {
          name: fileName,
          type: 'file',
          content: '',
          parent: current,
          permissions: 'crw-rw-rw-', // Character device permissions
          owner: 'root',
          group: 'system',
          size: 0,
          modifiedAt: new Date(),
          readHandler,
          writeHandler
      };

      current.children[fileName] = deviceNode;
  }

  // --- Helpers ---

  private parsePath(path: string): string[] {
    if (!path) return [];
    const isAbsolute = path.startsWith('/');
    const parts = path.split('/').filter(p => p.length > 0);
    
    if (isAbsolute) {
      return parts;
    } else {
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

  private createDirectory(pathParts: string[], startNode: DirectoryNode, owner = 'guest', group = 'users') {
    let current = startNode;
    for (const part of pathParts) {
      if (!current.children[part]) {
        const newDir: DirectoryNode = {
          name: part,
          type: 'directory',
          children: {},
          parent: current,
          permissions: 'drwxr-xr-x',
          owner,
          group,
          size: 4096,
          modifiedAt: new Date()
        };
        current.children[part] = newDir;
      }
      current = current.children[part] as DirectoryNode;
    }
  }

  private createFile(pathParts: string[], content: string, startNode: DirectoryNode, owner = 'guest', group = 'users') {
    const fileName = pathParts.pop();
    if (!fileName) return;
    
    this.createDirectory(pathParts, startNode, owner, group);
    const dir = this.resolvePathNodes(pathParts, startNode) as DirectoryNode;
    
    const newFile: FileNode = {
      name: fileName,
      type: 'file',
      content: content,
      parent: dir,
      permissions: '-rw-r--r--',
      owner,
      group,
      size: content.length,
      modifiedAt: new Date()
    };

    dir.children[fileName] = newFile;
  }
}

export const fileSystem = new VirtualFileSystem();
export type FileSystemType = VirtualFileSystem;
