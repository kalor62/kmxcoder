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

   async registerCommand(commandName: 'analyze' | 'optimize' | 'optimize-file' | 'custom' | 'update-tests', beforeCode?: string, afterCode?: string, displayType?: string, serviceFilePath?: string, testFilePath?: string) {
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

      let text = commandName === 'analyze' ? analyze : commandName === 'optimize' ? optimize : commandName === 'custom' ? custom : '';

      if (commandName === 'optimize-file' || commandName === 'update-tests') {
         if (!serviceFilePath) {
            vscode.window.showErrorMessage('Service file path is required.');
            return;
         }
         const serviceFileContent = await this.readFileContent(serviceFilePath);
         if (commandName === 'update-tests') {
            if (!testFilePath) {
               vscode.window.showErrorMessage('Test file path is required for update-tests command.');
               return;
            }
            const testFileContent = await this.readFileContent(testFilePath);
            text = `The following service class has changed:\n\n${serviceFileContent}\n\nUpdate the existing unit tests accordingly:\n\n${testFileContent}\n\n`;
         } else {
            text = `Optimize the following file content:\n\n${serviceFileContent}\n\n`;
         }
      }

      vscode.window.withProgress({
         location: vscode.ProgressLocation.Notification,
         title: "Running KMX Coder Command...",
         cancellable: true
      }, async (progress, token) => {
         token.onCancellationRequested(() => {
            console.log("User canceled the long running operation");
         });

         progress.report({ increment: 0 });

         const suggestions = await this.openaiService.createChatCompletion(text);

         progress.report({ increment: 50 });

         testFilePath = testFilePath ? testFilePath : '';

         if (typeof (suggestions) === 'string') {
            if (commandName === 'update-tests') {
               const originalUri = vscode.Uri.file(testFilePath);
               const modifiedUri = await this.writeStringToTempFile(suggestions, 'modified-tests.ts');

               await vscode.commands.executeCommand('vscode.diff', originalUri, modifiedUri, 'Your Original File vs Modified Tests');
            } else if (commandName === 'optimize-file') {
               const originalUri = vscode.Uri.file(serviceFilePath ? serviceFilePath : '');
               const modifiedUri = await this.writeStringToTempFile(suggestions, 'optimized-file.ts');

               await vscode.commands.executeCommand('vscode.diff', originalUri, modifiedUri, 'Your Original File vs Optimized File');
            } else {
               if (commandName === 'optimize' || displayType === 'Display as Diff') {
                  this.openDiffBetweenStrings(code, suggestions, 'Your Code', 'Optimized Code');
               } else {
                  this.openInUntitled(suggestions, editor.document.languageId);
               }
            }
         }

         progress.report({ increment: 100 });
      });
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

   async readFileContent(filePath: string): Promise<string> {
      return new Promise((resolve, reject) => {
         fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
               reject(err);
            } else {
               resolve(data);
            }
         });
      });
   }

   async writeFileContent(filePath: string, content: string): Promise<void> {
      return new Promise((resolve, reject) => {
         fs.writeFile(filePath, content, 'utf8', (err) => {
            if (err) {
               reject(err);
            } else {
               resolve();
            }
         });
      });
   }
}
