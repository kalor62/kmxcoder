import * as vscode from 'vscode';
import OpenaiService from './openai.service';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export default class VscodeService {
   openaiService: OpenaiService;

   constructor(openaiService: OpenaiService) {
      this.openaiService = openaiService;
   }

   async openInUntitled(content: string, language?: string) {
      const document = await vscode.workspace.openTextDocument({
         language,
         content,
      });

      vscode.window.showTextDocument(document);
   }

   async registerCommand(commandName: 'analyze' | 'optimize' | 'custom', beforeCode?: string, afterCode?: string, displayType?: string) {
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
      const custom = `${beforeCode}\n\n${code}\n\n${afterCode}`;

      const text = commandName === 'analyze' ? analyze : commandName === 'optimize' ? optimize : commandName === 'custom' ? custom : '';

      const suggestions = await this.openaiService.createChatCompletion(text);

      if (typeof (suggestions) === 'string') {
         if (commandName === 'optimize' || displayType === 'Display as Diff') {
            this.openDiffBetweenStrings(code, suggestions, 'Your Code', 'Optimized Code');
         } else {
            this.openInUntitled(suggestions, editor.document.languageId);
         }
      }
   }

   async writeStringToTempFile(content: string, filename: string): Promise<vscode.Uri> {
      return new Promise((resolve, reject) => {
         const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vscode-diff-'));
         const tempFile = path.join(tempDir, filename);
         fs.writeFile(tempFile, content, (err) => {
            if (err) {
               reject(err);
            } else {
               resolve(vscode.Uri.file(tempFile));
            }
         });
      });
   }

   async openDiffBetweenStrings(left: string, right: string, leftTitle: string, rightTitle: string) {
      const leftUri = await this.writeStringToTempFile(left, 'left.txt');
      const rightUri = await this.writeStringToTempFile(right, 'right.txt');

      await vscode.commands.executeCommand('vscode.diff', leftUri, rightUri, `${leftTitle} ↔ ${rightTitle}`);
   }
}