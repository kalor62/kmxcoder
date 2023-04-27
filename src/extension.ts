import * as vscode from 'vscode';
import VscodeService from './services/vscode.service';
import OpenaiService from './services/openai.service';

export function activate(context: vscode.ExtensionContext) {
   console.log('Congratulations, your extension "kmxcoder" is now active!');

   const openaiService = new OpenaiService;
   const vscodeService = new VscodeService(openaiService);

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

      const options: vscode.QuickPickItem[] = [
         { label: 'Display in New Editor' },
         { label: 'Display as Diff' }
      ];

      const displayType = await vscode.window.showQuickPick(options, { placeHolder: 'Select how to display the results' });

      vscodeService.registerCommand('custom', beforeCode, afterCode, displayType?.label);
   });

   context.subscriptions.push(disposable);
}

export function deactivate() { }
