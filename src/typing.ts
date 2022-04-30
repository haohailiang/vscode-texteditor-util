/**
 * 功能: 类型定义
 * 作者: 郝海亮
 * 日期: 2022-03-05
 */

import * as vscode from 'vscode';

export type ChangeCaseType = '1_camel' | '2_constant' | '3_kebab' | '4_pascal' | '5_lower' | '6_upper';

export interface QuickPickItem {
    url: vscode.Uri,
    rootPath: string;
    label: string;
    description: string;
}
