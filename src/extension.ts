import * as vscode from 'vscode';
import VscodeService from './services/vscode.service';
import OpenaiService from './services/openai.service';
import path from 'path';

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

   // Code File Optimization - Refactoring
   disposable = vscode.commands.registerCommand('kmxcoder.optimize-file', async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
         vscode.window.showErrorMessage('No active editor found.');
         return;
      }
      const filePath = activeEditor.document.uri.fsPath;
      vscodeService.registerCommand('optimize-file', undefined, undefined, undefined, filePath);
   });

   context.subscriptions.push(disposable);

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

   // Update Tests Command - Update unit tests based on changes in service class
   disposable = vscode.commands.registerCommand('kmxcoder.update-tests', async () => {
      const files = await vscode.workspace.findFiles('**/*');
      const fileItems: vscode.QuickPickItem[] = files.map(file => ({ label: file.fsPath }));

      const serviceFile = await vscode.window.showQuickPick(fileItems, { placeHolder: 'Select the service file' });
      const testFile = await vscode.window.showQuickPick(fileItems, { placeHolder: 'Select the test file' });

      if (!serviceFile || !testFile) {
         vscode.window.showErrorMessage('Service file and test file are required.');
         return;
      }

      vscodeService.registerCommand('update-tests', undefined, undefined, undefined, serviceFile.label, testFile.label);
   });

   context.subscriptions.push(disposable);


}

export function deactivate() { }
