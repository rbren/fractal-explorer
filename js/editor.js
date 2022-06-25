const DEFAULT_CODE = `
console.log("hello world");
`

const loadCallbacks = [];
var onEditorLoaded = function(fn) {
  if (window.editor && window.editor.setValue) {
    fn();
  } else {
    loadCallbacks.push(fn);
  }
}

require.config({ paths: { vs: 'node_modules/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], function () {
    let editor = window.editor = monaco.editor.create(document.getElementById('editor'), {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'javascript',
        codeLens: false,
        lineNumbers: true,
        minimap: { enabled: false },
    });
    loadCallbacks.forEach(fn => fn());
    editor.onDidChangeModelContent(function (e) {
      console.log('change');
      window.localStorage.setItem('code', editor.getValue());
    });
    editor.setValue(window.localStorage.getItem('code') || DEFAULT_CODE);
});

