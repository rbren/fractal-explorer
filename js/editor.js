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
    window.editor = monaco.editor.create(document.getElementById('editor'), {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'javascript',
        codeLens: false,
        lineNumbers: true,
        minimap: { enabled: false },
    });
    loadCallbacks.forEach(fn => fn());
    editor.onDidChangeModelContent(function (e) {
      console.log('change');
      localStorage.setItem('code', editor.getValue());
    });
});

