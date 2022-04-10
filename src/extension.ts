'use strict';

import * as vscode from 'vscode';
import * as changeCase from 'change-case';
import util from './util';
import { ChangeCaseType } from './typing';

export function activate(context: vscode.ExtensionContext) {
    // toggle state状态切换
    const disposable = vscode.commands.registerCommand('extension.toggleState', async function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;

            // Get the word within the selection
            const word = document.getText(selection);
            const reverseState = util.toggleState(word);

            await vscode.env.clipboard.writeText(reverseState);
            // await vscode.commands.executeCommand("actions.find");
            // await vscode.commands.executeCommand("editor.action.selectAll");
            // await vscode.commands.executeCommand("execPaste");
        }
    });

    const disposable2 = vscode.commands.registerCommand('extension.viewChange', async function () {
        if(!vscode.workspace.rootPath) {
            // notify the user nothing can be done without open folder
            vscode.window.showErrorMessage('没有打开的文件夹');
            return;            
        }

        // Get the current text editor
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            // notify the user nothing can be done without active editor
            vscode.window.showErrorMessage('没有打开的文件');
            return;
        }

        const doc = editor.document;

        if(doc.isUntitled) {
            // notify the user nothing can be done when file isn't saved yet
            vscode.window.showErrorMessage('当前打开的文件没保存');
            return;
        }

        const position = editor.selection.active;
        const curLineIndex = position.line;

        await vscode.env.clipboard.writeText(String(curLineIndex + 1));
        await vscode.commands.executeCommand("git.openChange");
        await vscode.commands.executeCommand("workbench.action.gotoLine");
        await vscode.commands.executeCommand("execPaste");


        // if (editor) {
        //     const position = editor.selection.active;
    
        //     const newPositionStart = position.with(position.line, 0);
        //     const newPositionEnd = position.with(position.line, 20);
        //     const newSelection = new vscode.Selection(newPositionStart, newPositionEnd);
        //     editor.selection = newSelection;

        // }
    });

    // change case修改
    // const disposable2 = vscode.commands.registerCommand('extension.changeCase', async function () {
    //     const editor = vscode.window.activeTextEditor;

    //     if (editor) {
    //         const document = editor.document;
    //         const selection = editor.selection;

    //         const word = document.getText(selection);
    //         const options = ['1_camel', '2_constant', '3_kebab', '4_pascal', '5_lower', '6_upper'];

    //         const changeCaseType = await vscode.window.showQuickPick(
    //             options,
    //             {
    //                 canPickMany: false,
    //                 ignoreFocusOut: true,
    //                 matchOnDescription: true,
    //                 matchOnDetail: true,
    //                 placeHolder: '请选择一个转换的类型',
    //             });
    //         const result = util.handleChangeCase(word, changeCaseType as ChangeCaseType);
            
    //         if (changeCaseType) {
    //             editor.edit(editBuilder => {
    //                 editBuilder.replace(selection, result);
    //             });
    //         }
    //     }
    // });

    // import的引入方式[开发组件使用]
    const disposable3 = vscode.commands.registerCommand('extension.importGrammer1', async function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        const pathOrModuleName = await vscode.env.clipboard.readText();

        if (pathOrModuleName) {
            const pascalName = changeCase.pascalCase(pathOrModuleName);
            const pathName = changeCase.paramCase(pathOrModuleName);
            const insertStr = `import ${pascalName} from '../${pathName}';`;
    
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, insertStr);
                });
            }
        }
    });

    // import的引入方式[开发容器使用]
    const disposable4 = vscode.commands.registerCommand('extension.importGrammer2', async function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        const pathOrModuleName = await vscode.env.clipboard.readText();
        const pathName = changeCase.paramCase(pathOrModuleName);

        if (pathOrModuleName) {
            const pascalName = changeCase.pascalCase(pathOrModuleName);
            const insertStr = `import ${pascalName} from '../../container/${pathName}';`;
    
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, insertStr);
                });
            }
        }
    });

    // import的引入方式[type]
    const disposable5 = vscode.commands.registerCommand('extension.importGrammer3', async function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        const typeName = await vscode.env.clipboard.readText();

        if (typeName) {
            const insertStr = `import { ${typeName} } from '../../types';`;
    
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, insertStr);
                });
            }
        }
    });

    // import的引入方式[antd]
    const disposable6 = vscode.commands.registerCommand('extension.importGrammer4', async function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        const cmponentName = await vscode.env.clipboard.readText();

        if (cmponentName) {
            const insertStr = `import { ${cmponentName} } from 'antd';`;
    
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, insertStr);
                });
            }
        }
    });

    // import的引入方式[@mlamp/darwin-lampstand]
    const disposable7 = vscode.commands.registerCommand('extension.importGrammer5', async function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        const cmponentName = await vscode.env.clipboard.readText();

        if (cmponentName) {
            const insertStr = `import { ${cmponentName} } from '@mlamp/darwin-lampstand';`;
    
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, insertStr);
                });
            }
        }
    });

    // import的引入方式[icon]
    const disposable8 = vscode.commands.registerCommand('extension.importGrammer6', async function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        const iconName = await vscode.env.clipboard.readText();

        if (iconName) {
            const insertStr = `import { ${iconName} } from '@ant-design/icons';`;
    
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, insertStr);
                });
            }
        }
    });

    // import的引入方式[icon-diy]
    const disposable9 = vscode.commands.registerCommand('extension.importGrammer7', async function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        const iconClazz = await vscode.env.clipboard.readText();

        if (iconClazz) {
            const insertStr = `import IconFont from '@/components/iconfont';\n<IconFont type="${iconClazz}" className="todo" />`;
    
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, insertStr);
                });
            }
        }
    });

    // import的引入方式[quokkajs]
    const disposable10 = vscode.commands.registerCommand('extension.importGrammer8', async function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        const packageName = await vscode.env.clipboard.readText();
        const camelName = changeCase.camelCase(packageName);

        if (camelName) {
            const insertStr = `import ${camelName} from '${packageName}';`;
    
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, insertStr);
                });
            }
        }
    });

    // require的引入方式[给quokkajs使用]
    const disposable11 = vscode.commands.registerCommand('extension.requireGrammer', async function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        const pathOrModuleName = await vscode.env.clipboard.readText();

        if (pathOrModuleName) {
            const camelName = changeCase.camelCase(pathOrModuleName);
            const insertStr = `var ${camelName} = require('${pathOrModuleName}');`;
    
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, insertStr);
                });
            }
        }
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable2);
    context.subscriptions.push(disposable3);
    context.subscriptions.push(disposable4);
    context.subscriptions.push(disposable5);
    context.subscriptions.push(disposable6);
    context.subscriptions.push(disposable7);
    context.subscriptions.push(disposable8);
    context.subscriptions.push(disposable9);
    context.subscriptions.push(disposable10);
    context.subscriptions.push(disposable11);
}
