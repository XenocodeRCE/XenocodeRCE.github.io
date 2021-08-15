/** Javascript Syntax Highlighter
  * Highlights many different programming languages
  * Outputs valid XHTML, so can be used in XHTML pages!
  * Written by: Michiel van Eerd
  *
  *  * Note: This version was modified (see * below) by mrrena <mrrena.blogspot.com>.
  *  * For the original source code, please see:
  *  * <http://www.webessence.nl/scripts/syntax-highlighter/>
  *
  * Usage:
  *      <!-- CSS class of "code" and language class--see ** below -->
  *      <pre class="code js"></pre>
  *
  *    * Modifications include:
  *      * regular expression highlighting
  *      * css syntax support
  *      * additions to js, php, and python syntax
  *      * <code> auto inserted
  *      * slightly different handling in some inner functions
  *      * custom "mrrena" dark theme
  *
  *  ** CSS class names for currently supported languages
  *     * c, csharp, css, js, sql, php, python, vb, win32
  */

// Show line numbers? set this to 1
showLineNumbers = 0;
/* IE doesn't understand indexOf() on arrays, so add it */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(val) {
        var len = this.length;
        for (var i = 0; i < len; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
}

var SyntaxHighlighter = {};

SyntaxHighlighter.language = {};

SyntaxHighlighter.xmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

SyntaxHighlighter.regexLines = {
    'delimiters': [],
    'lines': []
};

SyntaxHighlighter.strToXHTML = function(str) {
    var addLen = 0;
    for (var key in SyntaxHighlighter.xmlEntities) {
        str = str.replace(new RegExp(key, 'g'), function(match, offset, s) {
            addLen += (SyntaxHighlighter.xmlEntities[key].length - 1);
            return SyntaxHighlighter.xmlEntities[key];
        });
    }
    return {
        'str': str,
        'addLen': addLen
    };
};

SyntaxHighlighter.copyObject = function(ob) {
    var newOb = {};
    for (var prop in ob) {
        newOb[prop] = ob[prop];
    }
    return newOb;
};

SyntaxHighlighter.highlightDocument = function(showLineNumbers) {
    var codeList = document.getElementsByTagName('pre');
    for (var i = 0, len = codeList.length; i < len; i++) {
        if (codeList[i].className) {
            var classArr = codeList[i].className.split(' ');
            if (classArr.length >= 2 && classArr.indexOf('code') >= 0) {
                var langArr = /\b(c|csharp|css|js|sql|php|python|vb|win32)\b/.exec(classArr.join(' '));
                if (langArr && langArr[0]) {
                    SyntaxHighlighter.highlight(codeList[i], showLineNumbers, langArr[0]);
                }
            }
        }
    }
};

SyntaxHighlighter.highlight = function(codeEl, showLineNumbers, langClass) {
    var lang = SyntaxHighlighter.language[langClass];
    if (!lang) {
        return;
    }

    var span_comment_len = '<span class="comment"></span>'.length;
    var span_regex_len = '<span class="regex"></span>'.length;
    var span_quote_len = '<span class="quote"></span>'.length;
    var span_operator_len = '<span class="operator"></span>'.length;
    var span_keyword_len = '<span class="keyword"></span>'.length;

    // With \n or \r\n as line break
    // data rewrites HTML entities to real characters
    codeEl.normalize(); // In FF, long pieces of text (> 4096 characters) are often distributed across multiple text nodes
    var lines = [];

    // If there are more child nodes after normalization, I assume that \n or \r have been replaced by line breaks (br).
    if (codeEl.childNodes.length > 1) {
        // with a line break (br)
        // You may only add a blank line at the second consecutive no data (so <br> in the code).
        var hasBr = false;
        for (var i = 0; i < codeEl.childNodes.length; i++) {
            if (!codeEl.childNodes[i].data) {
                if (hasBr) {
                    lines.push('');
                    hasBr = false;
                } else {
                    hasBr = true;
                }
            } else {
                lines.push(codeEl.childNodes[i].data);
                hasBr = false;
            }
        }
    } else {
        // There are apparently \n and \r as line break uses.
        var str = codeEl.firstChild.data;
        lines = (str.indexOf('\n') != -1) ? str.split('\n') : str.split('\r'); // FF or IE
    }

    var beginMultiCommentIndex = -1;
    var regexPattern = /\/(\\\/|[^\/\n])*\/[gim]*/g;

    forLineLoop: for (var lineIndex = 0, lineCount = lines.length; lineIndex < lineCount; lineIndex++) {
        var line = lines[lineIndex];
        var prop = {};

        forCharLoop: for (var charIndex = 0, lineLen = line.length; charIndex < lineLen; charIndex++) {
            var c = line.charAt(charIndex);
            var b = line.charAt(charIndex + 1);
            // End multiline comment
            if (beginMultiCommentIndex != -1) {
                var endMultiCommentIndex = -1;
                for (; charIndex < lineLen; charIndex++) {
                    c = line.charAt(charIndex);
                    if (c == '\\') {
                        charIndex++;
                        continue;
                    }
                    if (c == lang.comment.multi.end.charAt(0)) {
                        endMultiCommentIndex = charIndex;
                        for (i = 0; i < lang.comment.multi.end.length; i++) {
                            if (line.charAt(charIndex + i) != lang.comment.multi.end.charAt(i)) {
                                endMultiCommentIndex = -1;
                                break;
                            }
                        }
                        if (endMultiCommentIndex != -1) {
                            charIndex += (lang.comment.multi.end.length - 1);
                            endMultiCommentIndex = charIndex;
                            break;
                        }
                    }
                }
                var realEndIndex = (endMultiCommentIndex != -1) ? endMultiCommentIndex : lineLen - 1;
                var substrOb = SyntaxHighlighter.strToXHTML(line.substr(beginMultiCommentIndex, realEndIndex - beginMultiCommentIndex + 1));
                line = line.substr(0, beginMultiCommentIndex) + '<span class="comment">' + substrOb.str + '</span>' + line.substr(realEndIndex + 1);
                charIndex += (span_comment_len + substrOb.addLen);
                lineLen += (span_comment_len + substrOb.addLen);
                prop[beginMultiCommentIndex] = span_comment_len + substrOb.str.length;
                beginMultiCommentIndex = (endMultiCommentIndex != -1) ? -1 : 0;
                continue forCharLoop;
            }

            // Begin multiline comment
            if (lang.comment.multi && c == lang.comment.multi.start.charAt(0)) {
                beginMultiCommentIndex = charIndex;
                for (i = 0; i < lang.comment.multi.start.length; i++) {
                    if (line.charAt(charIndex + i) != lang.comment.multi.start.charAt(i)) {
                        beginMultiCommentIndex = -1;
                        break;
                    }
                }
                if (beginMultiCommentIndex != -1) {
                    charIndex += lang.comment.multi.start.length - 1;
                    if (charIndex == lineLen - 1) {
                        charIndex--;
                    }
                    continue forCharLoop;
                }
            }

            // Regular Expressions
            if (lang.regex.start && c == lang.regex.start.charAt(0) && b != lang.regex.start.charAt(0)) {
                beginRegularExpressionIndex = charIndex;
                // Here go to end regex
                for (charIndex += 1; charIndex < lineLen; charIndex++) {
                    c = line.charAt(charIndex);
                    if (c == lang.regex.escape) {
                        // we're gonna keep counting till we reach the end no matter. If we have an escape, advance index by 1 (thereby skipping the escaped character) and continue
                        charIndex++;
                        continue;
                    }

                    // End
                    if (c == lang.regex.end) {
                        // must bind first, as charIndex changes through any inner "if"s below.
                        var one = line.charAt(charIndex + 1);
                        var two = line.charAt(charIndex + 2);
                        var three = line.charAt(charIndex + 3);
                        if (/[gim]/.test(one)) {
                            charIndex++;
                            if (/[gim]/.test(two)) {
                                charIndex++;
                                if (/[gim]/.test(three)) {
                                    charIndex++;
                                }
                            }
                        }
                        substrOb = SyntaxHighlighter.strToXHTML(line.substr(beginRegularExpressionIndex, charIndex - beginRegularExpressionIndex + 1));
                        line = line.substr(0, beginRegularExpressionIndex) + '<span class="regex">' + substrOb.str + '</span>' + line.substr(charIndex + 1);
                        prop[beginRegularExpressionIndex] = span_regex_len + substrOb.str.length;
                        charIndex += (span_regex_len + substrOb.addLen);
                        lineLen += (span_regex_len + substrOb.addLen);
                        continue forCharLoop;
                    }
                }
            }

            // Single comment
            if (lang.comment.single && c == lang.comment.single.start.charAt(0)) {
                var beginSingleCommentIndex = charIndex;
                // Possibly the start of a single comment
                for (i = 0; i < lang.comment.single.start.length; i++) {
                    if (line.charAt(charIndex + i) != lang.comment.single.start.charAt(i)) {
                        beginSingleCommentIndex = -1;
                        break;
                    }
                }
                if (beginSingleCommentIndex != -1) {
                    // Everything up to the end of the line is a comment
                    substrOb = SyntaxHighlighter.strToXHTML(line.substr(beginSingleCommentIndex));
                    line = line.substr(0, beginSingleCommentIndex) + '<span class="comment">' + substrOb.str + '</span>';
                    charIndex = line.length - 1;
                    prop[beginSingleCommentIndex] = span_comment_len + substrOb.str.length;
                    continue forCharLoop;
                }
            }

            // Quotes
            if (c == "'" || c == '"') {
                var quote = c;
                var beginQuoteIndex = charIndex;
                // Here go to end quote
                for (charIndex += 1; charIndex < lineLen; charIndex++) {
                    c = line.charAt(charIndex);
                    if (c == '\\') {
                        charIndex++;
                        continue;
                    }
                    if (c == quote) {
                        // End
                        var substrOb = SyntaxHighlighter.strToXHTML(line.substr(beginQuoteIndex, charIndex - beginQuoteIndex + 1));
                        line = line.substr(0, beginQuoteIndex) + '<span class="quote">' + substrOb.str + '</span>' + line.substr(charIndex + 1);
                        prop[beginQuoteIndex] = span_quote_len + substrOb.str.length;
                        charIndex += (span_quote_len + substrOb.addLen);
                        lineLen += (span_quote_len + substrOb.addLen);
                        continue forCharLoop;
                    }
                }
            }

            // Operators
            if (lang.operator.indexOf(c) != -1) {
                c = (SyntaxHighlighter.xmlEntities[c]) ? SyntaxHighlighter.xmlEntities[c] : c;
                var addLen = span_operator_len + (c.length - 1);
                line = line.substr(0, charIndex) + '<span class="operator">' + c + '</span>' + line.substr(charIndex + 1);
                prop[charIndex] = addLen + c.length;
                charIndex += addLen;
                lineLen += addLen;
                continue forCharLoop;
            }
        }

        // Keywords - not for each char, but each line
        for (var i = 0; i < lang.keyword.length; i++) {
            var keyword = lang.keyword[i];
            var keywordIndex = line.indexOf(keyword);
            while (keywordIndex != -1) {
                if (/(\w|-)/.test(line.charAt(keywordIndex - 1)) || /(\w|-)/.test(line.charAt(keywordIndex + keyword.length))) {
                    keywordIndex = line.indexOf(keyword, keywordIndex + 1);
                    continue;
                }

                var isKeyword = true;
                for (var key in prop) {
                    if (keywordIndex >= parseInt(key) && keywordIndex < (parseInt(key) + parseInt(prop[key]))) {
                        isKeyword = false;
                        break;
                    }
                }
                if (isKeyword) {
                    line = line.substr(0, keywordIndex) + '<span class="keyword">' + keyword + '</span>' + line.substr(keywordIndex + keyword.length);
                    prop[keywordIndex] = keyword.length + span_keyword_len;
                    var tmpOb = {};
                    for (var key in prop) {
                        if (parseInt(key) > keywordIndex) {
                            var newIndex = parseInt(key) + span_keyword_len;
                            tmpOb[newIndex] = prop[key];
                        } else {
                            tmpOb[key] = prop[key];
                        }
                    }
                    prop = SyntaxHighlighter.copyObject(tmpOb);
                    keywordIndex = line.indexOf(keyword, keywordIndex + span_keyword_len + keyword.length);
                } else {
                    keywordIndex = line.indexOf(keyword, keywordIndex + 1);
                }

            }
        }

        lines[lineIndex] = line;
    }

    // Print the lines
    var joinString = '';
    var showLineNumbersThisTime = showLineNumbers;
    var newLines = null;

    if (codeEl.nodeName.toLowerCase() != 'pre') {
        showLineNumbersThisTime = false;
    }

    if (showLineNumbersThisTime) {
        newLines = ['<ol>'];
        for (var i = 0; i < lineCount; i++) {
            newLines.push('<li><span>' + lines[i] + '</span></li>');
        }
        newLines.push('</ol>');
    } else {
        newLines = ['<ul>'];
        for (var i = 0; i < lineCount; i++) {
            newLines.push('<li><span>' + lines[i] + '</span></li>');
        }
        newLines.push('</ul>');
    }

    if (codeEl.outerHTML && codeEl.nodeName.toLowerCase() == 'pre') {
        codeEl.outerHTML = '<pre class="' + codeEl.className + '"><code style="float: left">' + newLines.join('\r') + '</code></pre>';
    } else {
        codeEl.innerHTML = '<code style="float: left">' + newLines.join(joinString) + '</code>';
        // codeEl.innerHTML = '<pre xmlns="http://www.w3.org/1999/xhtml">' + newLines.join(joinString) + '</pre>';
        // For XML, you need to make namespace
        // codeEl.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        // jsdom.innerXHTML(codeEl, '<pre xmlns="http://www.w3.org/1999/xhtml">' + newLines.join(joinString) + '</pre>');
    }

    codeEl.className = codeEl.className + ' highlighted';
};

// C
SyntaxHighlighter.language.c = {
    'comment': {
        'single': {
            'start': '//'
        },
        'multi': {
            'start': '/*',
            'end': '*/'
        }
    },
    'regex': {},
    'keyword': ['auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do', 'double',
        'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'int', 'long', 'register',
        'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union',
        'unsigned', 'void', 'volatile', 'wchar_t', 'while'],
    'operator': ['=', '(', ')', '{', '}', '*', '+', '-', '<', '>', '&', '|', '!', '?', '^', '/',
        ':', '~', '%', '[', ']']
};

// C#
SyntaxHighlighter.language.csharp = {
    'comment': {
        'single': {
            'start': '//'
        },
        'multi': {
            'start': '/*',
            'end': '*/'
        }
    },
    'regex': {},
    'keyword': ['#if', '#else', '#endif', 'abstract', 'as', 'base', 'bool', 'break', 'byte',
        'case', 'catch', 'char', 'checked', 'class', 'const', 'continue', 'decimal', 'default',
        'delegate', 'do', 'double', 'else', 'enum', 'event', 'explicit', 'extern', 'false',
        'finally', 'fixed', 'float', 'for', 'foreach', 'goto', 'get', 'if', 'implicit', 'in',
        'int', 'interface', 'internal', 'is', 'locak', 'long', 'namespace', 'new', 'null',
        'object', 'operator', 'out', 'override', 'params', 'partial', 'private', 'protected',
        'public', 'readonly', 'ref', 'return', 'sbyte', 'sealed', 'set', 'short', 'sizeof',
        'stackalloc', 'static', 'string', 'struct', 'switch', 'this', 'throw', 'true', 'try',
        'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort', 'using', 'value', 'virtual',
        'volatile', 'void', 'where', 'while', 'yield'],
    'operator': ['.', ',', '=', '(', ')', '{', '}', ';', '+', '-', '<', '>', '&', '|', '!',
        '?', '[', ']', '/', '%', '^', ':', '~']
};

// CSS
SyntaxHighlighter.language.css = {
    'comment': {
        'single': {
            'start': ''
        },
        'multi': {
            'start': '/*',
            'end': '*/'
        }
    },
    'regex': {
        'start': '',
        'escape': '',
        'end': ''
    },
    'keyword': ['alignment-adjust', 'alignment-baseline', 'animation', 'animation-delay',
        'animation-direction', 'animation-duration', 'animation-iteration-count',
        'animation-name', 'animation-play-state', 'animation-timing-function', 'appearance',
        'azimuth', 'backface-visibility', 'background', 'background-attachment', 'background-clip',
        'background-color', 'background-image', 'background-origin', 'background-position',
        'background-repeat', 'background-size', 'baseline-shift', 'binding', 'bleed', 'bookmark-label',
        'bookmark-level', 'bookmark-state', 'bookmark-target', 'border', 'border-bottom',
        'border-bottom-color', 'border-bottom-left-radius', 'border-bottom-right-radius',
        'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-color',
        'border-image', 'border-image-outset', 'border-image-repeat', 'border-image-slice',
        'border-image-source', 'border-image-width', 'border-left', 'border-left-color',
        'border-left-style', 'border-left-width', 'border-radius', 'border-right',
        'border-right-color', 'border-right-style', 'border-right-width', 'border-spacing',
        'border-style', 'border-top', 'border-top-color', 'border-top-left-radius',
        'border-top-right-radius', 'border-top-style', 'border-top-width', 'border-width',
        'bottom', 'box-decoration-break', 'box-shadow', 'box-sizing', 'break-after',
        'break-before', 'break-inside', 'caption-side', 'clear', 'clip', 'color', 'color-profile',
        'column-count', 'column-fill', 'column-gap', 'column-rule', 'column-rule-color',
        'column-rule-style', 'column-rule-width', 'column-span', 'column-width', 'columns',
        'content', 'counter-increment', 'counter-reset', 'crop', 'cue', 'cue-after', 'cue-before',
        'cursor', 'direction', 'display', 'dominant-baseline', 'drop-initial-after-adjust',
        'drop-initial-after-align', 'drop-initial-before-adjust', 'drop-initial-before-align',
        'drop-initial-size', 'drop-initial-value', 'elevation', 'empty-cells', 'fit', 'fit-position',
        'flex-align', 'flex-flow', 'flex-line-pack', 'flex-order', 'flex-pack', 'float',
        'float-offset', 'font', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch',
        'font-style', 'font-variant', 'font-weight', 'grid-columns', 'grid-rows',
        'hanging-punctuation', 'height', 'hyphenate-after', 'hyphenate-before',
        'hyphenate-character', 'hyphenate-lines', 'hyphenate-resource', 'hyphens', 'icon',
        'image-orientation', 'image-rendering', 'image-resolution', 'inline-box-align', 'left',
        'letter-spacing', 'line-break', 'line-height', 'line-stacking', 'line-stacking-ruby',
        'line-stacking-shift', 'line-stacking-strategy', 'list-style', 'list-style-image',
        'list-style-position', 'list-style-type', 'margin', 'margin-bottom', 'margin-left',
        'margin-right', 'margin-top', 'marker-offset', 'marks', 'marquee-direction', 'marquee-loop',
        'marquee-play-count', 'marquee-speed', 'marquee-style', 'max-height', 'max-width',
        'min-height', 'min-width', 'move-to', 'nav-down', 'nav-index', 'nav-left', 'nav-right',
        'nav-up', 'opacity', 'orphans', 'outline', 'outline-color', 'outline-offset',
        'outline-style', 'outline-width', 'overflow', 'overflow-style', 'overflow-wrap',
        'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left',
        'padding-right', 'padding-top', 'page', 'page-break-after', 'page-break-before',
        'page-break-inside', 'page-policy', 'pause', 'pause-after', 'pause-before',
        'perspective', 'perspective-origin', 'phonemes', 'pitch', 'pitch-range', 'play-during',
        'position', 'presentation-level', 'punctuation-trim', 'quotes', 'rendering-intent',
        'resize', 'rest', 'rest-after', 'rest-before', 'richness', 'right', 'rotation',
        'rotation-point', 'ruby-align', 'ruby-overhang', 'ruby-position', 'ruby-span', 'size',
        'speak', 'speak-header', 'speak-numeral', 'speak-punctuation', 'speech-rate', 'stress',
        'string-set', 'tab-size', 'table-layout', 'target', 'target-name', 'target-new',
        'target-position', 'text-align', 'text-align-last', 'text-decoration',
        'text-decoration-color', 'text-decoration-line', 'text-decoration-skip',
        'text-decoration-style', 'text-emphasis', 'text-emphasis-color',
        'text-emphasis-position', 'text-emphasis-style', 'text-height', 'text-indent',
        'text-justify', 'text-outline', 'text-shadow', 'text-space-collapse', 'text-transform',
        'text-underline-position', 'text-wrap', 'top', 'transform', 'transform-origin',
        'transform-style', 'transition', 'transition-delay', 'transition-duration',
        'transition-property', 'transition-timing-function', 'unicode-bidi', 'vertical-align',
        'visibility', 'voice-balance', 'voice-duration', 'voice-family', 'voice-pitch',
        'voice-pitch-range', 'voice-rate', 'voice-stress', 'voice-volume', 'volume',
        'white-space', 'widows', 'width', 'word-break', 'word-spacing', 'word-wrap', 'z-index'],
    'operator': ['(', ')', '"', "'", ';', ':', '#', '.', ',', '{', '}']
};

// JS
SyntaxHighlighter.language.js = {
    'comment': {
        'single': {
            'start': '//'
        },
        'multi': {
            'start': '/*',
            'end': '*/'
        }
    },
    'regex': {
        'start': '/',
        'escape': '\\',
        'end': '/'
    },
    'keyword': ['arguments', 'break', 'case', 'catch', 'continue', 'debugger',
          'default', 'delete', 'do', 'else', 'each', 'finally', 'for', 'forEach',
          'function', 'if', 'in', 'instanceof', 'new', 'return', 'switch', 'this',
          'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'class',
          'enum', 'export', 'extends', 'import', 'super', 'implements',
          'interface', 'let', 'package', 'private', 'protected', 'public',
          'static', 'yield'],
    'operator': ['=', '(', ')', '{', '}', '+', '-', '!', '?', '<', '>', ';', ':', ',', '.', '[', ']', '&']
};

// SQL
SyntaxHighlighter.language.sql = {
    'comment': {
        'multi': {
            'start': '<!--',
            'end': '-->'
        }
    },
    'regex': {},
    'keyword': ['add', 'alter', 'and', 'as', 'column', 'create', 'database', 'delete',
        'describe', 'distinct', 'do', 'drop', 'explain', 'from', 'group by',
        'handler', 'index', 'insert', 'into', 'inner join', 'join', 'left join',
        'limit', 'on', 'optimize', 'order by', 'outer join', 'rename', 'replace',
        'right join', 'select', 'set', 'show', 'table', 'update', 'use', 'union', 'where'],
    'operator': ['<', '>', '=', '(', ')', '*', ';', '!', ',']
};

// PHP
SyntaxHighlighter.language.php = {
    'comment': {
        'single': {
            'start': '//'
        },
        'multi': {
            'start': '/*',
            'end': '*/'
        }
    },
    'regex': {},
    'keyword': ['abstract', 'array', 'as', 'bool', 'boolean', 'break', 'case', 'catch', 'class', 'clone',
        'const', 'continue', 'declare', 'default', 'define', 'do', 'echo', 'else', 'elseif', 'empty', 'exit',
        'extends', 'filter_var', 'final', 'for', 'foreach', 'function', 'if', 'implements', 'include',
        'include_once', 'int', 'interface', 'isset', 'list', 'new', 'null', 'object', 'print', 'private',
        'protected', 'public', 'require', 'require_once', 'return', 'static', 'string', 'switch',
        'throw', 'try', 'unset', 'while'],
    'operator': ['=', '(', ')', '{', '}', '+', '-', '!', '?', '<', '>', '&', ';', '.', '[', ']', '%']
};

// Python
SyntaxHighlighter.language.python = {
    'comment': {
        'single': {
            'start': '#'
        },
        'multi': {
            'start': '\'\'\'',
            'end': '\'\'\''
        }
    },
    'regex': {},
    'keyword': ['and', 'as', 'assert', 'break', 'cat', 'class', 'continue', 'chmod', 'chown', 'cd', 'cp', 'def', 'del',
        'dict', 'easy_install', 'elif', 'else', 'except', 'exec', 'False', 'find', 'finally', 'for', 'from', 'grep',
        'git', 'global', 'gzip', 'htpasswd', 'if', 'import', 'in', 'is', 'lambda', 'list', 'ls', 'mkdir', 'mock', 'mv',
        'None', 'not', 'or', 'pass', 'pip', 'print', 'pss', 'raise', 'return', 'rename', 'rm', 'set', 'scp', 'svn',
        'tail', 'True', 'try', 'tuple', 'unzip', 'vi', 'vim', 'while', 'with', 'wget', 'xargs', 'yield', 'yum', 'zip'],
    'operator': ['=', '(', ')', '{', '}', ':', '+', '-', '!', '<', '>', ';', '.', '%', '/', '[', ']', '|', '^',
        '~', '&', '@', '`', '*']
};

// VB
SyntaxHighlighter.language.vb = {
    'comment': {
        'single': {
            'start': "'"
        }
    },
    'regex': {},
    'keyword': ['AddHandler', 'AddressOf', 'Alias', 'And', 'AndAlso', 'As', 'Boolean', 'ByRef', 'Byte', 'ByVal',
        'Call', 'Case', 'Catch', 'CBool', 'CByte', 'CChar', 'CDate', 'CDec', 'CDbl', 'Char', 'CInt', 'Class',
        'CLng', 'CObj', 'Const', 'Continue', 'CSByte', 'CShort', 'CSng', 'CStr', 'CType', 'CUInt', 'CULong',
        'CUShort', 'Date', 'Decimal', 'Declare', 'Default', 'Delegate', 'Dim', 'DirectCast', 'Do', 'Double',
        'Each', 'Else', 'ElseIf', 'End', 'Enum', 'Erase', 'Error', 'Event', 'Exit', 'False', 'Finally', 'For',
        'Friend', 'Function', 'Get', 'GetType', 'Global', 'GoTo', 'Handles', 'If', 'Implements', 'Imports',
        'In', 'Inherits', 'Integer', 'Interface', 'Is', 'IsNot', 'Lib', 'Like', 'Long', 'Loop', 'Me', 'Mod',
        'Module', 'MustInherit', 'MustOverride', 'MyBase', 'MyClass', 'Namespace', 'Narrowing', 'New', 'Next',
        'Not', 'Nothing', 'NotInheritable', 'NotOverridable', 'Object', 'Of', 'On', 'Operator', 'Option',
        'Optional', 'Or', 'OrElse', 'Overloads', 'Overridable', 'Overrides', 'ParamArray', 'Partial', 'Private',
        'Property', 'Protected', 'Public', 'RaiseEvent', 'ReadOnly', 'ReDim', 'REM', 'RemoveHandler', 'Resume',
        'Return', 'SByte', 'Select', 'Set', 'Shadows', 'Shared', 'Short', 'Single', 'Static', 'Step', 'Stop',
        'String', 'Structure', 'Sub', 'SyncLock', 'Then', 'Throw', 'To', 'True', 'Try', 'TryCast', 'TypeOf',
        'UInteger', 'ULong', 'Until', 'UShort', 'Using', 'When', 'While', 'Widening', 'With', 'WithEvents',
        'WriteOnly', 'Xor'],
    'operator': ['=', '(', ')', '+', '-', '<', '>', '&', '/', '^']
};

// Win32
SyntaxHighlighter.language.win32 = {
    'comment': {
        'single': {
            'start': '//'
        },
        'multi': {
            'start': '/*',
            'end': '*/'
        }
    },
    'regex': {},
    'keyword': ['ATOM', 'auto', 'BOOL', 'BOOLEAN', 'break', 'BYTE', 'CALLBACK', 'case', 'char', 'CHAR',
        'COLORREF', 'const', 'CONST', 'continue', 'default', 'do', 'double', 'DWORD', 'else', 'enum',
        'extern', 'float', 'FLOAT', 'for', 'goto', 'HANDLE', 'HBITMAP', 'HBRUSH', 'HCOLORSPACE', 'HCURSOR',
        'HDC', 'HFILE', 'HFONT', 'HICON', 'HINSTANCE', 'HMENU', 'HMODULE', 'HPEN', 'HRESULT', 'HWND', 'if',
        'int', 'INT', 'INT_PTR', 'INT32', 'INT64', 'long', 'LONG', 'LONGLONG', 'LONG_PTR', 'LONG32',
        'LONG64', 'LPARAM', 'LPBOOL', 'LPBYTE', 'LPCSTR', 'LPCTSTR', 'LPCVOID', 'LPCWSTR', 'LPDWORD',
        'LPHANDLE', 'LPINT', 'LPLONG', 'LPSTR', 'LPTSTR', 'LPVOID', 'LPWORD', 'LPWSTR', 'LRESULT',
        'PBOOL', 'PBOOLEAN', 'PBYTE', 'PCHAR', 'PCSTR', 'PCTSTR', 'PCWSTR', 'PDWORD', 'PFLOAT', 'PHANDLE',
        'PINT', 'register', 'return', 'short', 'SHORT', 'signed', 'sizeof', 'static', 'struct', 'switch',
        'TCHAR', 'typedef', 'UCHAR', 'UINT', 'UINT32', 'ULONG', 'UNICODE_STRING', 'union', 'unsigned',
        'USHORT', 'void', 'VOID', 'volatile', 'WCHAR', 'while', 'WINAPI', 'WORD', 'WPARAM'],
    'operator': ['=', '(', ')', '{', '}', ';', '.', ',', '*', '+', '-', '<', '>', '&', '|', '!', '?', '^',
        '/', ':', '~', '%']
};
window.onload = function() {
    SyntaxHighlighter.highlightDocument(showLineNumbers);
};
