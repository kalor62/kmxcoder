import * as vscode from 'vscode';
import VscodeService from './services/vscode.service';

export function activate(context: vscode.ExtensionContext) {
   console.log('Congratulations, your extension "kmxcoder" is now active!');

   const vscodeService = new VscodeService;

   // Code Analysis - Review
   let disposable = vscode.commands.registerCommand('kmxcoder.analyze', async () => {
      vscodeService.registerCommand('analyze');
   });

   context.subscriptions.push(disposable);

   // Code Optimization - Refactoring
   disposable = vscode.commands.registerCommand('kmxcoder.optimize', async () => {
      vscodeService.registerCommand('optimize');
   });

   // Custom Command - Writing Code, Optimizing, Analysing, Anything...
   disposable = vscode.commands.registerCommand('kmxcoder.custom', async () => {
      const beforeCode = await vscode.window.showInputBox({ title: 'Prompt before code' });
      const afterCode = await vscode.window.showInputBox({ title: 'Prompt after code' });

      vscodeService.registerCommand('custom', beforeCode, afterCode);
   });

   context.subscriptions.push(disposable);
}

export function deactivate() { }
