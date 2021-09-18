const vscode = require('vscode');

function selectLines(editor) {
	editor.selections = editor.selections.map(s => {
		let startLine = s.start.line;
		let endLine = s.end.line;
		let endChar = s.end.character;
		if (startLine > endLine) {
			[startLine, endLine] = [endLine, startLine];
			endChar = s.start.character;
		}
		let startPos = new vscode.Position(startLine, 0);
		if (endLine > startLine && endChar == 0) {
			endLine--;
		}
		let endPos = new vscode.Position(
			endLine,
			editor.document.lineAt(endLine).range.end.character
		);
		return new vscode.Selection(startPos, endPos);
	});
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Extension "NoPyPrompt" is now active.');

	let disposable = vscode.commands.registerTextEditorCommand('nopyprompt.togglePrompts', function(editor) {
		if (editor) {
			const document = editor.document;
			selectLines(editor);
			
			editor.edit(editBuilder => {
				editor.selections.forEach(selection => {
					let code = document.getText(selection);
					let lines = code.split("\n");
					let hasPrompts = false;
					for (let i = 0; i < lines.length; i++) {
						let line = lines[i];
						if (line.trimEnd() == ">>>" || line.trimEnd() == "..." || line.startsWith(">>> ") || line.startsWith("... ")) {
							hasPrompts = true;
						}
					}
					let prompt = ">>> ";
					let afterOutput = false;
					for (let i = 0; i < lines.length; i++) {
						let line = lines[i];
						if (hasPrompts) {
							if (line.startsWith(">>> ") || line.trimEnd() == ">>>") {
								lines[i] = (afterOutput ? "\n" : "") + line.substr(4, line.length - 4);
								afterOutput = false;
							} else if (line.startsWith("... ") || line.trimEnd() == "...") {
								lines[i] = line.substr(4, line.length - 4);
							} else {
								lines[i] = "#> " + line;
								afterOutput = true;
							}
						} else {
							if (line.trim() == "" && afterOutput) {
									lines[i] = "\x00";
									prompt = ">>> ";
									afterOutput = false;
							} else if (line.startsWith("#> ")) {
								lines[i] = line.substr(3, line.length - 3);
								prompt = ">>> ";
								afterOutput = true;
							} else {
								if (line.trim() != "" && !line.startsWith(" ") && !line.startsWith("\t")) {
									prompt = ">>> ";
								}
								lines[i] = prompt + line;
								if (line.trim() == "") {
									prompt = ">>> ";
								} else if (i + 1 < lines.length && lines[i + 1].trim() != "") {
									prompt = "... ";
								}
								afterOutput = false;
							}
						}
					}

					let newCode = lines.filter(line => { return line != "\x00";}).join("\n");
					editBuilder.replace(selection, newCode);
				});
			});
		}
	});
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
