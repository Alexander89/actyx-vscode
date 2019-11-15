import * as vscode from 'vscode'

export const getFileName = (editor: vscode.TextEditor): string =>
  editor.document.uri.fsPath.split('/').slice(-1)[0] || ''

export const removeFileExtension = (filename: string): string =>
  filename
    .split('.')
    .slice(0, -1)
    .join('.')

export const toPascalCase = (str: string): string => {
  const [first = '', ...rest] = str
  return `${first.toUpperCase()}${rest.join('')}`
}
export const toDefPascalCase = (def: Definition): string => toPascalCase(def.name)

export const toSemantics = (str: string): string => {
  const [first = '', ...rest] = str
  return `${first.toLowerCase()}${rest.join('')}`
}
////////////////////////

export const consumeSelectedBlock = (
  editor: vscode.TextEditor,
): Promise<readonly [string, TextPos]> => {
  return new Promise(resolve => {
    const selection = editor.selection
    const { start, end } = selection
    const selectionRange = new vscode.Range(start, end)
    const selectedText = editor.document.getText(selectionRange)
    editor
      .edit(edit => {
        edit.delete(selection)
      })
      .then(_ => resolve([selectedText, start]))
  })
}

export type Parameter = {
  name: string
  dataType: string
}
export type Definition = {
  name: string
  parameters: ReadonlyArray<Parameter>
}
export type Definitions = ReadonlyArray<Definition>
export type TextPos = vscode.Position

export const convertToDefinitions = (definition: string): Definitions => {
  return definition
    .replace(/(\r\n)/g, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length && !line.startsWith('//'))
    .map(line => {
      const [name, param = ''] = line
        .replace(')', '')
        .split('(')
        .map(x => x.trim())
      const parameters = param
        .split(',')
        .map(par => par.trim())
        .filter(par => par && par.trim() !== ':')
        .map(params => {
          const [paramName, dataType = 'unknown'] = params.split(':').map(x => x.trim())
          return { name: paramName, dataType: dataType || 'unknown' }
        })
      return { name, parameters }
    })
}
type Type = 'Event' | 'Command'

export const createEnumContent = (def: Definitions): string =>
  def
    .map(x => `${x.name} = "${x.name}"`)
    .map(x => '\t' + x)
    .join(',\n')

export const createEnum = (t: Type, def: Definitions): string =>
  `export enum ${t}Type {\n${createEnumContent(def)}\n}\n`

export const createTypes = (t: Type, defs: Definitions): string => {
  return defs.map(def => createType(t, def)).join('\n') + '\n'
}

const createType = (t: Type, def: Definition): string => {
  const content: ReadonlyArray<any> = [
    `\ttype: ${t}Type.${def.name}`,
    ...def.parameters.map(x => `\t${x.name}: ${x.dataType}`),
  ]
  return `export type ${toDefPascalCase(def)}${t} = {\n${content.join('\n')}\n}`
}
export const createUnionContent = (t: Type, defs: Definitions): string =>
  defs
    .map(toDefPascalCase)
    .map(x => '\t| ' + x + t)
    .join('\n')

export const createUnion = (t: Type, defs: Definitions): string => {
  return `export type ${t} =\n${createUnionContent(t, defs)}\n`
}
