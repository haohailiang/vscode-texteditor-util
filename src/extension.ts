'use strict';

import * as vscode from 'vscode';
import * as changeCase from 'change-case';
import * as fg from 'fast-glob';
import * as fs from 'fs';
import util from './util';
import { QuickPickItem } from './typing';

export function activate(context: vscode.ExtensionContext) {
    // toggle state状态切换
    const toggleState = vscode.commands.registerCommand('texteditor-util.toggleState', async function () {
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

    const generateState1 = vscode.commands.registerCommand('texteditor-util.generateState1', async function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const word = await vscode.env.clipboard.readText();
            const [first, second] = util.generateState(word);
            const resultStr = `const [${first}, ${second}] = React.useState<Todo>(todo);`;

            editor.edit(editBuilder => {
                editBuilder.insert(editor.selection.active, resultStr);
            });
        }
    });
    const generateState2 = vscode.commands.registerCommand('texteditor-util.generateState2', async function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const word = await vscode.env.clipboard.readText();
            const [first, second] = util.generateState(word);
            const resultStr = `const [${first}, ${second}] = React.useState(todo);`;

            editor.edit(editBuilder => {
                editBuilder.insert(editor.selection.active, resultStr);
            });
        }
    });

    // const disposable2 = vscode.commands.registerCommand('texteditor-util.viewChange', async function () {
    //     if(!vscode.workspace.rootPath) {
    //         // notify the user nothing can be done without open folder
    //         vscode.window.showErrorMessage('没有打开的文件夹');
    //         return;            
    //     }

    //     // Get the current text editor
    //     const editor = vscode.window.activeTextEditor;
    //     if (!editor) {
    //         // notify the user nothing can be done without active editor
    //         vscode.window.showErrorMessage('没有打开的文件');
    //         return;
    //     }

    //     const doc = editor.document;

    //     if(doc.isUntitled) {
    //         // notify the user nothing can be done when file isn't saved yet
    //         vscode.window.showErrorMessage('当前打开的文件没保存');
    //         return;
    //     }

    //     const position = editor.selection.active;
    //     const curLineIndex = position.line;

    //     await vscode.env.clipboard.writeText(String(curLineIndex + 1));
    //     await vscode.commands.executeCommand("git.openChange");
    //     await vscode.commands.executeCommand("workbench.action.gotoLine");
    //     await vscode.commands.executeCommand("execPaste");


    //     // if (editor) {
    //     //     const position = editor.selection.active;
    
    //     //     const newPositionStart = position.with(position.line, 0);
    //     //     const newPositionEnd = position.with(position.line, 20);
    //     //     const newSelection = new vscode.Selection(newPositionStart, newPositionEnd);
    //     //     editor.selection = newSelection;

    //     // }
    // });

    // change case修改
    // const disposable2 = vscode.commands.registerCommand('texteditor-util.changeCase', async function () {
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
    const importGrammer1 = vscode.commands.registerCommand('texteditor-util.importGrammer1', async function () {
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
    const importGrammer2 = vscode.commands.registerCommand('texteditor-util.importGrammer2', async function () {
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
    const importGrammer3 = vscode.commands.registerCommand('texteditor-util.importGrammer3', async function () {
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
    const importGrammer4 = vscode.commands.registerCommand('texteditor-util.importGrammer4', async function () {
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
    const importGrammer5 = vscode.commands.registerCommand('texteditor-util.importGrammer5', async function () {
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
    const importGrammer6 = vscode.commands.registerCommand('texteditor-util.importGrammer6', async function () {
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
    const importGrammer7 = vscode.commands.registerCommand('texteditor-util.importGrammer7', async function () {
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
    const importGrammer8 = vscode.commands.registerCommand('texteditor-util.importGrammer8', async function () {
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
    const requireGrammer = vscode.commands.registerCommand('texteditor-util.requireGrammer', async function () {
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

    // 开启emmet的功能
    const enableEmmet = vscode.commands.registerCommand("texteditor-util.emmet.enable", () => {
        vscode.workspace.getConfiguration("emmet").update("showExpandedAbbreviation", 'always', true);
        vscode.window.showInformationMessage('emment功能开启');
    });

    // 关闭emmet的功能
    const disableEmmet = vscode.commands.registerCommand("texteditor-util.emmet.disable", () => {
        vscode.workspace.getConfiguration("emmet").update("showExpandedAbbreviation", 'never', true);
        vscode.window.showInformationMessage('emment功能关闭');
    });

    // 可选链操作符-1[剪切板是链式操作符, 选中的是Vdom文本]
    const optionalChainingOperator1 = vscode.commands.registerCommand('texteditor-util.optionalChainingOperator-1', async function () {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const variableNames = await vscode.env.clipboard.readText();
            const vdom = document.getText(selection);
            const [chainingOperatorsOptions, nVdom] = util.getChainingOperators(vdom, variableNames!.split(/\s+/));

            if (chainingOperatorsOptions?.length > 0) {
                const operatorsDom  = util.getOperatorsDom1(chainingOperatorsOptions);
                const prevSpaceNums = vscode?.window?.activeTextEditor?.selection?.active?.character ?? 0;
                const prevSpace = Array.from({ length: prevSpaceNums }, () => ' ').join('');
                let result = `{
    ${operatorsDom} && (
        ${nVdom}
    )
}`;
                result = result.split('\n').map((line, index) => {
                    if (index === 0) {
                        return line;
                    }
                    return prevSpace + line;
                }).join('\n');

                editor.edit(editBuilder => {
                    editBuilder.replace(selection, result);
                });
            }
        }
    });

    // 可选链操作符-2[剪切板是链式操作符, 选中的是Vdom文本]
    const optionalChainingOperator2 = vscode.commands.registerCommand('texteditor-util.optionalChainingOperator-2', async function () {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const variableNames = await vscode.env.clipboard.readText();
            const vdom = document.getText(selection);
            const [chainingOperatorsOptions, nVdom] = util.getChainingOperators(vdom, variableNames!.split(/\s+/));

            if (chainingOperatorsOptions?.length > 0) {
                const operatorsDom  = util.getOperatorsDom2(chainingOperatorsOptions);
                const prevSpaceNums = vscode?.window?.activeTextEditor?.selection?.active?.character ?? 0;
                const prevSpace = Array.from({ length: prevSpaceNums }, () => ' ').join('');
                let result = `{
    ${operatorsDom} && (
        ${nVdom}
    )
}`;
                result = result.split('\n').map((line, index) => {
                    if (index === 0) {
                        return line;
                    }
                    return prevSpace + line;
                }).join('\n');

                editor.edit(editBuilder => {
                    editBuilder.replace(selection, result);
                });
            }
        }
    });

    // 可选链操作符-3[剪切板是链式操作符, 选中的是Vdom文本]
    const optionalChainingOperator3 = vscode.commands.registerCommand('texteditor-util.optionalChainingOperator-3', async function () {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const variableName = await vscode.env.clipboard.readText();
            const vdom = document.getText(selection);
            if(variableName) {
                const [chainingOperatorsOption, nVdom] = util.getChainingOperators3(vdom, variableName);
    
                if (chainingOperatorsOption) {
                    const result = nVdom.replace(chainingOperatorsOption, chainingOperatorsOption + ` ?? '-'`);
    
                    editor.edit(editBuilder => {
                        editBuilder.replace(selection, result);
                    });
                }
            }
        }
    });

    // 从html文件定位到组件index.tsx文件 [html 2 component]
    const html_2Component = vscode.commands.registerCommand('texteditor-util.html_2Component', async function () {
        let rawClazz = await vscode.env.clipboard.readText();
        rawClazz = rawClazz.replace(/[\\+\\]/g, 'a'); // 特殊字符转化
        rawClazz = rawClazz.replace(/\./g, ''); // 类名进行转化
        const rawClazzArr = rawClazz.split(/\s+/);
        const rawClazzArrLen = rawClazzArr.length;
        let localClazz = '';
        if (rawClazzArrLen > 1) {
            localClazz = rawClazzArr[rawClazzArrLen - 1];
        }
        let [elementsClass] = rawClazzArr;
        const tailReg1 = /-scss-index_[a-zA-Z0-9-_]+$/g; // 带scss文件夹
        const tailReg2 = /-index_[a-zA-Z0-9-_]+$/g; // 不带scss文件夹
        // 都过滤成标准的不带scss的文件夹
        elementsClass = elementsClass.replace(tailReg1, '').replace(tailReg2, '');

        const reg = /(?<clazzName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)__(?<partStr1>(([a-zA-Z0-9]+-)*([a-zA-Z0-9]+)))/u;
        const result = reg.exec(elementsClass);
        const { clazzName, partStr1 } = result?.groups ?? {};
        const part1NameArr = (partStr1 || '').split('-');
        const allPaths = util.getAllMaybePaths(part1NameArr);
        const partAllMaybePathArr = allPaths.map(v => v + '/index.tsx');

        if (!clazzName) {
            vscode.window.showErrorMessage('类名为空');
            return;
        }

        const { workspaceFolders } = vscode.workspace;
        if (workspaceFolders && workspaceFolders.length > 0) {
            const maybeComponentPaths = partAllMaybePathArr.map(v => workspaceFolders[0].uri.path + v);
            const allFiles = fg.sync(maybeComponentPaths, { dot: true, ignore: ["**/node_modules"] });
            const items = allFiles.map(util.generateQuickPickItem);

            if (items.length) {
                const placeholderText = `Element面板对应的组件`;
                let selectedPath: QuickPickItem | undefined = items[0];

                if (items.length > 1) {
                    selectedPath = await vscode.window
                    .showQuickPick(items, {
                        placeHolder: placeholderText,
                        matchOnDescription: true
                    });

                    if (!selectedPath) {
                        vscode.window.showErrorMessage('请选择一个路径');
                        return;
                    }
                }

                await util.open(selectedPath);
                const fileContent = fs.readFileSync(selectedPath.url.path).toString() || '';
                const camelCaseClazzName = changeCase.camelCase(clazzName);
                const altSearchText11 = `styles\\['${clazzName}'\\]`;
                const altSearchText12 = `styles\\["${clazzName}"\\]`;
                const altSearchText2 = `styles.${camelCaseClazzName}`;
                let searchText = '';
                const isFindSearch11 = new RegExp(altSearchText11, 'g').test(fileContent);
                const isFindSearch12 = new RegExp(altSearchText12, 'g').test(fileContent);
                const isFindSearch2 = new RegExp(altSearchText2, 'g').test(fileContent);

                if (isFindSearch11) {
                    searchText = `styles['${clazzName}']`;
                } else if (isFindSearch12) {
                    searchText = `styles["${clazzName}"]`;
                } else if (isFindSearch2) {
                    searchText = altSearchText2;
                } else {
                    vscode.window.showErrorMessage('在路径中没有找到匹配的关键词');
                    return;
                }

                searchText = util.findExactClazz(localClazz, searchText, fileContent);

                await vscode.env.clipboard.writeText(searchText);
                await vscode.commands.executeCommand("actions.find");
                await vscode.commands.executeCommand("editor.action.selectAll");
                await vscode.commands.executeCommand("execPaste");
            } else {
                vscode.window.showErrorMessage('没有匹配的路径');
            }
        } else {
            vscode.window.showErrorMessage('没有找到对应的工作空间');
        }
    });

    // 从html文件定位到组件scss文件 [html 2 scss]
    const html_2Scss = vscode.commands.registerCommand('texteditor-util.html_2Scss', async function () {
        let rawClazz = await vscode.env.clipboard.readText();
        rawClazz = rawClazz.replace(/[\\+\\]/g, 'a'); // 特殊字符转化
        rawClazz = rawClazz.replace(/\./g, ''); // 类名进行转化
        const rawClazzArr = rawClazz.split(/(\s+)|>/);
        const rawClazzArrLen = rawClazzArr.length;
        let localClazz = '';
        if (rawClazzArrLen > 1) {
            localClazz = rawClazzArr[rawClazzArrLen - 1];
        }
        let [elementsClass] = rawClazzArr;
        const tailReg1 = /-scss-index_[a-zA-Z0-9-_]+$/g; // 带scss文件夹
        const tailReg2 = /-index_[a-zA-Z0-9-_]+$/g; // 不带scss文件夹
        // 都过滤成标准的不带scss的文件夹
        elementsClass = elementsClass.replace(tailReg1, '').replace(tailReg2, '');

        const reg = /(?<clazzName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)__(?<partStr1>(([a-zA-Z0-9]+-)*([a-zA-Z0-9]+)))/u;
        const result = reg.exec(elementsClass);
        const { clazzName, partStr1 } = result?.groups ?? {};
        const part1NameArr = (partStr1 || '').split('-');
        const allPaths = util.getAllMaybePaths(part1NameArr);
        const partAllMaybePathArr = allPaths.reduce((total, cur) => {
            return [
                ...total,
                cur + '/scss/index.scss',
                cur + '/index.scss',
            ];
        }, [] as string[]);



        if (!clazzName) {
            vscode.window.showErrorMessage('类名为空');
            return;
        }

        const { workspaceFolders } = vscode.workspace;
        if (workspaceFolders && workspaceFolders.length > 0) {
            const maybeComponentPaths = partAllMaybePathArr.map(v => workspaceFolders[0].uri.path + v);
            const allFiles = fg.sync(maybeComponentPaths, { dot: true, ignore: ["**/node_modules"] });
            const items = allFiles.map(util.generateQuickPickItem);

            if (items.length) {
                const placeholderText = `Element面板对应的组件`;
                let selectedPath: QuickPickItem | undefined = items[0];

                if (items.length > 1) {
                    selectedPath = await vscode.window
                    .showQuickPick(items, {
                        placeHolder: placeholderText,
                        matchOnDescription: true
                    });

                    if (!selectedPath) {
                        vscode.window.showErrorMessage('请选择一个路径');
                        return;
                    }
                }

                await util.open(selectedPath);
                const fileContent = fs.readFileSync(selectedPath.url.path).toString() || '';
                let searchText = '';
                const isFindSearch = new RegExp(clazzName, 'g').test(fileContent);

                if (isFindSearch) {
                    searchText = clazzName;
                } else {
                    vscode.window.showErrorMessage(`没有找到${clazzName}类名`);
                    return;
                }

                searchText = util.findExactClazz(localClazz, searchText, fileContent);

                await vscode.env.clipboard.writeText(searchText);
                await vscode.commands.executeCommand("actions.find");
                await vscode.commands.executeCommand("editor.action.selectAll");
                await vscode.commands.executeCommand("execPaste");
            } else {
                vscode.window.showErrorMessage('没有匹配的路径');
            }
        } else {
            vscode.window.showErrorMessage('没有找到对应的工作空间');
        }
    });

    // 从ui设计稿2个行高和间距计算实际的margin [ui 2 margin]
    const ui_2Margin = vscode.commands.registerCommand('texteditor-util.ui_2Margin', async function () {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const selectCss = document.getText(selection);

            if (selectCss) {
                const moduleStr = selectCss;
                const moduleStrArr = moduleStr.split(/\n/);

                if (moduleStrArr.length !== 5) {
                    vscode.window.showErrorMessage('请检查模板的格式');
                    return;
                }
                const [fontSize1, fontSize2, lineHeight1, lineHeight2, margin12] = moduleStrArr;
                const fontSizeNum1 = Number(fontSize1.split(':')[1]);
                const fontSizeNum2 = Number(fontSize2.split(':')[1]);
                const lineHeightNum1 = Number(lineHeight1.split(':')[1]);
                const lineHeightNum2 = Number(lineHeight2.split(':')[1]);
                const marginNum12 = Number(margin12.split(':')[1]);
                const realMargin = (marginNum12 - (lineHeightNum1 + lineHeightNum2 - (fontSizeNum1 + fontSizeNum2)) / 2) / 2;

                if (fontSizeNum1 > lineHeightNum1) {
                    vscode.window.showErrorMessage('error: [字体大小' + fontSizeNum1 + ']小于[行高' + lineHeightNum1 + ']');
                    return;
                }
                if (fontSizeNum2 > lineHeightNum2) {
                    vscode.window.showErrorMessage('error: [字体大小' + fontSizeNum2 + ']小于[行高' + lineHeightNum2 + ']');
                    return;
                }

                if (realMargin < 0) {
                    vscode.window.showErrorMessage('error: 实际行间距小于0');
                    return;
                }

                editor.edit(editBuilder => {
                    editBuilder.replace(editor.selection, String(Math.ceil(realMargin)) + 'px');
                });
            } else {
                // 输出模板
                const moduleStr = `fontSize1: number
fontSize2: number
lineHeight1: number
lineHeight2: number
margin12: number`;
                editor.edit(editBuilder => {
                    editBuilder.replace(editor.selection.active, moduleStr);
                });
            }
        }
    });

    context.subscriptions.push(toggleState);
    context.subscriptions.push(generateState1);
    context.subscriptions.push(generateState2);
    context.subscriptions.push(importGrammer1);
    context.subscriptions.push(importGrammer2);
    context.subscriptions.push(importGrammer3);
    context.subscriptions.push(importGrammer4);
    context.subscriptions.push(importGrammer5);
    context.subscriptions.push(importGrammer6);
    context.subscriptions.push(importGrammer7);
    context.subscriptions.push(importGrammer8);
    context.subscriptions.push(requireGrammer);
    context.subscriptions.push(enableEmmet);
    context.subscriptions.push(disableEmmet);
    context.subscriptions.push(optionalChainingOperator1);
    context.subscriptions.push(optionalChainingOperator2);
    context.subscriptions.push(optionalChainingOperator3);
    context.subscriptions.push(html_2Component);
    context.subscriptions.push(html_2Scss);
    context.subscriptions.push(ui_2Margin);
}
