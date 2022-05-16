/**
 * 功能: status bar UI界面
 * 作者: 郝海亮
 * 日期: 2022-05-16
 */

import * as vscode from 'vscode';
import { StatusBarItem, window, StatusBarAlignment } from 'vscode';
export class StatusbarUi {

    private static _statusBarItem: StatusBarItem;

    private static get statusbar() {
        if (!StatusbarUi._statusBarItem) {
            StatusbarUi._statusBarItem = window
                .createStatusBarItem(StatusBarAlignment.Right, 100);

            this.statusbar.show();
        }

        return StatusbarUi._statusBarItem;
    }

    static Init() {
        const emmetStatus = vscode.workspace.getConfiguration("emmet").get('showExpandedAbbreviation');
        if (emmetStatus === 'always') {
            StatusbarUi.showEnable();
        } else {
            StatusbarUi.showDisable();
        }
    }

    public static showEnable() {
        StatusbarUi.statusbar.text = '$(notebook-state-success)启用';
        StatusbarUi.statusbar.command = 'texteditor-util.emmet.disable';
        StatusbarUi.statusbar.tooltip = '禁用emmet';
    }

    public static showDisable() {
        StatusbarUi.statusbar.text = `$(circle-slash)禁用`;
        StatusbarUi.statusbar.command = 'texteditor-util.emmet.enable';
        StatusbarUi.statusbar.tooltip = '启用emmet';
    }

    public static dispose() {
        StatusbarUi.statusbar.dispose();
    }
}
