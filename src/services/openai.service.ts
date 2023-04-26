import * as OpenAI from 'openai';
import * as vscode from 'vscode';

export default class OpenaiService {
   extensionName = 'kmxcoder';
   openai: OpenAI.OpenAIApi;
   openaiEngineModel: string;

   constructor() {
      const config = vscode.workspace.getConfiguration(this.extensionName);
      const apiKey = config.get<string>('openaiApiKey');
      const openaiEngineModel = config.get<string>('openaiEngineModel');
      this.openaiEngineModel = typeof (openaiEngineModel) === 'string' ? openaiEngineModel : '';

      const configuration = new OpenAI.Configuration({
         apiKey: apiKey
      });

      this.openai = new OpenAI.OpenAIApi(configuration);
   }

   async createChatCompletion(text: string) {
      try {
         const response = await this.openai.createChatCompletion({
            model: this.openaiEngineModel,
            messages: [{ role: "user", content: text }]
         });

         const suggestions = response?.data?.choices[0]?.message?.content;

         return suggestions;
      } catch (error: any) {
         vscode.window.showErrorMessage('Error: ' + error.message);
      }
   };
}