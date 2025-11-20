
# WebTerm OS (React Terminal UI)

<pre>
  _    _      _    _______                   ____   _____ 
 | |  | |    | |  |__   __|                 / __ \ / ____|
 | |  | | ___| |__   | | ___ _ __ _ __ ___ | |  | | (___  
 | |/\| |/ _ \ '_ \  | |/ _ \ '__| '_ ` _ \| |  | |\___ \ 
 \  /\  /  __/ |_) | | |  __/ |  | | | | | | |__| |____) |
  \/  \/ \___|_.__/  |_|\___|_|  |_| |_| |_|\____/|_____/ 
                                                          
</pre>

A sophisticated, browser-based terminal emulator built with **React**, **TypeScript**, and **Tailwind CSS**. It features a fully functional in-memory virtual file system, Unix-like command processing with piping/redirection, and a nostalgic CRT visual aesthetic.

## 📸 Terminal Interface

```text
+-------------------------------------------------------------------+
|  bash — 80x24                                           [-][+][x] |
+-------------------------------------------------------------------+
| WebTerm OS v1.0                                                   |
| Type 'help' to see a list of available commands.                  |
|                                                                   |
| guest@webterm:~ $ banner "Hello"                                  |
|  #   #  #####  #      #       ###                                 |
|  #   #  #      #      #      #   #                                |
|  #####  #####  #      #      #   #                                |
|  #   #  #      #      #      #   #                                |
|  #   #  #####  #####  #####   ###                                 |
|                                                                   |
| guest@webterm:~ $ echo "Secret logs" > /users/guest/logs.txt      |
| guest@webterm:~ $ cat logs.txt                                    |
| Secret logs                                                       |
|                                                                   |
| guest@webterm:~ $ _                                               |
|                                                                   |
+-------------------------------------------------------------------+
```

## ✨ Features

- **Virtual File System**: A complete in-memory file system (VFS) supporting:
  - Nested directories and file creation.
  - Metadata support (permissions, owner, size, timestamps).
  - Standard traversal (`cd`, `ls`, `tree`).
- **I/O Redirection**: 
  - Overwrite (`>`) and Append (`>>`) to files.
  - Works with all standard output commands.
- **Virtual Devices**: 
  - `/dev/tty`: Read/Write directly to the terminal history buffer.
  - `/dev/null`: The void.
- **Interactive Shell**: 
  - Command history navigation (Up/Down arrows).
  - Real-time parsing.
  - `motd` interactive editor.
- **Retro Aesthetic**: 
  - CRT scanlines and glow effects.
  - Blinking cursor.
  - Custom scrollbars.

## 🛠 Command Reference

### File System
| Command | Description |
|---------|-------------|
| `ls [-l]` | List directory contents. Use `-l` for detailed view. |
| `cd [path]` | Change directory. Supports `..`, `.`, and absolute paths. |
| `pwd` | Print working directory. |
| `md [name]` | Make directory. |
| `rd [name]` | Remove directory. |
| `tree [path]` | recursive directory listing. |
| `cat [file]` | Read file content. |

### System & Tools
| Command | Description |
|---------|-------------|
| `echo [text]` | Print text to stdout. |
| `banner [text]` | Generate ASCII art text. |
| `date` | Show current time. |
| `whoami` | Show current user. |
| `clear` | Clear screen. |
| `motd [-e]` | Show or edit (-e) the Message of the Day. |
| `help` | List commands. |

## 🚀 Run and Deploy

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

3.  **Build for Production**
    ```bash
    npm run build
    ```

### Advanced: Piping & Redirection Examples

**Writing to a file:**
```bash
echo "This is a note" > notes.txt
```

**Appending to a file:**
```bash
date >> notes.txt
```

**Writing to the terminal screen via device:**
```bash
echo "System Broadcast Message" > /dev/tty
```

**Saving command output to a file:**
```bash
ls -l > filelist.txt
```
