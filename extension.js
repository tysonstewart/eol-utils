const vscode = require("vscode");

const SEMICOLON = 1;
const COMMA = 2;

function append(character) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  vscode.commands.executeCommand("acceptSelectedSuggestion").then(() => {
    const lineIndex = editor.selection.active.line;
    const lineObject = editor.document.lineAt(lineIndex);
    const line = lineObject.text.trimEnd();
    const lineLength = line.length;
    const lineEndChar = line.charAt(lineLength - 1);

    if (
      lineEndChar === ";" ||
      lineEndChar === "," ||
      lineObject.isEmptyOrWhitespace
    ) {
      return;
    }

    let endChar;
    switch (character) {
      case SEMICOLON:
        endChar = ";";
        break;
      case COMMA:
        endChar = ",";
        break;
      default:
        return;
    }

    editor.edit((editBuilder) => {
      editBuilder.insert(new vscode.Position(lineIndex, lineLength), endChar);
    });
  });
}

function activate(context) {
  let semicolonDisposable = vscode.commands.registerCommand(
    "eol-utils.semicolon",
    function () {
      append(SEMICOLON);
    }
  );

  let commaDisposable = vscode.commands.registerCommand(
    "eol-utils.comma",
    function () {
      append(COMMA);
    }
  );

  context.subscriptions.push(semicolonDisposable);
  context.subscriptions.push(commaDisposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
