/**
 * 功能: 文本处理工具函数
 * 作者: 郝海亮
 * 日期: 2022-03-05
 */

import * as changeCase from 'change-case';
import { ChangeCaseType } from './typing';

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

export default {
    toggleState,
    // handleChangeCase,
};
