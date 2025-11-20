# WebTerm OS (React Terminal UI)

A fully functional, browser-based terminal emulator built with React and TypeScript. It simulates a Unix-like environment with a retro CRT aesthetic, a virtual file system, and a robust command processor.

## Features

- **Virtual File System**: A complete in-memory file system supporting nested directories, files, and metadata (permissions, owner, size).
- **Interactive Shell**: Supports command history navigation (Up/Down arrows), tab completion (visual only), and real-time feedback.
- **IO Redirection**: Support for standard Unix-like output redirection operators (`>` and `>>`).
- **Virtual Devices**: Interaction with system state through special files (e.g., `/dev/tty`).
- **Persistent State**: The Message of the Day (MOTD) is persisted using LocalStorage.
- **Retro UI**: Styled with Tailwind CSS to mimic an old-school monitor with scanlines, glowing text, and a blinking cursor.

## Command Reference

### File System Operations
- **`ls [-l] [path]`**: List directory contents. 
  - Use `-l` for detailed file metadata (permissions, owner, size, date).
- **`cd <path>`**: Change the current working directory. Supports absolute paths (e.g., `/users/guest`) and relative paths (e.g., `..`, `.`).
- **`pwd`**: Print the full path of the current working directory.
- **`md <name>`**: Make (create) a new directory.
- **`rd <name>`**: Remove an empty directory.
- **`tree [path]`**: Display the directory structure as a recursive visual tree.
- **`cat <file>`**: Display the contents of a file.

### System & Utilities
- **`echo <text>`**: Print arguments to the standard output.
- **`clear`**: Clear the terminal screen history.
- **`date`**: Display the current system date and time.
- **`whoami`**: Display the current active user.
- **`banner <text>`**: Generate a large ASCII art banner from the provided text.
- **`help`**: List all available commands and their descriptions.
- **`motd [-e]`**: View the Message of the Day. 
  - Use `-e` to enter interactive edit mode to change the message.

## Advanced Usage

### Redirection
You can redirect the output of commands to files using standard operators:

1.  **Overwrite (`>`)**:
    ```bash
    echo "Hello World" > notes.txt
    ```
    Writes "Hello World" to `notes.txt`, creating it if it doesn't exist or overwriting it if it does.

2.  **Append (`>>`)**:
    ```bash
    date >> notes.txt
    ```
    Appends the current date to the end of `notes.txt`.

### Virtual Devices
The system mounts a virtual device filesystem at `/dev`. These files interact directly with the system internals.

- **`/dev/tty`**: Represents the current terminal session.
  - **Reading**: `cat /dev/tty` will output the entire text history of your current session.
  - **Writing**: `echo "System Message" > /dev/tty` will write directly to the terminal output stream.

## Architecture

- **`VirtualFileSystem`**: A Singleton service that maintains the file tree structure, handles path resolution, and manages file I/O.
- **`CommandRegistry`**: A scalable pattern where each command is an isolated module registered to the central processor.
- **`Terminal Component`**: The React UI layer that handles input focus, rendering history, and capturing keystrokes.
