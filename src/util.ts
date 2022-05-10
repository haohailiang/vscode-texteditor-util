/**
 * 功能: 文本处理工具函数
 * 作者: 郝海亮
 * 日期: 2022-03-05
 */

import * as vscode from 'vscode';
import * as changeCase from 'change-case';
import { ChangeCaseType, QuickPickItem } from './typing';

/**
* hook state文本切换
* @param text 源文本
* @returns hook
*/
const toggleState = (text: string): string => {
    if (/^set[A-Z]/.test(text)) {
        const tempText = text.slice(3);
        const first = tempText.slice(0, 1).toLowerCase() + tempText.slice(1);
        return first;
    }

    const second = 'set' + text.slice(0, 1).toUpperCase() + text.slice(1);
    return second;
};

/**
 * generateState自动生成
 * @param text 输入的文本
 * @returns 返回state和setState
 */
const generateState = (text: string): [string, string] => {
    const first = changeCase.camelCase(text);
    const second = changeCase.camelCase(`set ${text}`);

    return [first, second];
};

// 获取链式操作的列表
const getChainingOperators = (vdom: string, variableNames: string[]): [string[], string] => {
    vdom = vdom.replace('?.', '.');
    const outerOperators = variableNames.map(v => {
        // . -> ?.
        return v.replace(/(?<!\?)\./g, '?.');
    });
    return [outerOperators, vdom];
};

// 获取链式操作的列表
const getChainingOperators3 = (vdom: string, variableName: string): [string, string] => {
    vdom = vdom.replace(/(?<!\?)\./g, '?.');
    const outerOperator = variableName.replace(/(?<!\?)\./g, '?.');
    return [outerOperator, vdom];
};

// 获取操作符的dom结构1
const getOperatorsDom1 = (operaters: string[]): string => {
    const midProcess = operaters.map(v => `(typeof ${v} !== 'undefined')`);
    return midProcess.join(' && ');
};

// 获取操作符的dom结构2
const getOperatorsDom2 = (operaters: string[]): string => {
    return operaters.join(' && ');
};

const generateQuickPickItem = (pathOrUri: string, order: number): QuickPickItem => {
    const document = vscode.window.activeTextEditor && vscode.window.activeTextEditor.document;
    const workspaceFolder = document ? vscode.workspace.getWorkspaceFolder(document.uri) : null;
    // const maybeWorkspaceFolder = workspaceFolder ? workspaceFolder.uri.path : "";
    const maybeWorkspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.path : "";
    const fileName = vscode.workspace.asRelativePath(pathOrUri);

    return {
        url: vscode.Uri.file(pathOrUri),
        rootPath: maybeWorkspaceFolder,
        label: `[${order + 1}]`,
        description: fileName
    };
};

const open = (item: QuickPickItem) => {
    return vscode.workspace
        .openTextDocument(item.url)
        .then(doc => vscode.window.showTextDocument(doc.uri));
};

/**
 * 转换后的类型
 * @param text 源文本
 * @param type 转换类型
 */
// const handleChangeCase = (text: string, type: ChangeCaseType): string => {
//     if (type === '1_camel') {
//         return changeCase.camel(text);
//     }

//     if (type === '2_constant') {
//         return changeCase.constant(text);
//     }

//     if (type === '3_kebab') {
//         return changeCase.param(text);
//     }

//     if (type === '4_pascal') {
//         return changeCase.pascal(text);
//     }

//     if (type === '5_lower') {
//         return changeCase.lower(text);
//     }

//     if (type === '6_upper') {
//         return changeCase.upper(text);
//     }
    
//     return text;
// };

// 查找精确的类
const findExactClazz = (localClazz: string, prevClazz: string, fileContent: string) => {
    if (localClazz) {
        const isFinded = new RegExp(localClazz, 'g').test(fileContent);
        if (isFinded) {
            return localClazz;
        }

        return prevClazz;
    }

    return prevClazz;
};

// 获取数组所有的路径组合
const getAllMaybePaths = (arr: string[] = []) => {
    if (arr.length === 0) {
        return [''];
    }

    if (arr.length === 1) {
        return [arr.join('')];
    }

    const len = arr.length;
    const num = 2 ** (len - 1);
    const result = [];
    // 10进制转化为2进制
    for (let i=0; i<num; i++) {
        const binary = i.toString(2);
        const binaryStr = binary.padStart(len - 1, '0');
        result.push(binaryStr);
    }
    const ret = [];
    for (let i=0; i<result.length; i++) {
        let result2 = '/';
        for(let j=0; j<arr.length; j++) {
            if (j !== arr.length - 1) {
                result2 += arr[j] + (result[i][j] === '0' ? '-' : '/');
            } else {
                result2 += arr[j];
            }
        }
        ret.push(result2);
    }
    return ret;
};

export default {
    toggleState,
    generateState,
    getChainingOperators,
    getChainingOperators3,
    getOperatorsDom1,
    getOperatorsDom2,
    generateQuickPickItem,
    open,
    // handleChangeCase,
    findExactClazz,
    getAllMaybePaths,
};
