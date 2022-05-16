/**
 * 功能: status bar
 * 作者: 郝海亮
 * 日期: 2022-05-16
 */

import { StatusbarUi } from './statusbar-ui';

export class StatusbarUiMain {
    constructor() {
        StatusbarUi.Init();
    }

    public dispose() {
        StatusbarUi.dispose();
    }
}


