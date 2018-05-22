'use strict';
const rowEnum = {
    None: 0,
    IO: 1,
    ExectuionTime: 2,
    CompileTime: 3,
    RowsAffected: 4,
    Error: 5
}

function statsIOInfo(rownumber, langText, table, scan, logical, physical, readahead, loblogical, lobphysical, lobreadahead) {
    this.rownumber = rownumber;
    this.table = table;
    this.nostats = false;
    this.scan = infoReplace(scan, langText.scan, '');
    this.logical = infoReplace(logical, langText.logical, '');
    this.physical = infoReplace(physical, langText.physical, '');
    this.readahead = infoReplace(readahead, langText.readahead, '');
    this.loblogical = infoReplace(loblogical, langText.loblogical, '');
    this.lobphysical = infoReplace(lobphysical, langText.lobphysical, '');
    this.lobreadahead = infoReplace(lobreadahead, langText.lobreadahead, '');
    this.percentread = 0.0;
}

function statsIOInfoTotal() {
    this.rownumber = 0;
    this.table = '';
    this.scan = 0;
    this.logical = 0;
    this.physical = 0;
    this.readahead = 0;
    this.loblogical = 0;
    this.lobphysical = 0;
    this.lobreadahead = 0;
    this.percentread = 0.0;
}

function statsTimeInfo(cpu, elapsed) {
    this.cpu = parseInt(cpu);
    this.elapsed = parseInt(elapsed);
}

function statsTimeInfoTotal() {
    this.cpu = 0;
    this.elapsed = 0;
}

function infoReplace(strValue, searchValue, newvValue) {
    let returnValue = 0;
    if (strValue != undefined) {
        returnValue = parseInt(strValue.replace(searchValue, newvValue));
        if (isNaN(returnValue)) {
            returnValue = 0;
        }
    }
    return returnValue;
}

function determineRowType(strRow, langText) {
    let rowType = rowEnum.None;

    if (strRow.substring(0, 7) === langText.table) {
        rowType = rowEnum.IO;
    } else if (strRow.trim() === langText.executiontime) {
        rowType = rowEnum.ExectuionTime;
    } else if (strRow.trim() === langText.compiletime) {
        rowType = rowEnum.CompileTime;
    } else if (strRow.indexOf(langText.rowsaffected) > -1) {
        rowType = rowEnum.RowsAffected;
    } else if (strRow.substring(0, 3) === langText.errormsg) {
        rowType = rowEnum.Error;
    }

    return rowType;
}

function processTimeRegEx(preText, postText) {
    let re = new RegExp("(.*" + preText + "+)(.*?)(\\s+" + postText + ".*)");

    return re
}

function processTime(line, cputime, elapsedtime, milliseconds) {
    let section = line.split(',');

    let re = processTimeRegEx(cputime, milliseconds);
    let re2 = processTimeRegEx(elapsedtime, milliseconds);

    return new statsTimeInfo(section[0].replace(re, "$2"), section[1].replace(re2, "$2"))
}

function processIOTableRow(line, tableResult, langText) {
    let section = line.split('\.');
    let tableName = getSubStr(section[0], '\'')
    let tableData = section[1];

    // If not a statistics IO statement then end table (if necessary) and write line ending in <br />
    // If prev line was not a statistics IO statement then start a table.
    if (tableData != undefined) {
        if (tableData == '') {
            let statLineInfo = new statsIOInfo(tableResult.length + 1, langText, line);
            statLineInfo.nostats = true;
            tableResult.push(statLineInfo);
        }
        let stat = tableData.split(/[,]+/);
        let statInfo = new statsIOInfo(tableResult.length + 1, langText, tableName, stat[0], stat[1], stat[2], stat[3], stat[4], stat[5], stat[6]);
        tableResult.push(statInfo);
    } else {
        if (line.length > 0) {
            let statLineInfo = new statsIOInfo(tableResult.length + 1, langText, line);
            statLineInfo.nostats = true;
            tableResult.push(statLineInfo);
        }
    }
}

function parseOutput(txt) {
    //let txt = document.getElementById("statiotext").value;
    let lang = resolveLanguagePack('en');
    let lines = txt.split('\n');
    let ioResults = [];
    let tableIOResult = [];
    let executionTotal = new statsTimeInfoTotal();
    let compileTotal = new statsTimeInfoTotal();
    let tableCount = 0;
    let inTable = false;
    let isExecution = false;
    let isCompile = false;
    let isError = false;
    // let formattedOutput = '';
    let rowType;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (isExecution === false && isCompile === false && isError === false) {
            rowType = determineRowType(line, lang);
        }

        switch (rowType) {
            case rowEnum.IO:
                if (inTable === true) {
                    processIOTableRow(line, tableIOResult, lang);
                } else {
                    tableCount += 1;
                    inTable = true;
                    processIOTableRow(line, tableIOResult, lang);
                }
                break;
            case rowEnum.ExectuionTime:
                if (isExecution === true) {
                    let et = processTime(line, lang.cputime, lang.elapsedtime, lang.milliseconds);
                    // formattedOutput += outputTimeTable(et, lang.executiontime, lang.milliseconds, lang.elapsedlabel, lang.cpulabel)
                    executionTotal.cpu += et.cpu;
                    executionTotal.elapsed += et.elapsed
                } else {
                    //formattedOutput += '<span>' + line + '<br /></span>';
                }
                isExecution = !isExecution;
                break;
            case rowEnum.CompileTime:
                if (isCompile === true) {
                    let ct = processTime(line, lang.cputime, lang.elapsedtime, lang.milliseconds);
                    // formattedOutput += outputTimeTable(ct, lang.compiletime, lang.milliseconds, lang.elapsedlabel, lang.cpulabel)
                    compileTotal.cpu += ct.cpu;
                    compileTotal.elapsed += ct.elapsed
                } else {
                    //formattedOutput += '<span>' + line + '<br /></span>';
                }
                isCompile = !isCompile;
                break;
            case rowEnum.RowsAffected:
                let re = new RegExp("\\d+");
                let affectedText = lang.headerrowsaffected;
                let numRows;
                if ((numRows = re.exec(line)) !== null) {
                    if (numRows[0] === 1) {
                        affectedText = lang.headerrowaffected;
                    }
                    // formattedOutput += '<div class="strong-text">' + numeral(numRows[0]).format('0,0') + affectedText + '</div>';
                }
                break;
            case rowEnum.Error:
                isError = (isError === false ? true : false);
                // formattedOutput += '<div class="error-text">' + line + '</div>'
                break;
            default:
                if (inTable === true) {
                    inTable = false;
                    // formattedOutput += outputIOTable(tableIOResult, statsIOCalcTotals(tableIOResult), tableCount, lang);
                    ioResults.push(tableIOResult);
                    tableIOResult = [];
                }
            // formattedOutput += '<span>' + line + '<br /></span>';
        }

    }

    if (ioResults[ioResults.length - 1] != tableIOResult)
        ioResults.push(tableIOResult);

    // // if last row a table then call formatOutput
    // if (inTable == true) {
    //     formattedOutput += outputIOTable(tableIOResult, statsIOCalcTotals(tableIOResult), tableCount, lang);
    // }

    // formattedOutput += '<h4>Totals:</h4>'
    // formattedOutput += outputTimeTableTotals(executionTotal, compileTotal, lang.compiletime, lang.executiontime, lang.milliseconds, lang.elapsedlabel, lang.cpulabel);
    return {
        tableIOResult: ioResults,
        executionTotal: executionTotal,
        compileTotal: compileTotal
    };
}

function statsIOCalcTotals(statInfos) {
    let statTotal = new statsIOInfoTotal();

    for (let i = 0; i < statInfos.length; i++) {
        statTotal.scan += statInfos[i].scan;
        statTotal.logical += statInfos[i].logical;
        statTotal.physical += statInfos[i].physical;
        statTotal.readahead += statInfos[i].readahead;
        statTotal.loblogical += statInfos[i].loblogical;
        statTotal.lobphysical += statInfos[i].lobphysical;
        statTotal.lobreadahead += statInfos[i].lobreadahead;
    }
    calcPercent(statInfos, statTotal);
    return statTotal;
}

function calcPercent(statInfos, statTotal) {
    for (let i = 0; i < statInfos.length; i++) {
        statInfos[i].percentread = ((statInfos[i].logical / statTotal.logical) * 100).toFixed(3);
        //statInfos[i].percentread += statInfos[i].percentread.toString() + '%';
    }
}

function resolveLanguagePack(langType) {
    let lang;
    switch (langType) {
        case 'en': // English
            lang = require('./languagetext-en');
            break;
        case 'es': // Spanish
            lang = require('./languagetext-es');
            break;
        default :
            lang = require('./languagetext-en');
            break;
    }
    return lang;
}

function getSubStr(str, delim) {
    var a = str.indexOf(delim);

    if (a == -1)
        return '';

    var b = str.indexOf(delim, a + 1);

    if (b == -1)
        return '';

    return str.substr(a + 1, b - a - 1);
}

module.exports = parseOutput;