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

   context.subscriptions.push(disposable);
}

export function deactivate() { }
