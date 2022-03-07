'use strict';

import * as vscode from 'vscode';
import util from './util';
import { ChangeCaseType } from './typing';

export function activate(context: vscode.ExtensionContext) {
    // hook state状态切换
    const disposable = vscode.commands.registerCommand('extension.hookState', async function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;

            // Get the word within the selection
            const word = document.getText(selection);
            const options = util.handleHookState(word);

            // 组件类别
            const hookState = await vscode.window.showQuickPick(
                options,
                {
                    canPickMany: false,
                    ignoreFocusOut: true,
                    matchOnDescription: true,
                    matchOnDetail: true,
                    placeHolder: '请选择一个转换的类型',
                });
            
            if (hookState) {
                if (hookState.includes(' ↑')) {
                    const searchText = hookState.replace(' ↑', '');
                    await vscode.env.clipboard.writeText(searchText);
                    await vscode.commands.executeCommand("actions.find");
                    await vscode.commands.executeCommand("editor.action.selectAll");
                    await vscode.commands.executeCommand("execPaste");
                    await vscode.commands.executeCommand("search.action.focusPreviousSearchResult");
                } else if (hookState.includes(' ↓')) {
                    const searchText = hookState.replace(' ↓', '');
                    await vscode.env.clipboard.writeText(searchText);
                    await vscode.commands.executeCommand("actions.find");
                    await vscode.commands.executeCommand("editor.action.selectAll");
                    await vscode.commands.executeCommand("execPaste");
                    await vscode.commands.executeCommand("search.action.focusNextSearchResult");
                } else {
                    editor.edit(editBuilder => {
                        editBuilder.replace(selection, hookState);
                    });
                }
            }
        }
    });

    // change case修改
    const disposable2 = vscode.commands.registerCommand('extension.changeCase', async function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;

            // Get the word within the selection
            const word = document.getText(selection);
            const options = ['1_camel', '2_constant', '3_kebab', '4_pascal', '5_lower', '6_upper'];

            // 组件类别
            const changeCaseType = await vscode.window.showQuickPick(
                options,
                {
                    canPickMany: false,
                    ignoreFocusOut: true,
                    matchOnDescription: true,
                    matchOnDetail: true,
                    placeHolder: '请选择一个转换的类型',
                });
            const result = util.handleChangeCase(word, changeCaseType as ChangeCaseType);
            
            if (changeCaseType) {
                editor.edit(editBuilder => {
                    editBuilder.replace(selection, result);
                });
            }
        }
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable2);
}
