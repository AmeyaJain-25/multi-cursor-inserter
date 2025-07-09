import * as vscode from "vscode";

type NumberingStyle = "prefix" | "suffix" | "plain";
type OrderType = "Document Order" | "Selection Order";

interface UserInputs {
  start: number;
  prefix: string;
  suffix: string;
  padding: number;
  order: OrderType;
}

async function getUserInputs(
  style: NumberingStyle
): Promise<UserInputs | null> {
  const startInput = await vscode.window.showInputBox({
    prompt: "Start Number",
    value: "1",
    validateInput: (value) =>
      /^\d+$/.test(value) ? null : "Please enter a valid positive integer",
  });
  if (!startInput) {
    vscode.window.showErrorMessage("Start number is required");
    return null;
  }
  const start = Number(startInput);

  let prefix = "";
  let suffix = "";

  if (style === "prefix") {
    prefix =
      (await vscode.window.showInputBox({
        prompt: "Prefix",
        value: "_start",
      })) ?? "";
  } else if (style === "suffix") {
    suffix =
      (await vscode.window.showInputBox({
        prompt: "Suffix",
        value: "_end",
      })) ?? "";
  }

  const paddingInput = await vscode.window.showInputBox({
    prompt: "Zero Padding (e.g., 3 for 001)",
    value: "0",
    validateInput: (value) =>
      /^\d+$/.test(value) ? null : "Please enter a valid non-negative integer",
  });
  const padding = paddingInput ? Number(paddingInput) : 0;

  const orderItems: vscode.QuickPickItem[] = [
    { label: "Document Order" },
    { label: "Selection Order" },
  ];

  const picked = await vscode.window.showQuickPick(orderItems, {
    placeHolder: "Choose cursor processing order",
  });

  if (!picked) {
    vscode.window.showErrorMessage("Order selection is required");
    return null;
  }

  const order = picked.label as OrderType;

  return { start, prefix, suffix, padding, order };
}

function getDocumentOrderSelections(
  selections: readonly vscode.Selection[]
): vscode.Selection[] {
  return [...selections].sort((a, b) => {
    if (a.active.line === b.active.line) {
      return a.active.character - b.active.character;
    }
    return a.active.line - b.active.line;
  });
}

async function insertNumbers(
  editor: vscode.TextEditor,
  inputs: UserInputs
): Promise<void> {
  let selections = editor.selections;
  if (inputs.order === "Document Order") {
    selections = getDocumentOrderSelections(selections);
  }

  await editor.edit((editBuilder) => {
    selections.forEach((sel, i) => {
      const number = (inputs.start + i)
        .toString()
        .padStart(inputs.padding, "0");
      editBuilder.insert(
        sel.active,
        `${inputs.prefix}${number}${inputs.suffix}`
      );
    });
  });
}

export function activate(context: vscode.ExtensionContext): void {
  const registerCommand = (
    commandName: string,
    style: NumberingStyle
  ): void => {
    const disposable = vscode.commands.registerCommand(
      commandName,
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("No active editor found");
          return;
        }

        const inputs = await getUserInputs(style);
        if (!inputs) return;

        await insertNumbers(editor, inputs);
      }
    );
    context.subscriptions.push(disposable);
  };

  registerCommand("multiCursorInserter.insertIncrementingWithPrefix", "prefix");
  registerCommand("multiCursorInserter.insertIncrementingWithSuffix", "suffix");
  registerCommand("multiCursorInserter.insertIncrementingPlain", "plain");
}

export function deactivate(): void {}
