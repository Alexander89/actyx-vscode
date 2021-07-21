import * as vscode from 'vscode'
import { consumeSelectedBlock } from './common'
import { convertToDefinitions } from './definitionParser'
import { buildEvents, buildEventsV2, buildEventsV3 } from './events'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
  const eventsCommand = vscode.commands.registerCommand('actyx-code-gen.events', async () => {
    // The code you place here will be executed every time your command is executed
    const editor = vscode.window.activeTextEditor
    if (editor && !editor.selection.isEmpty) {
      const [definition, position] = await consumeSelectedBlock(editor)
      const events = convertToDefinitions(definition)
      await buildEvents(editor, position, events)
    } else {
      vscode.window.showInformationMessage('Select your events before execute this extension')
    }
  })
  context.subscriptions.push(eventsCommand)

  const eventsEmitterCommand = vscode.commands.registerCommand(
    'actyx-code-gen.events-emitter',
    async () => {
      // The code you place here will be executed every time your command is executed
      const editor = vscode.window.activeTextEditor
      if (editor && !editor.selection.isEmpty) {
        const [definition, position] = await consumeSelectedBlock(editor)
        const events = convertToDefinitions(definition)
        await buildEventsV2(editor, position, events)
      } else {
        vscode.window.showInformationMessage('Select your events before execute this extension')
      }
    },
  )
  context.subscriptions.push(eventsEmitterCommand)

  const eventBlockEmitterCommand = vscode.commands.registerCommand(
    'actyx-code-gen.events-emitter-blocked',
    async () => {
      // The code you place here will be executed every time your command is executed
      const editor = vscode.window.activeTextEditor
      if (editor && !editor.selection.isEmpty) {
        const [definition, position] = await consumeSelectedBlock(editor)
        const events = convertToDefinitions(definition)
        await buildEventsV3(editor, position, events)
      } else {
        vscode.window.showInformationMessage('Select your events before execute this extension')
      }
    },
  )
  context.subscriptions.push(eventBlockEmitterCommand)
}

// this method is called when your extension is deactivated
export function deactivate(): void {
  // no deactivate required
}
