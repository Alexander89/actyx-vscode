import * as vscode from 'vscode'
import { createEmitters, createEmittersV2, createTypes, createUnion, eol } from './common'
import { Definitions, TextPos } from './definitionParser'

export const buildEvents = async (editor: vscode.TextEditor, pos: TextPos, events: Definitions) => {
  await editor.edit((edit) => {
    const n = eol(editor.document)
    edit.insert(
      pos,
      createTypes('Event', events) + createUnion('Event', events) + n + createEmitters(events),
    )
  })
}
export const buildEventsV2 = async (
  editor: vscode.TextEditor,
  pos: TextPos,
  events: Definitions,
) => {
  await editor.edit((edit) => {
    const n = eol(editor.document)
    edit.insert(
      pos,
      createTypes('Event', events) +
        createUnion('Event', events) +
        n +
        createEmittersV2(editor.document, events),
    )
  })
}
