import * as vscode from 'vscode'
import { Definition, Definitions, TextPos, toDefPascalCase } from './definitionParser'

const emitterType = 'type Emitter<E> = (tags: Tags<E>, event: E) => any'

export const getFileName = (editor: vscode.TextEditor): string =>
  editor.document.uri.fsPath.split(/[\/\\]/).slice(-1)[0] || ''

export const removeFileExtension = (filename: string): string =>
  filename.split('.').slice(0, -1).join('.')

export const toPascalCase = (str: string): string => {
  const [first = '', ...rest] = str
  return `${first.toUpperCase()}${rest.join('')}`
}

const getLastSeparator = (path: string): number => {
  const lastSl = path.lastIndexOf('/')
  const lastBackSl = path.lastIndexOf('\\')
  return Math.max(lastSl, lastBackSl)
}

export const extractEditorFileInfo = (editor: vscode.TextEditor) => {
  const file = editor.document.uri.toString()
  const relFilePath = vscode.workspace.asRelativePath(editor.document.uri)
  const wsPath = vscode.workspace.getWorkspaceFolder(editor.document.uri)!.uri.toString()

  const lastSeparatorFilePath = getLastSeparator(relFilePath)
  const lastSeparator = getLastSeparator(file)

  const relPath = relFilePath.substr(0, lastSeparatorFilePath)
  const fileName = file.substr(lastSeparator + 1)
  const [fishName] = fileName.split('.')

  const res = {
    uri: editor.document.uri,
    fileName,
    fishName,
    relFilePath,
    file,
    relPath,

    path: wsPath + '/' + relPath,
    pathUri: vscode.Uri.parse(wsPath + '/' + relPath),
    isRoot: lastSeparatorFilePath === -1,
  }
  return res
}

export const extractStringFileInfo = (file: string, editor: vscode.TextEditor) => {
  const currentFile = extractEditorFileInfo(editor)
  return vscode.Uri.parse(currentFile.path + '/' + file)
}

export const consumeSelectedBlock = (
  editor: vscode.TextEditor,
): Promise<readonly [string, TextPos]> => {
  return new Promise((resolve) => {
    const selection = editor.selection
    const { start, end } = selection
    const lineLength = editor.document.lineAt(end.line).text.length
    const selectionRange = new vscode.Range(start.line, 0, end.line, lineLength)
    const selectedText = editor.document.getText(selectionRange)
    editor
      .edit((edit) => {
        edit.delete(selectionRange)
      })
      .then((_) => resolve([selectedText, start]))
  })
}

type Type = 'Event' | 'Command'

export const createEnumContent = (def: Definitions): string =>
  def
    .map((x) => `${x.name} = '${x.name}'`)
    .map((x) => '  ' + x)
    .join(',\n')

export const createEnum = (t: Type, def: Definitions): string =>
  `export enum ${t}Type {\n${createEnumContent(def)},\n}\n`

export const createTypes = (t: Type, defs: Definitions): string =>
  defs.map((def) => createType(t, def)).join('\n') + '\n'

const createType = (t: Type, def: Definition): string => {
  const content: ReadonlyArray<any> = [
    `  eventType: '${def.name}'`,
    ...def.parameters.map((x) => `  ${x.name}: ${x.dataType}`),
  ]
  return `export type ${toDefPascalCase(def)}${t} = {\n${content.join('\n')}\n}`
}
export const createUnionContent = (t: Type, defs: Definitions): string =>
  defs
    .map(toDefPascalCase)
    .map((x) => '  | ' + x + t)
    .join('\n')

const createEmitter = (def: Definition): string => {
  const param = def.parameters.map((x) => `${x.name}: ${x.dataType}`).join(', ')
  const name = `const emit${toDefPascalCase(def)} = (pond: Pond, ${param}): PendingEmission => `
  const emit = `  pond.emit(tag, {
    eventType: '${def.name}',
${def.parameters.map((x) => `    ${x.name}`).join(',\n')}
  })`
  return `${name}\n${emit}`
}

const createEmitterV2 = (def: Definition): string => {
  const param = def.parameters.map((x) => `${x.name}: ${x.dataType}`).join(',\n  ')
  const name = `const emit${toDefPascalCase(def)} = <EM extends Emitter<${toDefPascalCase(
    def,
  )}Event>>(
  emit: EM,
  ${param}
): ReturnType<EM> => `
  const emit = `  emit(tag, {
    eventType: '${def.name}',
${def.parameters.map((x) => `    ${x.name}`).join(',\n')}
  })`
  return `${name}\n${emit}`
}

export const createUnion = (t: Type, defs: Definitions): string =>
  `export type ${t} =\n${createUnionContent(t, defs)}\n`

export const createEmitters = (defs: Definitions): string => defs.map(createEmitter).join('\n\n')
export const createEmittersV2 = (document: vscode.TextDocument, defs: Definitions): string =>
  !document.getText().includes(emitterType)
    ? defs.map(createEmitterV2).join('\n\n')
    : emitterType + '\n\n' + defs.map(createEmitterV2).join('\n\n')

export const eol = (document: vscode.TextDocument) =>
  document.eol === vscode.EndOfLine.LF ? '\n' : '\r\n'
