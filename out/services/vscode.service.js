"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const openai_service_1 = require("./openai.service");
const fs = require("fs");
const os = require("os");
const path = require("path");
class VscodeService {
    constructor() {
        this.openaiService = new openai_service_1.default;
    }
    async openInUntitled(content, language) {
        const document = await vscode.workspace.openTextDocument({
            language,
            content,
        });
        vscode.window.showTextDocument(document);
    }
    async registerCommand(commandName) {
        vscode.window.showInformationMessage('Running KMX Coder Command...');
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }
        const document = editor.document;
        const code = document.getText(editor.selection);
        const analyze = `Analyze the following code and provide suggestions and code review, suggestions should be comments over the line of code that it applies to:\n\n${code} `;
        const optimize = `Optimize the following code:\n\n${code}\n\n`;
        const text = commandName === 'analyze' ? analyze : commandName === 'optimize' ? optimize : '';
        const suggestions = await this.openaiService.createChatCompletion(text);
        if (typeof (suggestions) === 'string') {
            if (commandName === 'analyze') {
                this.openInUntitled(suggestions, editor.document.languageId);
            }
            else {
                this.openDiffBetweenStrings(code, suggestions, 'Your Code', 'Optimized Code');
            }
        }
    }
    async writeStringToTempFile(content, filename) {
        return new Promise((resolve, reject) => {
            const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vscode-diff-'));
            const tempFile = path.join(tempDir, filename);
            fs.writeFile(tempFile, content, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(vscode.Uri.file(tempFile));
                }
            });
        });
    }
    async openDiffBetweenStrings(left, right, leftTitle, rightTitle) {
        const leftUri = await this.writeStringToTempFile(left, 'left.txt');
        const rightUri = await this.writeStringToTempFile(right, 'right.txt');
        await vscode.commands.executeCommand('vscode.diff', leftUri, rightUri, `${leftTitle} ↔ ${rightTitle}`);
    }
}
exports.default = VscodeService;
//# sourceMappingURL=vscode.service.js.map