'use strict';

import * as vscode from 'vscode';
import * as changeCase from 'change-case';
import * as fg from 'fast-glob';
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

    // 开启恩丰的CSS Module的功能
    const enableCssModule = vscode.commands.registerCommand("texteditor-util.cssModuleType.enable", () => {
        vscode.workspace.getConfiguration("texteditor-util-css-module-type").update("enable", true, true);
        vscode.window.showInformationMessage('标准cssModule功能开启');
    });

    // 关闭恩丰的CSS Module的功能
    const disableCssModule = vscode.commands.registerCommand("texteditor-util.cssModuleType.disable", () => {
        vscode.workspace.getConfiguration("texteditor-util-css-module-type").update("enable", false, true);
        vscode.window.showInformationMessage('标准cssModule功能关闭');
    });

    // 从html文件定位到组件index.tsx文件 [html 2 component]
    const html_2Component = vscode.commands.registerCommand('texteditor-util.html_2Component', async function () {
        // standard-process-filter__src-reviewsale-standard-deploy-components-standard-process-filter-scss-index_P63co
        // progress-wrap__src-components-jzpx-case-detail-components-progress-scss-index_25MxG
        // case__src-skill-components-common-case-index_q-tPb
        const elementsClass = await vscode.env.clipboard.readText();
        const reg1 = /(?<clazzName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)__src-components-(?<moduleName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-components-(?<componentName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-scss-index/u; // 恩丰的垃圾代码 [带有模块名称]
        const reg2 = /(?<clazzName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)__src-components-(?<componentName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-scss-index/u; // [不带有模块名称][公用组件]
        const reg3 = /(?<clazzName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)__src-(?<moduleName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-components-(?<componentName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-scss-index/u; // [带有模块名称]

        // 不带scss文件夹的
        const reg12 = /(?<clazzName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)__src-components-(?<moduleName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-components-(?<componentName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-index/u; // 恩丰的垃圾代码 [带有模块名称]
        const reg22 = /(?<clazzName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)__src-components-(?<componentName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-index/u; // [不带有模块名称][公用组件]
        const reg32 = /(?<clazzName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)__src-(?<moduleName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-components-(?<componentName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-index/u; // [带有模块名称]
        const result1 = reg1.exec(elementsClass);
        const result2 = reg2.exec(elementsClass);
        const result3 = reg3.exec(elementsClass);

        const result12 = reg12.exec(elementsClass);
        const result22 = reg22.exec(elementsClass);
        const result32 = reg32.exec(elementsClass);

        let clazzName: string | undefined;
        let moduleName: string | undefined;
        let componentName: string | undefined;

        const { clazzName: clazzName1, moduleName: moduleName1, componentName: componentName1 } = result1?.groups ?? {};
        const { clazzName: clazzName2, componentName: componentName2 } = result2?.groups ?? {};
        const { clazzName: clazzName3, moduleName: moduleName3, componentName: componentName3 } = result3?.groups ?? {};

        const { clazzName: clazzName12, moduleName: moduleName12, componentName: componentName12 } = result12?.groups ?? {};
        const { clazzName: clazzName22, componentName: componentName22 } = result22?.groups ?? {};
        const { clazzName: clazzName32, moduleName: moduleName32, componentName: componentName32 } = result32?.groups ?? {};

        let isBaseComponent = false;

        if (clazzName1 && moduleName1 && componentName1) {
            clazzName = clazzName1;
            moduleName = moduleName1;
            componentName = componentName1;
        } else if (clazzName3 && moduleName3 && componentName3) {
            clazzName = clazzName3;
            moduleName = moduleName3;
            componentName = componentName3;
        } else if (clazzName2 && componentName2) {
            clazzName = clazzName2;
            componentName = componentName2;
            isBaseComponent = true;
        } else if (clazzName12 && moduleName12 && componentName12) { // 不带scss文件夹的
            clazzName = clazzName12;
            moduleName = moduleName12;
            componentName = componentName12;
        } else if (clazzName32 && moduleName32 && componentName32) {
            clazzName = clazzName32;
            moduleName = moduleName32;
            componentName = componentName32;
        } else if (clazzName22 && componentName22) {
            clazzName = clazzName22;
            componentName = componentName22;
            isBaseComponent = true;
        }


        if (!clazzName) {
            vscode.window.showErrorMessage('类名为空');
            return;
        }

        if (!isBaseComponent && !moduleName) { // 不是基础木块才需要验证
            vscode.window.showErrorMessage('模块名称为空');
            return;
        }

        if (!componentName) {
            vscode.window.showErrorMessage('组件名称为空');
            return;
        }

        const { workspaceFolders } = vscode.workspace;
        if (workspaceFolders && workspaceFolders.length > 0) {
            const initMaybeComponentPaths: string[] = [];
            let maybeComponentPaths: string[] =[];

            if (moduleName) { // 非基础组件的情况
                const moduleNameArr = moduleName.split('-');
                const componentNameArr = componentName.split('-');
                const maybeModulePathArr = [moduleName];
                const maybeComponentPathArr = [componentName];
    
                for(let i = 1; i< moduleNameArr.length; i++) {
                    const first = moduleNameArr.slice(0, i).join('-');
                    const second = moduleNameArr.slice(i).join('-');
                    maybeModulePathArr.push(first + '/' + second);
                }
                for(let i = 1; i< componentNameArr.length; i++) {
                    const first = componentNameArr.slice(0, i).join('-');
                    const second = componentNameArr.slice(i).join('-');
                    maybeComponentPathArr.push(first + '/' + second);
                }
                maybeComponentPaths = maybeModulePathArr.reduce((total, curModulePath) => {
                    const curComponnetPaths = maybeComponentPathArr.reduce((t1, c1) => {
                        const cPath = workspaceFolders[0].uri.path + '/src/' + curModulePath + '/components/' +  c1 + '/index.tsx';
                        return [...t1, cPath];
                    }, [] as string[]);
                    return [...total, ...curComponnetPaths];
                }, initMaybeComponentPaths);
            } else if (isBaseComponent) { // 纯组件
                maybeComponentPaths = [
                    workspaceFolders[0].uri.path + '/src/components/' +  componentName + '/index.tsx'
                ];
            } else {
                vscode.window.showErrorMessage('既不是带模块的组件也不是纯组件');
                return;
            }
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
                const isEnable = vscode.workspace.getConfiguration("texteditor-util-css-module-type").get('enable');
                let searchText = `styles['${clazzName}']`;
                if (isEnable) { // 如果是超哥的标准css module
                    const camelCaseClazzName = changeCase.camelCase(clazzName);
                    searchText = `styles.${camelCaseClazzName}`;
                }
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
        // standard-process-filter__src-reviewsale-standard-deploy-components-standard-process-filter-scss-index_P63co
        // progress-wrap__src-components-jzpx-case-detail-components-progress-scss-index_25MxG
        // case__src-skill-components-common-case-index_q-tPb
        const elementsClass = await vscode.env.clipboard.readText();
        const reg1 = /(?<clazzName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)__src-components-(?<moduleName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-components-(?<componentName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-scss-index.+(?<lastSelector>\.[a-zA-Z0-9-]+)$/u; // 恩丰的垃圾代码 [带有模块名称]
        const reg2 = /(?<clazzName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)__src-components-(?<componentName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-scss-index.+(?<lastSelector>\.[a-zA-Z0-9-]+)$/u; // [不带有模块名称][公用组件]
        const reg3 = /(?<clazzName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)__src-(?<moduleName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-components-(?<componentName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-scss-index.+(?<lastSelector>\.[a-zA-Z0-9-]+)$/u; // [带有模块名称]

        // 不带scss文件夹的
        const reg12 = /(?<clazzName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)__src-components-(?<moduleName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-components-(?<componentName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-index/u; // 恩丰的垃圾代码 [带有模块名称]
        const reg22 = /(?<clazzName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)__src-components-(?<componentName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-index/u; // [不带有模块名称][公用组件]
        const reg32 = /(?<clazzName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)__src-(?<moduleName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-components-(?<componentName>([a-zA-Z0-9]+-)*[a-zA-Z0-9]+)-index/u; // [带有模块名称]
        const result1 = reg1.exec(elementsClass);
        const result2 = reg2.exec(elementsClass);
        const result3 = reg3.exec(elementsClass);

        const result12 = reg12.exec(elementsClass);
        const result22 = reg22.exec(elementsClass);
        const result32 = reg32.exec(elementsClass);

        let clazzName: string | undefined;
        let moduleName: string | undefined;
        let componentName: string | undefined;
        let lastSelector: string | undefined;

        const { clazzName: clazzName1, moduleName: moduleName1, componentName: componentName1, lastSelector: lastSelector1 } = result1?.groups ?? {};
        const { clazzName: clazzName2, componentName: componentName2, lastSelector: lastSelector2 } = result2?.groups ?? {};
        const { clazzName: clazzName3, moduleName: moduleName3, componentName: componentName3, lastSelector: lastSelector3 } = result3?.groups ?? {};

        const { clazzName: clazzName12, moduleName: moduleName12, componentName: componentName12 } = result12?.groups ?? {};
        const { clazzName: clazzName22, componentName: componentName22 } = result22?.groups ?? {};
        const { clazzName: clazzName32, moduleName: moduleName32, componentName: componentName32 } = result32?.groups ?? {};

        let isBaseComponent = false;

        if (clazzName1 && moduleName1 && componentName1) {
            clazzName = clazzName1;
            moduleName = moduleName1;
            componentName = componentName1;
            lastSelector = lastSelector1;
        } else if (clazzName3 && moduleName3 && componentName3) {
            clazzName = clazzName3;
            moduleName = moduleName3;
            componentName = componentName3;
            lastSelector = lastSelector3;
        } else if (clazzName2 && componentName2) {
            clazzName = clazzName2;
            componentName = componentName2;
            lastSelector = lastSelector2;
            isBaseComponent = true;
        } else if (clazzName12 && moduleName12 && componentName12) { // 不带scss文件夹的
            clazzName = clazzName12;
            moduleName = moduleName12;
            componentName = componentName12;
        } else if (clazzName32 && moduleName32 && componentName32) {
            clazzName = clazzName32;
            moduleName = moduleName32;
            componentName = componentName32;
        } else if (clazzName22 && componentName22) {
            clazzName = clazzName22;
            componentName = componentName22;
            isBaseComponent = true;
        }


        if (!clazzName) {
            vscode.window.showErrorMessage('类名为空');
            return;
        }

        if (!isBaseComponent && !moduleName) { // 不是基础木块才需要验证
            vscode.window.showErrorMessage('模块名称为空');
            return;
        }

        if (!componentName) {
            vscode.window.showErrorMessage('组件名称为空');
            return;
        }

        const { workspaceFolders } = vscode.workspace;
        if (workspaceFolders && workspaceFolders.length > 0) {
            const initMaybeComponentPaths: string[] = [];
            let maybeComponentPaths: string[] =[];

            if (moduleName) { // 非基础组件的情况
                const moduleNameArr = moduleName.split('-');
                const componentNameArr = componentName.split('-');
                const maybeModulePathArr = [moduleName];
                const maybeComponentPathArr = [componentName];
    
                for(let i = 1; i< moduleNameArr.length; i++) {
                    const first = moduleNameArr.slice(0, i).join('-');
                    const second = moduleNameArr.slice(i).join('-');
                    maybeModulePathArr.push(first + '/' + second);
                }
                for(let i = 1; i< componentNameArr.length; i++) {
                    const first = componentNameArr.slice(0, i).join('-');
                    const second = componentNameArr.slice(i).join('-');
                    maybeComponentPathArr.push(first + '/' + second);
                }
                maybeComponentPaths = maybeModulePathArr.reduce((total, curModulePath) => {
                    const curComponnetPaths = maybeComponentPathArr.reduce((t1, c1) => {
                        let cPath = workspaceFolders[0].uri.path + '/src/' + curModulePath + '/components/' +  c1 + '/index.tsx';
                        if (lastSelector) {
                            cPath = workspaceFolders[0].uri.path + '/src/' + curModulePath + '/components/' +  c1 + '/scss/index.scss';
                        }
                        return [...t1, cPath];
                    }, [] as string[]);
                    return [...total, ...curComponnetPaths];
                }, initMaybeComponentPaths);
            } else if (isBaseComponent) { // 纯组件
                maybeComponentPaths = [
                    workspaceFolders[0].uri.path + '/src/components/' +  componentName + '/index.tsx'
                ];
                if (lastSelector) {
                    maybeComponentPaths = [
                        workspaceFolders[0].uri.path + '/src/components/' +  componentName + '/scss/index.scss'
                    ];
                }
            } else {
                vscode.window.showErrorMessage('既不是带模块的组件也不是纯组件');
                return;
            }
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
                const isEnable = vscode.workspace.getConfiguration("texteditor-util-css-module-type").get('enable');
                let searchText = `styles['${clazzName}']`;
                if (isEnable) { // 如果是超哥的标准css module
                    const camelCaseClazzName = changeCase.camelCase(clazzName);
                    searchText = `styles.${camelCaseClazzName}`;
                }
                if (lastSelector) {
                    searchText = lastSelector;
                }
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
    context.subscriptions.push(enableCssModule);
    context.subscriptions.push(disableCssModule);
    context.subscriptions.push(html_2Component);
    context.subscriptions.push(html_2Scss);
}
