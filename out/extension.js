"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const vscode_service_1 = require("./services/vscode.service");
function activate(context) {
    console.log('Congratulations, your extension "kmxcoder" is now active!');
    const vscodeService = new vscode_service_1.default;
    // Code Analysis - Review
    let disposable = vscode.commands.registerCommand('kmxcoder.analyze', async () => {
        vscodeService.registerCommand('analyze');
    });
    context.subscriptions.push(disposable);
    // Code Optimization - Refactoring
    disposable = vscode.commands.registerCommand('kmxcoder.optimize', async () => {
        vscodeService.registerCommand('optimize');
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map