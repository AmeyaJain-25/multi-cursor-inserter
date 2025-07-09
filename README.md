# Multi-Cursor Incrementing Inserter

A VS Code extension to insert incrementing numbers at multiple cursors with customizable prefix, suffix, padding, and cursor order.

## Features

- Insert incrementing numbers with a **prefix**, **suffix**, or **plain** numbering.
- Choose the **start number** and **zero padding**.
- Choose whether to apply numbering in **document order** (top-to-bottom) or **selection order** (order of your cursors).
- Supports multi-cursor editing for fast bulk insertion.

## Commands

- **Insert Incrementing Numbers with Prefix**  
  Inserts numbers with a user-specified prefix (default: `_start`).  
  Keybinding: `Cmd + Alt + P`

- **Insert Incrementing Numbers with Suffix**  
  Inserts numbers with a user-specified suffix (default: `_end`).  
  Keybinding: `Cmd + Alt + S`

- **Insert Plain Incrementing Numbers**  
  Inserts plain incrementing numbers with no prefix or suffix.  
  Keybinding: `Cmd + Alt + N`

## Usage

1. Place multiple cursors where you want to insert numbers (e.g., using `Cmd + D`).
2. Run one of the commands via Command Palette or use the keybindings.
3. Follow prompts to enter:
   - Start number
   - Prefix or suffix (depending on the command)
   - Zero padding (number of digits)
   - Cursor processing order (Document Order or Selection Order)
4. Numbers will be inserted at each cursor accordingly.

## Installation

Install from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/) or build and install locally:

```bash
npm install
npm run compile
code --install-extension multi-cursor-inserter.vsix
```
